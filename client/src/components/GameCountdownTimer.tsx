import { useState, useEffect } from 'react';

interface GameCountdownTimerProps {
  deployedAt: string;
  onGameStart?: () => void;
  className?: string;
}

export function GameCountdownTimer({ deployedAt, onGameStart, className = "" }: GameCountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const deployTime = new Date(deployedAt).getTime();
      const activationSeconds = 30; // Fixed 30 second countdown for testing
      const gameStartTime = deployTime + (activationSeconds * 1000);
      const now = Date.now();
      const remaining = Math.max(0, gameStartTime - now);
      
      if (remaining === 0 && !hasStarted) {
        setHasStarted(true);
        console.log('Timer reached zero, calling onGameStart');
        onGameStart?.();
      }
      
      return remaining;
    };

    const updateTimer = () => {
      setTimeLeft(calculateTimeLeft());
    };

    // Initial calculation
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [deployedAt, hasStarted, onGameStart]);

  const formatTime = (milliseconds: number) => {
    const seconds = Math.ceil(milliseconds / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (timeLeft === 0) {
    return (
      <div className={`text-sm font-mono text-green-400 animate-pulse ${className}`}>
        🎮 GAME STARTING!
      </div>
    );
  }

  return (
    <div className={`text-sm font-mono text-yellow-400 ${className}`}>
      Starts in: {formatTime(timeLeft)}
    </div>
  );
}