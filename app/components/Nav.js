import React from 'react';
import { PropTypes as Type } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as AuthActions from '../../actions/AuthActions';

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
        <ul className="title-area">
          <li className="name">
            <h1><a href="/">
              <i className="fa fa-circle color-1"></i> Fair Tread</a>
            </h1>
          </li>

          <li className="toggle-topbar menu-icon">
            <a href="/"><span>&nbsp;</span></a>
          </li>
        </ul>

        <section className="top-bar-section">

          <ul className="right">

            <li><a href="/login">Login</a></li>
            <li className="active">
              <a href="/signup"  className="round button">Sign Up - Join Today</a>
            </li>
            <li><a href="#nav"><i className="fa fa-bars"></i></a></li>
          </ul>
        </section>
      </nav>
    );
  }

}
