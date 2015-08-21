import React from 'react';
import { Route } from 'react-router';

import App from './components/App';
import Home from './components/Home';
import Login from './components/Login/LoginContainer';
import Logout from './components/Logout/Logout';
import NotFound from './components/NotFound/NotFound';


export default (context) => (

  <Route name="app" component={App}>

    <Route name="home" path="/" component={Home} />
    <Route name="login" path="/login" component={Login} context={context} />
    <Route name="logout" path="/logout" component={Logout} />

    <Route name="not-found" path="*" component={NotFound} />

  </Route>

);
