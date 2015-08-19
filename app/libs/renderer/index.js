import React from 'react';
import Router from 'react-router';
import Location from 'react-router/lib/Location';
import { combineReducers } from 'redux';
import { applyMiddleware } from 'redux';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import middleware from 'redux-thunk';
import serialize from 'serialize-javascript';
import template from './template';

import Auth from 'app/libs/Auth';
import populateState from 'app/libs/populateState';
import getAsset from 'app/libs/getAsset';
import setCookieDomain from 'app/libs/setCookieDomain';
import createRoutes from 'app/routes';
import reducers from 'app/reducers/reducers';

import config from 'config/server';

function getRouteName(branch) {
  return branch[branch.length - 1].name;
}

export default async (req, res, next) => {
  const cookieDomain = setCookieDomain(req.headers.host);

  const templateContext = {
    facebookAppId: config.facebookAppId,
    appHost: config.appEndpoint,
    fullPath: req.url,
    jsAsset: getAsset(config.bundle, 'js'),
    cssAsset: getAsset(config.bundle, 'css'),
    vendorAsset: getAsset('vendor', 'js')
  };

  const reducer = combineReducers(reducers);
  const store = applyMiddleware(middleware)(createStore)(reducer);
  const location = new Location(req.path, req.query);
  const authAgent = new Auth(req, cookieDomain);

  const routes = createRoutes({ store });

  Router.run(routes, location, async (error, initialState, transition) => {
    const routeName = templateContext.route = getRouteName(initialState.branch);

    templateContext.location = initialState.location;
    templateContext.params  = initialState.params;

    // Handle error
    if (error) {
      let err = new Error();
      err.status = error.status || 500;
      return next(err);
    }

    // Handle redirect
    if (transition.isCancelled) {
      return res.redirect(302, transition.redirectInfo.pathname);
    }

    try {
      await populateState(initialState.components, {
        apiHost: config.apiEndpoint,
        auth: authAgent.getAuthHeaders(),
        dispatch: store.dispatch,
        location: initialState.location,
        params: initialState.params
      });

      templateContext.data = serialize(store.getState());

      templateContext.body = React.renderToString(
        <Provider store={store}>
          {() => <Router location={location} {...initialState} />}
        </Provider>
      );

      // Set 404 if appropriate
      if (routeName === 'not-found') {
        res.status(404);
      }

      res.send(template(templateContext));

    } catch (err) {
      res.status(500).send(err.stack);
    }

  });

}
