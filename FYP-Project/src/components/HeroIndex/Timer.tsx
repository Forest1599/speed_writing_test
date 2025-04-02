import { useState, useRef, useEffect } from 'react'

type TimerProps = {
    duration: number;
    isRunning: boolean;
    onTimeUp: () => void;
  };
  
  const Timer: React.FC<TimerProps> = ({ duration, isRunning, onTimeUp }) => {
    const [timeLeft, setTimeLeft] = useState<number>(duration);
    const timerRef = useRef<number | null>(null);
  
    useEffect(() => {
      // Clear any existing interval
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Start a new interval if the timer is running and time is left
      if (isRunning && timeLeft > 0) {
        timerRef.current = window.setInterval(() => {
          setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);
      }
      
      // Handle time up
      if (timeLeft === 0) {
        onTimeUp();
      }
      
      // Cleanup the interval when the component unmounts or the timer stops
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }, [isRunning]);
  
    // Handle the case where timeLeft reaches zero
    useEffect(() => {
      if (timeLeft === 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        onTimeUp();
      }
    }, [timeLeft, onTimeUp]);
  
    // Reset the timer if the duration changes
    useEffect(() => {
      setTimeLeft(duration);
    }, [duration]);
    
    // Calculate the width percentage for the progress bar
    const widthPercentage = ((timeLeft / duration) * 100);

    return (
        <div className="mt-16 bg-gray-800 text-center border-solid border-white p-2 rounded relative">
            <div
                className="absolute left-0 top-0 h-full bg-gray-400 transition-all duration-1000 ease-linear"
                style={{ width: `${widthPercentage}%`, transform: 'translateX(-50%)', left: '50%' }}
            />
            <span className="text-md relative z-10">Time left: {timeLeft}s</span>
        </div>
    );
  };

export default Timer;