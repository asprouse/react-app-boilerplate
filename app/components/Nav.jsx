import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { logout } from '../actions/AuthActions';

@connect(state => ({ auth: state.auth }))

export default class Nav extends React.Component {
  static propTypes = {
    auth: React.PropTypes.object.isRequired,
    dispatch: React.PropTypes.func.isRequired
  };

  static contextTypes = {
    router: React.PropTypes.object
  };

  handleLogout = (e) => {
    e.preventDefault();
    const { router } = this.context;
    this.props.dispatch(logout({ router }));
  };

  render() {
    let right;

    if (this.props.auth.isLoggedIn) {
      right = (
        <div className="right">
          <div className="logout">
            <a href="#" onClick={this.handleLogout}>Logout</a>
          </div>
        </div>
      );
    } else {
      right = (
        <div className="right">
          <div className="login">
            <Link to="/login">Login</Link>
          </div>
          <div className="sign-up">
            <Link to="/signup"className="round button">Sign Up - Join Today</Link>
          </div>
        </div>
      );
    }


    return (
      <nav className="top-bar" role="navigation">
        <div className="title-area">
          <h1>
            <Link to="/">
              <span className="circle"></span> Fair Tread
            </Link>
          </h1>
        </div>
        {right}
      </nav>
    );
  }

}
