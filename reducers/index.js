import {combineReducers} from 'redux';

const initialState = {
  duration: 6000,
  periods: [
    {
      id: 0,
      timerStart: false,
      totalDuration: 6000,
      timerReset: false,
      active: false,
      currentDuration: null,
    },
  ],
};

const storage = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_STORAGE':
      return action.payload;
    default:
      return state;
  }
};

export default combineReducers({storage});
