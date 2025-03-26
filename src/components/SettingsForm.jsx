import { COLORS, FONTS } from '../constants';
import { useState } from 'react';

const SettingsForm = ({
  fontMode,
  setFontMode,
  colorMode,
  setColorMode,
  setTimer,
  setFormOpened,
}) => {
  const [pompdoroInput, setPomodoroImput] = useState(25);
  const [longBreakInput, setLongBrakInput] = useState(15);
  const [shortBreakInput, setShortBreakInput] = useState(5);
  const [fontModeInput, setFontModeInput] = useState(FONTS.sans);
  const [colorModeInput, setColorModeInput] = useState(COLORS.red);

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

  return (
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
  );
};

export default SettingsForm;
