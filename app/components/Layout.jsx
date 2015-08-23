import React from 'react';
import { PropTypes as Type } from 'react';

import Nav from './Nav';


export default class Layout extends React.Component {

  static propTypes = {
    children: Type.object,
    location: Type.object
  };

  render() {
    return (
        <section id="page-wrapper">
          <Nav />
          {this.props.children}
        </section>
    );
  }
}
