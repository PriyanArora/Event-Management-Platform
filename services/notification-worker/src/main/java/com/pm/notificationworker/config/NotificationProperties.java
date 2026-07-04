package com.pm.notificationworker.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "qeue.notification")
public class NotificationProperties {
    private boolean mailhogEnabled = false;

    public boolean isMailhogEnabled() {
        return mailhogEnabled;
    }

    public void setMailhogEnabled(boolean mailhogEnabled) {
        this.mailhogEnabled = mailhogEnabled;
    }
}
