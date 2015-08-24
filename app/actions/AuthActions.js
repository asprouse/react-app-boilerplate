import Api from 'app/libs/Api';

import * as actionTypes from '../constants/AuthConstants';


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

    return Api.call({
      method: 'POST',
      path: '/login',
      data: { email, password }
    })
      .then(res => {
        dispatch({
          type: actionTypes.AUTH_LOGIN_SUCCEED,
          user: res.data
        });
        router.transitionTo('/dashboard');

      })
      .catch(res => {
        dispatch({
          type: actionTypes.AUTH_LOGIN_FAILED,
          errors: {
            code: res.status,
            data: res.data
          }
        });
      });
  };
}

export function getUser() {

  return dispatch => {

    dispatch({
      type: actionTypes.AUTH_GET_USER
    });

    return Api.call({
      method: 'GET',
      path: '/users/me'
    })
      .then(res => {
        dispatch({
          type: actionTypes.AUTH_GET_USER_SUCCEED,
          user: res.data
        });
      })
      .catch(res => {
        dispatch({
          type: actionTypes.AUTH_GET_USER_FAILED,
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
