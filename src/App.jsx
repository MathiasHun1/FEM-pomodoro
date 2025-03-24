import { useState, useEffect } from 'react';
import './App.css';

import { useRef } from 'react';

function App() {
  /*------------------------------------------*/
  /* ----------- TIMER related--------------- */
  /*------------------------------------------*/

  const [timerRunning, setTimerRunning] = useState(false); // flag
  const [actionText, setActionText] = useState('Start');
  const [selectedMode, setSelectedMode] = useState('pomodoro'); // active mode
  const [targetTimeValue, setTargetTimeValue] = useState({
    pomodoro: 25,
    longBreak: 15,
    shortBreak: 5,
  }); // default target values for each mode
  const [deadline, setDeadline] = useState(''); // calculated target time when start
  const [minutesLeft, setMinutesLeft] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const intervalRef = useRef(null);

  /*------------------------------------------*/
  /* ----------- FORM related ---------------- */
  /*------------------------------------------*/

  const [pompdoroInput, setPomodoroImput] = useState(25);
  const [longBreakInput, setLongBrakInput] = useState(15);
  const [shortBreakInput, setShortBreakInput] = useState(5);
  /*------------------------------------------*/

  // set default values on the first load
  useEffect(() => {}, []);

  // manage the timer based on its state
  useEffect(() => {
    if (timerRunning) {
      console.log('runs');

      intervalRef.current = setInterval(() => {
        const remaining = deadline - Date.now();
        let minutes, seconds;
        if (remaining >= 0) {
          minutes = Math.floor(remaining / (60 * 1000)).toString();
          seconds = Math.floor((remaining % 60000) / 1000).toString();
          setMinutesLeft(minutes);
          setSecondsLeft(seconds);
        } else {
          setMinutesLeft('0');
          setSecondsLeft('0');
          setTimerRunning(false);
          clearInterval(intervalRef.current);
        }
      }, 1000);
    }

    if (!timerRunning) {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [timerRunning]);

  const startTimer = () => {
    // set the text
    setActionText('Pause');
    //set the clock
    setDeadline(Date.now() + targetTimeValue[selectedMode] * 60000 + 1000);
    setTimerRunning(true);
    setMinutesLeft(targetTimeValue[selectedMode]);
    setSecondsLeft(0);
  };

  const stopTimer = () => {
    //set text
    setActionText('Start');
    //reset clock
    initTimer(targetTimeValue[selectedMode]);
  };

  const pauseTimer = () => {
    setActionText('Resume');
    setTimerRunning(false);
  };

  const resumeTimer = () => {
    //set text
    setActionText('Pause');
    // calculate and set the new deadline timesstamp
    const timeLeft = Number(minutesLeft) * 60000 + Number(secondsLeft) * 1000;
    setDeadline(Date.now() + timeLeft + 1000);
    setTimerRunning(true);
  };

  const setTimer = (settings) => {
    const defaultSettings = {
      pomodoro: 25,
      longBreak: 15,
      shortBreak: 5,
    };

    console.log(settings);

    setTargetTimeValue({
      pomodoro: settings.pomodoro ?? defaultSettings.pomodoro,
      longBreak: settings.longBreak ?? defaultSettings.longBreak,
      shortBreak: settings.shortBreak ?? defaultSettings.shortBreak,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const settings = {
      pomodoro: Number(e.target.pomodoro.value),
      longBreak: Number(e.target.long.value),
      shortBreak: Number(e.target.short.value),
    };

    setTimer(settings);
  };

  const handleChangeMode = (mode) => {
    setSelectedMode(mode);
    initTimer(targetTimeValue[mode]);
  };

  //reset timer manually
  const initTimer = (value) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setTimerRunning(false);
    setActionText('Start');
    setMinutesLeft(Number(value));
    setSecondsLeft(0);
  };

  if (!minutesLeft && !secondsLeft) {
    return <div>Loading..</div>;
  }

  return (
    <div className="app">
      <div className="cont">
        <div className="modes-selector">
          <h2>Modes:</h2>
          <button onClick={() => handleChangeMode('pomodoro')}>pomodoro</button>
          <button onClick={() => handleChangeMode('longBreak')}>
            long-break
          </button>
          <button onClick={() => handleChangeMode('shortBreak')}>
            short-break
          </button>
        </div>

        <div className="buttons">
          <button onClick={startTimer}>start</button>
          <button onClick={stopTimer}>stop</button>
          <button onClick={pauseTimer}>pause</button>
          <button onClick={resumeTimer}>resume</button>
        </div>
        <div className="display">
          <h1>
            {minutesLeft.toString().padStart(2, 0)} :{' '}
            {secondsLeft.toString().padStart(2, 0)}
          </h1>
        </div>
        <div>
          <p className="action" style={{ textAlign: 'center' }}>
            Available action: {actionText}
          </p>
        </div>

        <h2>SETTINGS:</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            name="pomodoro"
            value={pompdoroInput}
            onChange={(e) => setPomodoroImput(e.target.value)}
          />
          <input
            type="number"
            name="long"
            value={longBreakInput}
            onChange={({ target }) => setLongBrakInput(target.value)}
          />
          <input
            type="number"
            name="short"
            value={shortBreakInput}
            onChange={(e) => setShortBreakInput(e.target.value)}
          />

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default App;

/*Pseudo

1. Set a base value to extract from
  - how to display it in mm:ss ?
  >> 25min to mils: 25*60*1000 = 1.500.000ms
  >> display ms time to minutes: ms number / (60 * 1000)

2. Sart timer, that substract 1 second in every sec from the base


*/
