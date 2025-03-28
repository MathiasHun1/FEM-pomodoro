import { useRef, useEffect, useState, useContext } from 'react';
import { ClockContext } from '../contexts/ClockProvider';

const Display = ({
  minutesDisplay,
  secondsDisplay,
  handleStartTimer,
  handlePauseTimer,
  handleResumeTimer,
  progressPercentage,
}) => {
  const { clockState } = useContext(ClockContext);
  const [strokeLength, setStrokeLength] = useState(0);
  const progressBarRef = useRef(null);

  useEffect(() => {
    setStrokeLength(progressBarRef.current.getTotalLength());
  }, []);

  return (
    <div className="display wrapper">
      <div className="display__clock">
        <p>
          <span className="minute">
            {minutesDisplay.toString().padStart(2, 0)}
          </span>
          :
          <span className="second">
            {secondsDisplay.toString().padStart(2, 0)}
          </span>
        </p>
        <button
          className={`display__clock-control-button ${
            clockState.currentStatus === 'stopped' ? 'visible' : ''
          }`}
          onClick={handleStartTimer}
        >
          start
        </button>
        <button
          className={`display__clock-control-button ${
            clockState.currentStatus === 'running' ? 'visible' : ''
          }`}
          onClick={handlePauseTimer}
        >
          pause
        </button>
        <button
          className={`display__clock-control-button ${
            clockState.currentStatus === 'paused' ? 'visible' : ''
          }`}
          onClick={handleResumeTimer}
        >
          resume
        </button>
        <button
          className={`display__clock-control-button ${
            clockState.currentStatus === 'finished' ? 'visible' : ''
          }`}
          onClick={handleStartTimer}
        >
          restart
        </button>
      </div>
      <svg
        className="progress-bar-svg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
      >
        <circle
          ref={progressBarRef}
          className="progress-bar__progress"
          cx="50"
          cy="50"
          r="44.5"
          style={{
            '--progress-length': strokeLength,
            '--progress-value': progressPercentage,
          }}
        />
      </svg>
    </div>
  );
};

export default Display;
