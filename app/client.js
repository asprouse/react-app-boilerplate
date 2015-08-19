import polyfill from 'babel/polyfill';  // eslint-disable-line no-unused-vars
import styles from './styles/main.styl'; // eslint-disable-line no-unused-vars

import React from 'react';
import Router from 'react-router';
import BrowserHistory from 'react-router/lib/BrowserHistory';
import { combineReducers } from 'redux';
import { applyMiddleware } from 'redux';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import middleware from 'redux-thunk';
import NProgress from 'nprogress';

import config from 'config/server';
import Auth from './libs/Auth';
import setTitle from './libs/setPageTitle';
import analytics from './libs/analytics';
import setCookieDomain from './libs/setCookieDomain';
import routes from './routes/routes';
import reducers from './reducers/reducers';
import meta from './layouts/meta';


const cookieDomain = setCookieDomain(document.location.hostname);
const reducer = combineReducers(reducers);
const store = applyMiddleware(middleware)(createStore)(reducer, window.__DATA__);
const history = new BrowserHistory();
const authAgent = new Auth(document, cookieDomain);

let initialRender = true;

if (config.googleAnalyticsId) {
  analytics.init(config.googleAnalyticsId);
}

function appComponent(Component, props) {
  NProgress.configure({
    showSpinner: false,
    trickle    : true
  });

  if (props.route.name === 'app') {
    NProgress.start();
    analytics.sendPageview(props.location.pathname);
  }

  return (
    <Component
      store={store}
      loader={NProgress}
      authAgent={authAgent}
      initialRender={initialRender}
      setTitle={setTitle}
      meta={meta}
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
