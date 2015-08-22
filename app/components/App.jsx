import React                    from 'react';
import { PropTypes as Type }    from 'react';
import { bindActionCreators }   from 'redux';
import { connect }              from 'react-redux';

import Layout                   from './Layout';

import * as AuthActions         from '../actions/AuthActions';


@connect(state => ({auth: state.auth}))
export default class App extends React.Component {
  static contextTypes = {
    store: React.PropTypes.object
  };

  static propTypes = {
    auth    : Type.object.isRequired,
    dispatch: Type.func.isRequired
  };

  render() {
    const { store } = this.context;
    const { auth, dispatch } = this.props;
    const component = (
      <Layout auth={auth} authActions={bindActionCreators(AuthActions, dispatch)} {...this.props} />
    );

    if (__DEV__) {
      const { DevTools, DebugPanel, LogMonitor } = require('redux-devtools/lib/react');
      return (
        <div>
          {component}
          <DebugPanel bottom={true} top={true} left={true}>
            <DevTools store={store} monitor={LogMonitor} />
          </DebugPanel>
        </div>
      );
    } else {
      return component;
    }
  }

}
