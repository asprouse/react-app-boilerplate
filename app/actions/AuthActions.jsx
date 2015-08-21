import apiCall            from 'app/libs/apiCall';

import * as actionTypes   from '../constants/AuthConstants';


export function setLoggedInState(user) {

  return {
    type: actionTypes.AUTH_LOGGED_IN,
    user: user
  };

}

export function login({ email, password, router }) {

  return dispatch => {

    dispatch({
      type: actionTypes.AUTH_LOGIN_REQUESTED
    });

    return apiCall({
      method: 'POST',
      path  : '/login',
      data  : { email, password }
    })
      .then(res => {
        dispatch({
          type: actionTypes.AUTH_LOGIN_SUCCEED,
          user: res.data
        });
        router.transitionTo('/');

      })
      .catch(res => {
        dispatch({
          type  : actionTypes.AUTH_LOGIN_FAILED,
          errors: {
            code: res.status,
            data: res.data
          }
        });
      });

  };

}


export function logout({ router, backPath }) {
  return dispatch => {
    dispatch({
      type: actionTypes.AUTH_LOGGED_OUT
    });
    router.transitionTo('/logout', null, { backPath });
  };

}
