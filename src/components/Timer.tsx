import { addSeconds, differenceInSeconds } from "date-fns";
import { useEffect, useState } from "react";

interface TimerProps {
  children(timeLeft: number): React.ReactNode;
  onTimerExpire(): void;
}

const TIMER_LENGTH = 30;

export function Timer({ children, onTimerExpire }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(TIMER_LENGTH);

  useEffect(() => {
    const endTime = addSeconds(new Date(), TIMER_LENGTH);

    const interval = setInterval(
      () => setTimeLeft(differenceInSeconds(endTime, new Date())),
      300
    );
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      onTimerExpire();
      return;
    }
  }, [onTimerExpire, timeLeft]);

  return children(timeLeft);
}
