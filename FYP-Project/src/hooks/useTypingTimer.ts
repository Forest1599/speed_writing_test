import { useState, useEffect, useRef } from 'react';

const useTypingTimer = (duration: number) => {
    const [timeLeft, setTimeLeft] = useState(duration);
    const [isRunning, setIsRunning] = useState(false);
    const timerRef = useRef<number | null>(null);
  
    const start = () => {
      if (timerRef.current) clearInterval(timerRef.current);

      setTimeLeft(duration);
      setIsRunning(true);
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            // onTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    };
  
    const reset = () => {
      setTimeLeft(duration);
      setIsRunning(false);
      if (timerRef.current) clearInterval(timerRef.current);
    };

    const stop = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsRunning(false);
    };
  
    useEffect(() => {
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }, []);
  
    return { timeLeft, isRunning, start, reset, stop };
  };

export default useTypingTimer;