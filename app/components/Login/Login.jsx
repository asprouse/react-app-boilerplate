import React                  from 'react';
import { PropTypes as Type }  from 'react';

import animate                from 'app/libs/animate';
import analytics              from 'app/libs/analytics';

import * as actionTypes       from '../../constants/AuthConstants';


export default class Login extends React.Component {


  static propTypes = {

    auth: Type.shape({
      type     : Type.string,
      isLoading: Type.bool
    }).isRequired,

    authActions: Type.shape({
      login: Type.func.isRequired
    }).isRequired
  };


  static contextTypes = {
    router: Type.object.isRequired
  };


  constructor(props, context) {

    super(props, context);

    this.state = {
      login        : null,
      loginState   : null,
      password     : null,
      passwordState: null
    };

  }

  componentWillReceiveProps(newProps) {

    const { type } = newProps.auth;

    if (type === actionTypes.AUTH_LOGIN_FAILED) {
      this._handleFailedSubmit();
    }
  }


  _handleValueChange(e) {
    const { name, value } = e.target;

    this.setState({
      [name]: value.trim()
    });

  }


  _handleSuccessSubmit(e) {
    e.preventDefault();

    const { login, password } = this.state;
    const { authActions } = this.props;
    const { router } = this.context;

    authActions.login({ email: login, password, router });

    analytics.sendEvent({
      category: 'Login',
      action  : 'Submitted'
    });

  }


  _handleFailedSubmit() {
    animate('login__form', 'shake');
  }



  render() {

    const { isLoading } = this.props.auth;

    return (
        <section id="login">
          <form id="login__form" onSubmit={::this._handleSuccessSubmit}>
            <input
                type="text"
                ref="login"
                name="login"
                placeholder="Email"
                value={this.state.login}
                className={this.state.loginStatus}
                onChange={::this._handleValueChange}
                autoFocus={true}
            />
            <input
                type="password"
                ref="password"
                name="password"
                placeholder="Password"
                value={this.state.password}
                className={this.state.passwordStatus}
                onChange={::this._handleValueChange}
            />
            <div className="button-wrapper">
              <button disabled={isLoading}>Login!</button>
            </div>
          </form>
        </section>
    );

  }


}
