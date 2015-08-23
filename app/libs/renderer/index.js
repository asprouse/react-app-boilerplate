import React from 'react';
import Router from 'react-router';
import Location from 'react-router/lib/Location';
import { combineReducers } from 'redux';
import { Provider } from 'react-redux';
import serialize from 'serialize-javascript';
import template from './template';

import createStore from 'app/libs/createStore';
import populateState from 'app/libs/populateState';
import getAsset from 'app/libs/getAsset';
import createRoutes from 'app/routes';
import reducers from 'app/reducers';
import checkAuth from 'app/libs/checkAuth';
import config from 'config/server';

import RouterUtil from './RouterUtil';


const baseContext = {
  facebookAppId: config.facebookAppId,
  appHost: config.appEndpoint,
  jsAsset: getAsset(config.bundle, 'js'),
  cssAsset: getAsset(config.bundle, 'css'),
  vendorAsset: getAsset('vendor', 'js')
};

function renderToString(store, location, initialState) {
  return React.renderToString(
    <Provider store={store}>
      {() => <Router location={location} {...initialState} />}
    </Provider>
  );
}

export default async (req, res) => {
  try {
    const reducer = combineReducers(reducers);
    const store = createStore(reducer);
    const location = new Location(req.path, req.query);
    const routes = createRoutes({ store });

    await checkAuth(req, store.dispatch);

    const { initialState, transition, routeName } = await RouterUtil.run(routes, location);

    // Handle redirect
    if (transition.isCancelled) {
      return res.redirect(302, transition.redirectInfo.pathname);
    }

    // Set 404 if appropriate
    if (routeName === 'not-found') {
      res.status(404);
    }

    await populateState(initialState.components, {
      apiHost: config.apiEndpoint,
      dispatch: store.dispatch,
      location: initialState.location,
      params: initialState.params
    });

    const templateContext = {
      ...baseContext,
      fullPath: req.url,
      data: serialize(store.getState()),
      body: renderToString(store, location, initialState)
    };

    res.send(template(templateContext));
  } catch (err) {
    res.status(500).send(err.stack);
  }
};
