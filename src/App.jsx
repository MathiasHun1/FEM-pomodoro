import { useState, useEffect, useRef, useContext } from 'react';
import './App.scss';
import { COLORS, FONTS } from './constants';
import logo from './assets/logo.svg';
import settingsSVG from './assets/icon-settings.svg';
import { ClockContext } from './contexts/ClockProvider';

import SettingsForm from './components/SettingsForm';
import Display from './components/Display';

function App() {
  const { clockState, dispatch } = useContext(ClockContext);
  const [selectedMode, setSelectedMode] = useState('pomodoro'); // active mode
  const [minutesDisplay, setMinutesDisplay] = useState(25);
  const [secondsDisplay, setSecondsDisplay] = useState(0);
  const [fontMode, setFontMode] = useState(FONTS.sans);
  const [colorMode, setColorMode] = useState(COLORS.red);
  const [formOpened, setFormOpened] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(0);

  const intervalRef = useRef(null);

  useEffect(() => {
    setMinutesDisplay(clockState.targetTimeValue[selectedMode]);
  }, [clockState.targetTimeValue, selectedMode]);

  useEffect(() => {
    if (clockState.isRunning) {
      console.log('runs');

      intervalRef.current = setInterval(() => {
        const remaining = clockState.deadline - Date.now();
        const remainingPercentage =
          remaining / (clockState.targetTimeValue[selectedMode] * 60000);

        setProgressPercentage(remainingPercentage);

        let minutes, seconds;
        if (remaining >= 0) {
          minutes = Math.floor(remaining / (60 * 1000)).toString();
          seconds = Math.ceil((remaining % 60000) / 1000).toString();
          setMinutesDisplay(minutes);
          setSecondsDisplay(seconds === '60' ? '0' : seconds);
        } else {
          setMinutesDisplay('0');
          setSecondsDisplay('0');
          dispatch({ type: 'setRunningFlag', payload: false });
          clearInterval(intervalRef.current);
          dispatch({ type: 'setStatus', payload: 'finished' });
          const audio = new Audio('/assets/notification.mp3');
          audio.play();
        }
      }, 1000);
    }

    if (!clockState.isRunning) {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [clockState.isRunning]);

  const handleStartTimer = () => {
    dispatch({ type: 'setStatus', payload: 'running' });
    dispatch({ type: 'setRunningFlag', payload: true });
    dispatch({
      type: 'setDeadline',
      payload: Date.now() + clockState.targetTimeValue[selectedMode] * 60000,
    });
    setMinutesDisplay(clockState.targetTimeValue[selectedMode]);
    setSecondsDisplay(0);
  };

  const handleStopTimer = () => {
    dispatch({ type: 'setStatus', payload: 'stopped' });
    dispatch({ type: 'setRunningFlag', payload: false });
    setMinutesDisplay(clockState.targetTimeValue[selectedMode]);
    setSecondsDisplay(0);
    setProgressPercentage(0);
  };

  const handlePauseTimer = () => {
    dispatch({ type: 'setStatus', payload: 'paused' });
    dispatch({ type: 'setRunningFlag', payload: false });
  };

  const handleResumeTimer = () => {
    dispatch({ type: 'setStatus', payload: 'running' });

    // calculate and set the new deadline timesstamp
    const timeLeft =
      Number(minutesDisplay) * 60000 + Number(secondsDisplay) * 1000;
    dispatch({
      type: 'setDeadline',
      payload: Date.now() + timeLeft,
    });
    dispatch({ type: 'setRunningFlag', payload: true });
  };

  const handleChangeMode = (mode) => {
    setSelectedMode(mode);
    dispatch({ type: 'setStatus', payload: 'stopped' });
    dispatch({ type: 'setRunningFlag', payload: false });
    setMinutesDisplay(clockState.targetTimeValue[mode]);
    setSecondsDisplay(0);
    setProgressPercentage(0);
    setProgressPercentage(0);
  };

  const handleOpenForm = () => {
    handleStopTimer();
    setFormOpened(true);
  };

  if (!minutesDisplay && !secondsDisplay) {
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
          minutesDisplay={minutesDisplay}
          secondsDisplay={secondsDisplay}
          handleStartTimer={handleStartTimer}
          handlePauseTimer={handlePauseTimer}
          handleResumeTimer={handleResumeTimer}
          progressPercentage={progressPercentage}
        />
      </div>

      <div className="settings-button" onClick={handleOpenForm}>
        <img src={settingsSVG} alt="" />
      </div>

      {formOpened && (
        <SettingsForm
          colorMode={colorMode}
          setColorMode={setColorMode}
          fontMode={fontMode}
          setFontMode={setFontMode}
          setFormOpened={setFormOpened}
        />
      )}
    </div>
  );
}

export default App;
