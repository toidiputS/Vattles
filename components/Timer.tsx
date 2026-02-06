
import React from 'react';
import { useCountdown } from '../hooks/useCountdown';

interface TimerProps {
  endTime: number;
  size?: 'sm' | 'lg';
}

const Timer: React.FC<TimerProps> = ({ endTime, size = 'lg' }) => {
  const [minutes, seconds] = useCountdown(endTime);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  const sizeClasses = size === 'sm'
    ? 'text-2xl font-semibold bg-black/20 px-3 py-1 rounded'
    : 'text-4xl font-bold bg-black/30 px-4 py-1 rounded-md';

  return (
    <div className={`font-orbitron text-white tracking-widest inline-block ${sizeClasses}`}>
        <span>{formattedMinutes}</span>
        <span className="animate-pulse">:</span>
        <span>{formattedSeconds}</span>
    </div>
  );
};

export default Timer;
