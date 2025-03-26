import { useRef, useEffect, useState } from 'react';

const Display = ({
  minutesLeft,
  secondsLeft,
  clockState,
  startTimer,
  pauseTimer,
  resumeTimer,
  progressPercentage,
}) => {
  const [strokeLength, setStrokeLength] = useState(0);
  const progressBarRef = useRef(null);

  useEffect(() => {
    setStrokeLength(progressBarRef.current.getTotalLength());
  }, []);

  return (
    <div className="display">
      <div className="display__clock-wrapper">
        <p className="display__clock">
          {minutesLeft.toString().padStart(2, 0)}:
          {secondsLeft.toString().padStart(2, 0)}
          <button
            className={`display__clock-control-button ${
              clockState === 'stopped' ? 'visible' : ''
            }`}
            onClick={startTimer}
          >
            start
          </button>
          <button
            className={`display__clock-control-button ${
              clockState === 'running' ? 'visible' : ''
            }`}
            onClick={pauseTimer}
          >
            pause
          </button>
          <button
            className={`display__clock-control-button ${
              clockState === 'paused' ? 'visible' : ''
            }`}
            onClick={resumeTimer}
          >
            resume
          </button>
          <button
            className={`display__clock-control-button ${
              clockState === 'finished' ? 'visible' : ''
            }`}
            onClick={startTimer}
          >
            restart
          </button>
        </p>
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
