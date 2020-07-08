import * as React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ToggleProps } from '../../login';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../../reducers/index';
import { login } from '../../../actions/userActions';
import { clearErrors } from '../../../actions/errorActions';

const mapState = (state: RootState) => ({
  isAuthenticated: state.isAuthenticated,
  errors: state.errors.errors,
});

const mapDispatch = {
  login,
  clearErrors,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & ToggleProps;

const LoginForm: React.FC<Props> = (props: Props) => {
  React.useEffect(() => {
    props.clearErrors();
  }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleLogin(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    props.clearErrors();
    props.login(email, password);
  }

  return (
    <div className='container object-center lg:w-1/4 sm:w-1/2 xs:w-10/12 rounded-md text-center shadow-md p-0 bg-gray-100 open-login-animation'>
      <div className='grid grid-rows-1'>
        <div
          className='flex items-center row-span-1 text-white justify-center h-16 rounded-t-md w-full'
          style={{
            backgroundImage:
              'radial-gradient( circle farthest-corner at 50.3% 44.5%, rgba(116,147,179,1) 0%, rgba(62,83,104,1) 100.2% )',
          }}>
          <h1 className='assistant-font' style={{ fontSize: '24px' }}>
            Login
          </h1>
        </div>
        <div className='mt-4 text-red-600 bg-red-200 w-3/4 mx-auto rounded-sm'>
          {props.errors.msg
            ? props.errors.status <= 400
              ? props.errors.msg
              : null
            : null}
        </div>
        <form className='px-12 pt-6 pb-8 mb-4'>
          <div className='mb-2'>
            <label
              className='block text-black text-sm font-bold mb-2 float-left assistant-font'
              style={{ fontSize: '18px' }}>
              Email
            </label>
            <input
              type='text'
              placeholder='Email'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='shadow-lg appearance-none rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            />
          </div>
          <div className='mb-2'>
            <label
              className='block text-black text-sm font-bold mb-2 float-left assistant-font'
              style={{ fontSize: '18px' }}>
              Password
            </label>
            <input
              type='password'
              placeholder='Password'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='shadow-lg appearance-none rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            />
          </div>
          <div className='flex items-start justify-between pt-12 grid-row-2'>
            <button
              className='text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline login-btn bg-blue-600 hover:bg-blue-800'
              onClick={(e) => handleLogin(e)}>
              Sign In
            </button>
            <Link
              to='/reset'
              className='pt-4 align-baseline font-bold text-sm link-hover text-blue-600 hover:text-blue-800 cursor-pointer'>
              Forgot Password
            </Link>
          </div>
        </form>
        <div className='my-auto text-gray-500'>
          Don't have an account?
          <div
            className='text-blue-600 hover:text-blue-800 cursor-pointer focus:none inline pl-1'
            onClick={(e) => props.ClickHandler(e)}>
            Sign Up
          </div>
        </div>
      </div>
    </div>
  );
};

export default connector(LoginForm);
