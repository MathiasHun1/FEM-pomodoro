import { createContext, useReducer } from 'react';

export const ClockContext = createContext('');

const defaultState = {
  isRunning: false,
  currentStatus: 'stopped',
  targetTimeValue: {
    pomodoro: 25,
    longBreak: 15,
    shortBreak: 1,
  },
  deadline: null,
};

const clockReducer = (state, action) => {
  switch (action.type) {
    case 'setRunningFlag': {
      return { ...state, isRunning: action.payload };
    }
    case 'setStatus': {
      return { ...state, currentStatus: action.payload };
    }
    case 'setTargetTime': {
      return {
        ...state,
        targetTimeValue: { ...state.targetTimeValue, ...action.payload },
      };
    }
    case 'setDeadline': {
      return { ...state, deadline: action.payload };
    }
    default:
      throw new Error(
        `unknown action: ${action.type}, payload: ${action.payload}`
      );
  }
};

const ClockProvider = ({ children }) => {
  const [clockState, dispatch] = useReducer(clockReducer, defaultState);

  return (
    <ClockContext.Provider value={{ clockState, dispatch }}>
      {children}
    </ClockContext.Provider>
  );
};

export default ClockProvider;
