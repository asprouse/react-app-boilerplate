import React                  from 'react';
import { Link }               from 'react-router';

export default class Header extends React.Component {

  render() {
    return (
      <header>
        <h1>
          <Link to="/">
            React App Boilerplate
          </Link>
        </h1>
      </header>
    );
  }
}
