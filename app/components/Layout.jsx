import React from 'react';
import { PropTypes as Type } from 'react';

import Topbar from '../components/Topbar/TopbarContainer';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';


export default class Layout extends React.Component {

  static propTypes = {
    children : Type.object,
    location : Type.object
  };

  render() {
    return (
        <section id="layout">
          <Topbar />
          <Header location={this.props.location}/>
          {this.props.children}
          <Footer />
        </section>
    );
  }
}
