import React from 'react';
import { PropTypes as Type } from 'react';

import Topbar from '../components/Topbar/TopbarContainer';


export default class Layout extends React.Component {

  static propTypes = {
    children : Type.object,
    location : Type.object
  };

  render() {
    return (
        <section id="layout">
          <Topbar />
          {this.props.children}
        </section>
    );
  }
}
