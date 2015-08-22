import React from 'react';
import { Link } from 'react-router';

export default class Nav extends React.Component {

  render() {
    return (
      <nav className="top-bar" role="navigation">
        <div className="title-area">
          <h1>
            <Link to="/">
              <span className="circle"></span> Fair Tread
            </Link>
          </h1>
        </div>

        <div className="right">
          <div className="login">
            <Link to="/login">Login</Link>
          </div>
          <div className="sign-up">
            <Link to="/signup"  className="round button">Sign Up - Join Today</Link>
          </div>
        </div>
      </nav>
    );
  }

}
