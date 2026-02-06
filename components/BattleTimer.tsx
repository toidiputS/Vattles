
import React from 'react';
import { useCountdown } from '../hooks/useCountdown';
import { ClockIcon } from './icons';

interface BattleTimerProps {
  startTime: number;
  timeLimit: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const BattleTimer: React.FC<BattleTimerProps> = ({ startTime, timeLimit, size = 'md', showIcon = false }) => {
  const endTime = startTime + timeLimit * 60 * 1000;
  const [minutes, seconds] = useCountdown(endTime);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');
  
  const isExpired = minutes <= 0 && seconds <= 0;
  const totalSeconds = minutes * 60 + seconds;
  const isQuickBattle = timeLimit === 1;

  let isUrgent = false;
  let isCritical = false;

  if (isQuickBattle) {
      isUrgent = !isExpired && totalSeconds <= 30;
      isCritical = !isExpired && totalSeconds <= 10;
  } else {
      isUrgent = !isExpired && minutes < 5;
      isCritical = !isExpired && minutes < 1;
  }

  let sizeClasses = '';
  switch (size) {
      case 'sm': sizeClasses = 'text-xs px-2 py-0.5 rounded'; break;
      case 'md': sizeClasses = 'text-sm px-3 py-1 rounded-md'; break;
      case 'lg': sizeClasses = 'text-2xl md:text-4xl px-6 py-2 md:py-3 min-w-[160px] md:min-w-[220px] rounded-xl border-2'; break;
  }

  let colorClasses = '';
  if (isExpired) {
      colorClasses = 'text-red-500 border-red-500/50 bg-red-950/80 shadow-[0_0_15px_rgba(239,68,68,0.5)]';
  } else if (isCritical) {
      colorClasses = 'text-red-400 border-red-500/80 bg-red-900/40 shadow-[0_0_20px_rgba(248,113,113,0.6)] animate-pulse';
  } else if (isUrgent) {
      colorClasses = 'text-orange-400 border-orange-500/60 bg-orange-900/40 shadow-[0_0_15px_rgba(251,146,60,0.4)]';
  } else {
      colorClasses = 'text-cyan-300 border-cyan-500/40 bg-cyan-950/40 shadow-[0_0_15px_rgba(34,211,238,0.25)]';
  }

  // Base border for sm/md if not already defined by size (lg defines border-2)
  if (size !== 'lg') {
      colorClasses += ' border';
  }

  // Additional scale effect for Quick Battle critical moments in large view
  const extraEffects = (isQuickBattle && isCritical && size === 'lg') ? 'scale-110' : '';

  return (
    <div className={`font-orbitron font-bold tracking-widest flex items-center justify-center gap-2 transition-all duration-500 backdrop-blur-md z-50 ${sizeClasses} ${colorClasses} ${extraEffects}`}>
        {showIcon && <ClockIcon className={size === 'lg' ? "h-6 w-6 md:h-8 md:w-8" : "h-3 w-3"} />}
        <span>
            {isExpired ? 'TIME UP' : `${formattedMinutes}:${formattedSeconds}`}
        </span>
    </div>
  );
};

export default BattleTimer;
