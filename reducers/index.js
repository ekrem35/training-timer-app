import {combineReducers} from 'redux';

const initialState = {periods: []};

const storage = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_STORAGE':
      return action.payload;
    default:
      return state;
  }
};

export default combineReducers({storage});
