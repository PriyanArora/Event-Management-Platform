import { useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';

/**
 * Rotating-word effect based on Aceternity UI's FlipWords
 * (https://ui.aceternity.com/components/flip-words), smoothed for this site:
 * the whole word crossfades with a soft blur instead of per-letter staggering,
 * and every word renders invisibly in the same grid cell so the headline
 * never reflows between words. Respects reduced-motion via MotionConfig.
 */
export function FlipWords({
  words,
  duration = 3000,
  className = '',
}: {
  words: string[];
  duration?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), duration);
    return () => clearInterval(id);
  }, [duration, words.length]);

  return (
    <MotionConfig reducedMotion="user">
      <span className={`relative inline-grid text-left ${className}`}>
        {/* Invisible copies size the slot to the widest word. */}
        {words.map((w) => (
          <span key={w} aria-hidden className="invisible col-start-1 row-start-1 whitespace-nowrap">
            {w}
          </span>
        ))}
        <AnimatePresence initial={false}>
          <motion.span
            key={words[index]}
            initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -14, filter: 'blur(8px)' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="col-start-1 row-start-1 whitespace-nowrap"
          >
            {words[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </MotionConfig>
  );
}
