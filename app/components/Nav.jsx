import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

@connect(state => ({ auth: state.auth }))

export default class Nav extends React.Component {
  static propTypes = {
    auth: React.PropTypes.object.isRequired,
    dispatch: React.PropTypes.func.isRequired
  };

  render() {
    let right;

    if (this.props.auth.isLoggedIn) {
      right = (
        <div className="right">
          <div className="logout">
            <Link to="/logout">Logout</Link>
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
