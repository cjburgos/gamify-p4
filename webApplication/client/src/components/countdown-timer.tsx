import { useState, useEffect } from "react";
import moment from "moment";

interface CountdownTimerProps {
  endTime: string | Date;
  className?: string;
}

export function CountdownTimer({ endTime, className = "" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = moment();
      const end = moment(endTime);
      const duration = moment.duration(end.diff(now));

      if (duration.asSeconds() <= 0) {
        setTimeLeft("🔒 LOCKED");
        setIsExpired(true);
        return;
      }

      const minutes = Math.floor(duration.asMinutes());
      const seconds = duration.seconds();
      
      if (minutes > 60) {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        setTimeLeft(`⏱️ ${hours}h ${remainingMinutes}m`);
      } else if (minutes > 0) {
        setTimeLeft(`⏱️ ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft(`⏱️ ${seconds}s`);
      }
      
      setIsExpired(false);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <div className={`font-bold ${isExpired ? "" : "animate-pulse"} ${className}`}>
      {timeLeft}
    </div>
  );
}
