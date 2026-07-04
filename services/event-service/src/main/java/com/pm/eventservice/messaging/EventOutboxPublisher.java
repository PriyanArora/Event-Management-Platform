package com.pm.eventservice.messaging;

import com.pm.eventservice.config.EventRabbitProperties;
import com.pm.eventservice.model.EventOutboxMessage;
import com.pm.eventservice.model.OutboxStatus;
import com.pm.eventservice.repository.EventOutboxRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.AmqpException;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Component
public class EventOutboxPublisher {
    private static final Logger log = LoggerFactory.getLogger(EventOutboxPublisher.class);

    private final EventOutboxRepository outboxRepository;
    private final RabbitTemplate rabbitTemplate;
    private final EventRabbitProperties properties;

    public EventOutboxPublisher(EventOutboxRepository outboxRepository,
                                RabbitTemplate rabbitTemplate,
                                EventRabbitProperties properties) {
        this.outboxRepository = outboxRepository;
        this.rabbitTemplate = rabbitTemplate;
        this.properties = properties;
    }

    @Scheduled(fixedDelayString = "${qeue.rabbitmq.publisher-fixed-delay-ms:5000}")
    public void publishPendingIfEnabled() {
        if (properties.isPublisherEnabled()) {
            publishPending();
        }
    }

    @Transactional
    public int publishPending() {
        int publishedCount = 0;
        for (EventOutboxMessage message : outboxRepository.findByStatusOrderByCreatedAtAsc(OutboxStatus.PENDING)) {
            if (!publishOne(message)) {
                // Broker is unreachable; later messages will fail too. Stop and
                // retry the whole batch on the next scheduled run, preserving order.
                break;
            }
            if (message.getStatus() == OutboxStatus.PUBLISHED) {
                publishedCount++;
            }
        }
        return publishedCount;
    }

    private boolean publishOne(EventOutboxMessage message) {
        String routingKey;
        try {
            routingKey = routingKeyFor(message);
        } catch (IllegalArgumentException ex) {
            // Permanently unroutable message: mark FAILED so it never blocks the queue.
            message.setStatus(OutboxStatus.FAILED);
            outboxRepository.save(message);
            log.error(
                    "Unroutable event outbox message action=publish_outbox messageId={} aggregateId={} eventType={} reason={}",
                    message.getId(),
                    message.getAggregateId(),
                    message.getEventType(),
                    ex.getMessage()
            );
            return true; // continue with the rest of the batch
        }

        try {
            rabbitTemplate.convertAndSend(
                    properties.getExchange(),
                    routingKey,
                    message.getPayloadJson(),
                    rabbitMessage -> {
                        MessageProperties messageProperties = rabbitMessage.getMessageProperties();
                        messageProperties.setMessageId(message.getId().toString());
                        messageProperties.setContentType(MessageProperties.CONTENT_TYPE_JSON);
                        messageProperties.setHeader("eventType", message.getEventType());
                        messageProperties.setHeader("aggregateId", message.getAggregateId().toString());
                        return rabbitMessage;
                    }
            );
            message.setStatus(OutboxStatus.PUBLISHED);
            message.setPublishedAt(Instant.now());
            outboxRepository.save(message);
            return true;
        } catch (AmqpException ex) {
            // Transient broker failure: leave PENDING so the next run retries it
            // instead of silently dropping the event.
            log.warn(
                    "Failed to publish event outbox message, will retry action=publish_outbox messageId={} aggregateId={} eventType={} reason={}",
                    message.getId(),
                    message.getAggregateId(),
                    message.getEventType(),
                    ex.getMessage()
            );
            return false;
        }
    }

    private String routingKeyFor(EventOutboxMessage message) {
        return switch (message.getEventType()) {
            case "EventPublished" -> properties.getEventPublishedRoutingKey();
            case "EventCancelled" -> properties.getEventCancelledRoutingKey();
            default -> throw new IllegalArgumentException("Unsupported event outbox type " + message.getEventType());
        };
    }
}
