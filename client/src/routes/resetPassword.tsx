import React from 'react';
import { API, CSRFConfig } from '../actions/utils/config';

const ResetPassword: React.FC<{}> = () => {
  const [isMsg, setRes] = React.useState(false);
  const [msg, setMsg] = React.useState('');

  const [isErr, setErrRes] = React.useState(false);
  const [err, setErr] = React.useState('');

  const [email, setEmail] = React.useState('');

  const sendEmail = async () => {
    if (email === '') {
      setErr('Invalid Email');
      setErrRes(true);
      return;
    }
    try {
      await fetch(API + '/user/resetEmail', {
        method: 'POST',
        credentials: 'include',
        headers: CSRFConfig(),
        body: JSON.stringify({ email }),
      })
        .then(async (response) => {
          if (response.status >= 200 && response.status < 300) {
            setMsg('Email sent, please check your email');
            setErrRes(false);
            setRes(true);
          } else {
            throw await response.json();
          }
        })
        .catch((resErr) => {
          throw new Error(resErr.msg);
        });
    } catch (err) {
      setErr(err.message);
      setRes(false);
      setErrRes(true);
    }
  };

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
            Reset Password
          </h1>
        </div>
        <div className='mx-12'>
          {isMsg ? (
            <div className='my-2 py-2'>
              <div className='bg-green-200 text-green-600 rounded py-1'>
                {msg}
              </div>
            </div>
          ) : null}
          {isErr ? (
            <div className='my-2 py-2'>
              <div className='bg-red-200 text-red-600 rounded py-1'>{err}</div>
            </div>
          ) : null}
          <div>
            <div className='mt-2 py-2'>
              <div className='mb-2'>
                <label className='block text-black font-bold mb-2 float-left assistant-font text-base'>
                  Enter your email:
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
            </div>
            <div className='mb-2 py-2'>
              <button
                className='text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline login-btn'
                onClick={sendEmail}>
                Reset email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
