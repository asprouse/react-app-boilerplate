import { createStore, applyMiddleware, compose } from 'redux';
import middleware from 'redux-thunk';

let finalCreateStore;

if(__DEV__) {
  const { devTools } = require('redux-devtools');
  finalCreateStore = compose(
    applyMiddleware(middleware),
    devTools(),
    createStore
  );
} else {
  finalCreateStore = compose(
    applyMiddleware(middleware),
    createStore
  );
}

export default finalCreateStore;
