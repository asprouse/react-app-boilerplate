import polyfill from 'babel/polyfill';  // eslint-disable-line no-unused-vars
import styles from './styles/main.styl'; // eslint-disable-line no-unused-vars

import React from 'react';
import Router from 'react-router';
import BrowserHistory from 'react-router/lib/BrowserHistory';
import { combineReducers } from 'redux';
import { Provider } from 'react-redux';
import createStore from './libs/createStore';

import config from 'config/server';
import analytics from './libs/analytics';
import routes from './routes';
import reducers from './reducers';


const reducer = combineReducers(reducers);
const store = createStore(reducer, window.__DATA__);
const history = new BrowserHistory();

let initialRender = true;

if (config.googleAnalyticsId) {
  analytics.init(config.googleAnalyticsId);
}

function appComponent(Component, props) {
  if (props.route.name === 'app') {
    analytics.sendPageview(props.location.pathname);
  }

  return (
    <Component
      store={store}
      initialRender={initialRender}
      {...props}
      />
  );
}

const AppContainer = (
  <Provider store={store}>
    {() => <Router history={history} children={routes({ store })} createElement={appComponent} />}
  </Provider>
);


const appDOMNode = document.getElementById('app');

React.render(AppContainer, appDOMNode, () => initialRender = false);
