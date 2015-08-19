import React from 'react';
import { Route } from 'react-router';

import App from './components/App';
import Login from './components/Login/LoginContainer';
import Logout from './components/Logout/Logout';
import NotFound from './components/NotFound/NotFound';


export default (context) => (

  <Route name="app" component={App}>

    <Route name="login" path="/" component={Login} context={context} onEnter={Login.DecoratedComponent.checkAuth} />
    <Route name="logout" path="/logout" component={Logout} />

    <Route name="not-found" path="*" component={NotFound} />

  </Route>

);
