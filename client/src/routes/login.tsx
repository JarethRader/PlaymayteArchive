import * as React from 'react';

import LoginForm from './components/signUpForms/loginForm';
import RegisterForm from './components/signUpForms/registerForm';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../reducers/index';

import { Redirect } from 'react-router-dom';

import { loadUser } from '../actions/userActions';

interface LoginState {
  _mounted: boolean;
  login: boolean;
}
const initialState = {
  _mounted: false,
  login: false,
};

export interface ToggleProps {
  ClickHandler: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const mapStateToProps = (state: RootState) => ({
  isAuthenticated: state.user.isAuthenticated,
  isVerified: state.user.isVerified,
  userLoading: state.user.userLoading,
});

const mapDispatchToProps = {
  loadUser,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux;

class Login extends React.Component<Props, LoginState> {
  constructor(props: PropsFromRedux) {
    super(props);

    this.state = initialState;
  }
  componentDidMount() {
    this.setState({ _mounted: true, login: false });

    this.props.loadUser();
  }

  componentWillUnmount() {
    this.setState(initialState);
  }

  toggleClickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    if (this.state._mounted) {
      e.preventDefault();
      this.setState((prevState: LoginState) => {
        if (prevState.login === false) {
          return { login: true };
        }
        if (prevState.login === true) {
          return { login: false };
        }
        return { login: true };
      });
    }
  };

  render() {
    const { isAuthenticated, isVerified, userLoading } = this.props;
    if (isAuthenticated) {
      if (isVerified) {
        return <Redirect to='/account' />;
      } else {
        return <Redirect to='/verification' />;
      }
    } else {
      return (
        <div
          className='min-h-screen flex content-center grid grid-cols-1 '
          style={{
            backgroundImage: 'linear-gradient(90deg, #efd5ff 0%, #515ada 100%)',
          }}>
          <div>
            {this.state.login ? (
              <LoginForm ClickHandler={this.toggleClickHandler} />
            ) : (
              <RegisterForm ClickHandler={this.toggleClickHandler} />
            )}
          </div>
        </div>
      );
    }
  }
}

export default connector(Login) as React.FC;
