/**
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import {persistReducer, persistStore} from 'redux-persist';
import {PersistGate} from 'redux-persist/integration/react';
import reducers from './reducers';
import AsyncStorage from '@react-native-community/async-storage';
import {composeWithDevTools} from 'remote-redux-devtools';
import thunkMiddleware from 'redux-thunk';
import MainScreen from './screens/MainScreen';

const config = {
  key: 'root',
  whitelist: ['storage'],
  storage: AsyncStorage,
  timeout: 0,
};

const persistedReducer = persistReducer(config, reducers);
const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(thunkMiddleware)),
);
const persistor = persistStore(store);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <MainScreen />
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
