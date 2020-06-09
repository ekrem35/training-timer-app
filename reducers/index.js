import {combineReducers} from 'redux';

const initialState = {
  duration: 5000,
  periods: [
    {
      id: 0,
      timerStart: false,
      totalDuration: 5000,
      timerReset: false,
      active: true,
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
