import { useState, useEffect, useRef } from 'react';
import './App.scss';
import { COLORS, FONTS } from './constants';
import logo from './assets/logo.svg';
import settingsSVG from './assets/icon-settings.svg';

import SettingsForm from './components/SettingsForm';
import Display from './components/Display';

function App() {
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
  const [fontMode, setFontMode] = useState(FONTS.sans);
  const [colorMode, setColorMode] = useState(COLORS.red);
  const [formOpened, setFormOpened] = useState(false);

  // progress-bar things
  const [progressPercentage, setProgressPercentage] = useState(0);

  useEffect(() => {
    setMinutesLeft(targetTimeValue[selectedMode]);
  }, [targetTimeValue]);

  useEffect(() => {
    if (timerRunning) {
      console.log('runs');

      intervalRef.current = setInterval(() => {
        const remaining = deadline - Date.now();
        const remainingPercentage =
          remaining / (targetTimeValue[selectedMode] * 60000);

        setProgressPercentage(remainingPercentage);

        let minutes, seconds;
        if (remaining >= 0) {
          minutes = Math.floor(remaining / (60 * 1000)).toString();
          seconds = Math.ceil((remaining % 60000) / 1000).toString();
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
    setDeadline(Date.now() + targetTimeValue[selectedMode] * 60000);
    setTimerRunning(true);
    setMinutesLeft(targetTimeValue[selectedMode]);
    setSecondsLeft(0);
  };

  const stopTimer = () => {
    //set text
    setclockState('stopped');
    //reset clock
    initTimer(targetTimeValue[selectedMode]);
    //reset progress
    setProgressPercentage(0);
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
    setDeadline(Date.now() + timeLeft);
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
    setProgressPercentage(0);
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

      <div className="display-wrapper">
        <Display
          minutesLeft={minutesLeft}
          secondsLeft={secondsLeft}
          clockState={clockState}
          startTimer={startTimer}
          pauseTimer={pauseTimer}
          resumeTimer={resumeTimer}
          progressPercentage={progressPercentage}
        />
      </div>

      <div className="settings-button" onClick={handleOpenForm}>
        <img src={settingsSVG} alt="" />
      </div>
      {/*--------------------------------------------------*/}

      {formOpened && (
        <SettingsForm
          colorMode={colorMode}
          setColorMode={setColorMode}
          fontMode={fontMode}
          setFontMode={setFontMode}
          setTimer={setTimer}
          setFormOpened={setFormOpened}
        />
      )}
    </div>
  );
}

export default App;
