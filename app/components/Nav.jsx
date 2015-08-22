import React from 'react';
import { PropTypes as Type } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as AuthActions from '../actions/AuthActions';

@connect(state => ({ auth: state.auth }))
export default class Nav extends React.Component {
  static propTypes = {
    auth    : Type.object.isRequired,
    dispatch: Type.func.isRequired
  };

  render() {
    const { auth, dispatch } = this.props;

    return (
      <nav className="top-bar" role="navigation">
        <div className="title-area">
          <h1>
            <a href="/">
              <span className="circle"></span> Fair Tread
            </a>
          </h1>
        </div>



        <div className="right">
          <div className="login">
            <a href="/login">Login</a>
          </div>
          <div className="sign-up">
            <a href="/signup"  className="round button">Sign Up - Join Today</a>
          </div>
        </div>
      </nav>
    );
  }

}
