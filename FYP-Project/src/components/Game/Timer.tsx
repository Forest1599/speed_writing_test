import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';

type TimerProps = {
    duration: number;
    timeLeft: number;
  };
  
  const Timer: React.FC<TimerProps> = ({ duration, timeLeft }) => {    
    
    // Calculate the width percentage for the progress bar
    const percentage = ((timeLeft / duration) * 100);

    return (
      
      <div className="flex justify-center">
        <div style={{ width: 50, height: 50 }}>
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
      </div>


    );
  };

export default Timer;