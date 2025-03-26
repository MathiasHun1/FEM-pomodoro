import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRef } from 'react';
import './App.scss';

import { COLORS, FONTS } from './constants';
import logo from './assets/logo.svg';
import settingsSVG from './assets/icon-settings.svg';

function App() {
  /*------------------------------------------*/
  /* ----------- TIMER related--------------- */
  /*------------------------------------------*/

  const [timerRunning, setTimerRunning] = useState(false); // flag
  const [clockState, setclockState] = useState('stopped');
  const [selectedMode, setSelectedMode] = useState('pomodoro'); // active mode
  const [targetTimeValue, setTargetTimeValue] = useState({
    pomodoro: 25,
    longBreak: 15,
    shortBreak: 1,
  }); // default target values for each mode
  const [deadline, setDeadline] = useState(''); // calculated target time when start
  const [minutesLeft, setMinutesLeft] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const intervalRef = useRef(null);

  /*------------------------------------------*/
  /* ----------- FORM related ---------------- */
  /*------------------------------------------*/

  const [formOpened, setFormOpened] = useState(false);
  const [pompdoroInput, setPomodoroImput] = useState(25);
  const [longBreakInput, setLongBrakInput] = useState(15);
  const [shortBreakInput, setShortBreakInput] = useState(5);
  const [fontModeInput, setFontModeInput] = useState(FONTS.sans);
  const [fontMode, setFontMode] = useState(FONTS.sans);
  const [colorModeInput, setColorModeInput] = useState(COLORS.red);
  const [colorMode, setColorMode] = useState(COLORS.red);
  /*------------------------------------------*/

  // set default values on the first load
  useEffect(() => {
    setMinutesLeft(targetTimeValue[selectedMode]);
  }, [targetTimeValue]);

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
          setclockState('finished');
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
    setclockState('running');
    //set the clock
    setDeadline(Date.now() + targetTimeValue[selectedMode] * 60000 + 1000);
    setTimerRunning(true);
    setMinutesLeft(targetTimeValue[selectedMode]);
    setSecondsLeft(0);
  };

  const stopTimer = () => {
    //set text
    setclockState('stopped');
    //reset clock
    initTimer(targetTimeValue[selectedMode]);
  };

  const pauseTimer = () => {
    setclockState('paused');
    setTimerRunning(false);
  };

  const resumeTimer = () => {
    //set text
    setclockState('running');
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

    setTargetTimeValue({
      pomodoro: settings.pomodoro ?? defaultSettings.pomodoro,
      longBreak: settings.longBreak ?? defaultSettings.longBreak,
      shortBreak: settings.shortBreak ?? defaultSettings.shortBreak,
    });
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
    setclockState('stopped');
    setMinutesLeft(Number(value));
    setSecondsLeft(0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const settings = {
      pomodoro: Number(e.target.pomodoro.value),
      longBreak: Number(e.target.long.value),
      shortBreak: Number(e.target.short.value),
    };

    setTimer(settings);
    setFontMode(fontModeInput);
    setColorMode(colorModeInput);
    setFormOpened(false);
  };

  const handleOpenForm = () => {
    stopTimer();
    setFormOpened(true);
  };

  if (!minutesLeft && !secondsLeft) {
    return <div>Loading..</div>;
  }

  return (
    <div
      className="app"
      style={{ '--clr-primary': colorMode, '--ff-primary': fontMode }}
    >
      <header className="header wrapper">
        <div className="header__logo">
          <img src={logo} alt="pomodoro app logo" />
        </div>

        <nav className="header__controls">
          <button
            onClick={() => handleChangeMode('pomodoro')}
            className={`${selectedMode === 'pomodoro' ? 'active' : ''}`}
          >
            pomodoro
          </button>
          <button
            onClick={() => handleChangeMode('longBreak')}
            className={`${selectedMode === 'longBreak' ? 'active' : ''}`}
          >
            long break
          </button>
          <button
            onClick={() => handleChangeMode('shortBreak')}
            className={`${selectedMode === 'shortBreak' ? 'active' : ''}`}
          >
            short break
          </button>
        </nav>
      </header>

      <div className="display">
        <div>
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
      </div>

      <div className="settings-button" onClick={handleOpenForm}>
        <img src={settingsSVG} alt="" />
      </div>
      {/*--------------------------------------------------*/}

      {formOpened && (
        <div
          className="settings-form-wrapper wrapper"
          style={{
            '--clr-primary': colorMode,
            '--ff-primary': fontMode,
          }}
        >
          <form onSubmit={handleSubmit} className="settings-form">
            <header className="form__header">
              <h1 className="form__title">Settings</h1>
            </header>
            <section className="form__time-section">
              <h2 className="form__sub-title">Time (minutes)</h2>

              <div className="form__time-input-wrapper flow">
                <label
                  className="form__time-input
                  "
                >
                  <span>pomodoro</span>
                  <input
                    type="number"
                    name="pomodoro"
                    value={pompdoroInput}
                    onChange={(e) => setPomodoroImput(e.target.value)}
                  />
                </label>
                <label
                  className="form__time-input
                  "
                >
                  long break
                  <input
                    type="number"
                    name="long"
                    value={longBreakInput}
                    onChange={({ target }) => setLongBrakInput(target.value)}
                  />
                </label>
                <label
                  className="form__time-input
                  "
                >
                  short break
                  <input
                    type="number"
                    name="short"
                    value={shortBreakInput}
                    onChange={(e) => setShortBreakInput(e.target.value)}
                  />
                </label>
              </div>
            </section>
            <section className="form__font-section">
              <h2 className="form__sub-title">Font</h2>
              <div className="circle-buttons-wrapper">
                <button
                  type="button"
                  className={`button-circle ${
                    fontModeInput === FONTS.sans ? 'active' : ''
                  }`}
                  onClick={() => setFontModeInput(FONTS.sans)}
                >
                  Aa
                </button>
                <button
                  type="button"
                  className={`button-circle ${
                    fontModeInput === FONTS.roboto ? 'active' : ''
                  }`}
                  onClick={() => setFontModeInput(FONTS.roboto)}
                >
                  Aa
                </button>
                <button
                  type="button"
                  className={`button-circle ${
                    fontModeInput === FONTS.mono ? 'active' : ''
                  }`}
                  onClick={() => setFontModeInput(FONTS.mono)}
                >
                  Aa
                </button>
              </div>
            </section>
            <section className="form__color-section">
              <h2 className="form__sub-title">Colors</h2>
              <div className="circle-buttons-wrapper">
                <button
                  type="button"
                  className={`button-circle ${
                    colorModeInput === COLORS.red ? 'active' : ''
                  }`}
                  onClick={() => setColorModeInput(COLORS.red)}
                ></button>
                <button
                  type="button"
                  className={`button-circle ${
                    colorModeInput === COLORS.cyan ? 'active' : ''
                  }`}
                  onClick={() => setColorModeInput(COLORS.cyan)}
                ></button>
                <button
                  type="button"
                  className={`button-circle ${
                    colorModeInput === COLORS.purple ? 'active' : ''
                  }`}
                  onClick={() => setColorModeInput(COLORS.purple)}
                ></button>
              </div>
            </section>

            <button type="submit" className="form__submit-button">
              Apply
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
