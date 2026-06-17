import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface CountdownTimerProps {
  targetDate: string; // ISO string or parsable format
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isCompleted: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isCompleted: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isCompleted: false,
      });
    };

    calculateTime();
    const intervalId = setInterval(calculateTime, 1000);

    return () => clearInterval(intervalId);
  }, [targetDate]);

  const timeBlocks = [
    { label: 'дней', val: timeLeft.days, key: 'days' },
    { label: 'часов', val: timeLeft.hours, key: 'hours' },
    { label: 'минут', val: timeLeft.minutes, key: 'minutes' },
    { label: 'секунд', val: timeLeft.seconds, key: 'seconds' },
  ];

  return (
    <div className="flex flex-col items-center">
      {timeLeft.isCompleted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-2xl font-serif text-tilda-beige italic font-medium tracking-wider text-center"
        >
          ✨ Этот счастливый день настал! ✨
        </motion.div>
      ) : (
        <div className="grid grid-cols-4 gap-2 sm:gap-6 text-center max-w-lg w-full">
          {timeBlocks.map((block) => (
            <div key={block.key} className="flex flex-col items-center">
              <div className="relative bg-white/70 backdrop-blur-sm border border-gold-200/50 rounded-xl px-2 py-4 sm:px-4 sm:py-6 w-16 sm:w-24 shadow-md shadow-gold-100/30 overflow-hidden">
                {/* Subtle shine overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />
                
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={block.val}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="block text-2xl sm:text-4xl font-serif font-light text-tilda-beige select-none"
                  >
                    {String(block.val).padStart(2, '0')}
                  </motion.span>
                </AnimatePresence>
              </div>
              <span className="text-[10px] sm:text-xs uppercase font-medium tracking-widest text-[#896e4f]/80 mt-2">
                {block.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
