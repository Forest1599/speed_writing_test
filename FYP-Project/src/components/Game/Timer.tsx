import { useState, useRef, useEffect } from 'react'

import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';

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
    const percentage = ((timeLeft / duration) * 100);

    return (
      
        <div className="mx-auto" style={{ width: 50, height: 50 }}>
            <CircularProgressbarWithChildren
              value={percentage}
              styles={buildStyles({
                pathColor: '#ff4d4d',
                textColor: '#ffffff'
              })}
            >
              <div className="mb-1 mr-px-10" style={{ color: '#ffffff', fontSize: '20px' }}>
                {timeLeft}
              </div>

            </CircularProgressbarWithChildren>
      </div>

    );
  };

export default Timer;