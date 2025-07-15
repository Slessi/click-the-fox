import { useEffect, useState } from "react";

interface TimerProps {
  children(timeLeft: number): React.ReactNode;
  onTimerExpire(): void;
}

export function Timer({ children, onTimerExpire }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (timeLeft === 0) {
      onTimerExpire();
      return;
    }

    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [onTimerExpire, timeLeft]);

  return children(timeLeft);
}
