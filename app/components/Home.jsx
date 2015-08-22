import React from 'react';

export default class Home extends React.Component {

  render() {

    return (
      <div className="homeHero card" id="home-landing">
        <div className="homeHeroMiddle solid">
          <div className="homeHeroInner">
            <div className="logo row">
                <img src="/svg/fairtread-logo-text.svg"/>
            </div>
            <div className="slogan row">
                <h2>Crowdfunding you &amp; your web.</h2>
            </div>
          </div>
        </div>

      </div>
    );
  }

}
