import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../reducers/index';
import { RouteComponentProps, Redirect } from 'react-router-dom';

import { API, CSRFConfig } from '../actions/utils/config';

import { checkVerification } from '../actions/userActions';

const mapState = (state: RootState) => ({
  isAuthenticated: state.user.isAuthenticated,
  isVerified: state.user.isVerified,
  userInfo: state.user.userInfo,
});

const mapDispatch = {
  checkVerification,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & RouteComponentProps<any>;

const Verification: React.FC<Props> = (props: Props) => {
  const correlationID = new URLSearchParams(props.location.search);

  const [isMsg, setRes] = React.useState(false);
  const [msg, setMsg] = React.useState('');

  const verify = async () => {
    try {
      await fetch(API + '/verification?' + correlationID, {
        method: 'GET',
        headers: CSRFConfig(),
      }).then((success) => {
        props.checkVerification();
      });
    } catch (err) {
      setMsg(
        'Verification failed, if the problem persists feel free to tweet at me @JarethRader'
      );
      setRes(true);
    }
  };

  const resendVerification = () => {
    try {
      fetch(API + '/verification/sendVerify', {
        method: 'POST',
        credentials: 'include',
        headers: CSRFConfig(),
        body: JSON.stringify({
          id: props.userInfo.id,
          firstName: props.userInfo.firstName,
          lastName: props.userInfo.lastName,
          email: props.userInfo.email,
        }),
      })
        .then((response) => {
          if (response.status === 200) {
            setMsg('Email sent, please check your email');
            setRes(true);
          }
        })
        .catch((err) => {
          console.log(err);
          throw err;
        });
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    verify();
  }, []);

  if (props.isVerified) {
    return <Redirect to='/account' />;
  } else if (!props.isAuthenticated) {
    return <Redirect to='/login' />;
  } else {
    return (
      <div
        className='flex items-center justify-center min-h-screen w-full'
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(63,43,150,1) 0%, rgba(168,192,255,1) 50%, rgba(63,43,150,1) 100%)',
        }}>
        <div className='grid grid-rows-1 bg-gray-300 lg:w-1/4 sm:w-1/2 xs:w-10/12 min-h-1/4 rounded shadow-lg text-center assistant-font'>
          <div
            className='flex items-center row-span-1 text-white justify-center h-16 rounded-t-md w-full'
            style={{
              backgroundImage:
                'radial-gradient( circle farthest-corner at 50.3% 44.5%, rgba(116,147,179,1) 0%, rgba(62,83,104,1) 100.2% )',
            }}>
            <h1 className='assistant-font' style={{ fontSize: '24px' }}>
              Verification
            </h1>
          </div>
          <div>
            {isMsg ? (
              <div className='my-2 py-2'>{msg}</div>
            ) : (
              <div>
                <div className='mt-2 py-2'>
                  Please check you email in order to verify your account.
                </div>
                <div className='mb-2 py-2'>
                  <p
                    className='text-blue-500 hover:text-blue-700 cursor-pointer focus:none'
                    onClick={resendVerification}>
                    Resend verification
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default connector(Verification);
