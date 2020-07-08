import React from 'react';
import { Link } from 'react-router-dom';

import { RootState } from '../../../reducers/index';
import { connect, ConnectedProps } from 'react-redux';

import { UpdatePassword } from '../../../actions/userActions';
import { clearErrors, returnErrors } from '../../../actions/errorActions';
import { errorTypes } from '../../../actions/types';

const mapState = (state: RootState) => ({
  isAuthenticated: state.user.isAuthenticated,
  errors: state.errors.errors,
});

const mapDispatch = {
  UpdatePassword,
  clearErrors,
  returnErrors,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux;

const ChangePassword: React.FC<Props> = (props: Props) => {
  React.useEffect(() => {
    props.clearErrors();
  }, []);

  const [oldPassword, setOld] = React.useState('');
  const [newPassword, setNew] = React.useState('');
  const [confirmPassword, setConfirm] = React.useState('');

  const [msg, setMsg] = React.useState<undefined | string>(undefined);

  const handleChangePassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      props.returnErrors(
        errorTypes.updatePassword,
        'Passwords do not match',
        400
      );
    } else {
      props.clearErrors();
      props.UpdatePassword(oldPassword, newPassword);
      setMsg('Password updated successfully!');
    }
  };

  return (
    <div className='container-fluid'>
      <div className='mt-4 text-red-600 bg-red-200 w-3/4 mx-auto rounded-sm text-center'>
        {props.errors.msg
          ? props.errors.status <= 400
            ? props.errors.msg
            : null
          : null}
      </div>
      <div className='mt-4 text-green-600 bg-green-200 w-3/4 mx-auto rounded-sm text-center'>
        {msg ? msg : null}
      </div>
      <ul>
        <form>
          <div className='grid grid-rows-4 row-gap-6'>
            <div>
              <div className='grid grid-cols-4 col-gap-6'>
                <div className='col-span-1 text-right text-md assistant-font text-black self-center bg-transparent'>
                  Current Password
                </div>
                <div className='col-span-3'>
                  <input
                    type='password'
                    placeholder='Current Password'
                    value={oldPassword}
                    onChange={(e) => setOld(e.target.value)}
                    id='old'
                    className='shadow-lg appearance-none rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  />
                </div>
              </div>
            </div>
            <div>
              <div className='grid grid-cols-4 col-gap-6'>
                <div className='col-span-1 text-right text-md assistant-font text-black self-center bg-transparent'>
                  New Password
                </div>
                <div className='col-span-3'>
                  <input
                    type='password'
                    placeholder='New Password'
                    value={newPassword}
                    onChange={(e) => setNew(e.target.value)}
                    id='new'
                    className='shadow-lg appearance-none rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  />
                </div>
              </div>
            </div>
            <div>
              <div className='grid grid-cols-4 col-gap-6'>
                <div className='col-span-1 text-right text-md assistant-font text-black'>
                  Confirm New Password
                </div>
                <div className='col-span-3'>
                  <input
                    type='password'
                    placeholder='Confirm New Password'
                    value={confirmPassword}
                    onChange={(e) => setConfirm(e.target.value)}
                    id='confirm'
                    className='shadow-lg appearance-none rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  />
                </div>
              </div>
            </div>

            <div>
              <div className='grid grid-cols-4 col-gap-6'>
                <div className='col-start-2'>
                  <div>
                    <button
                      onClick={(e) => handleChangePassword(e)}
                      className='text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline login-btn'>
                      Change Password
                    </button>
                  </div>
                </div>
                <Link
                  to='/'
                  className='inline-block link-hover align-bottom'
                  // onClick={(e) => props.ClickHandler(e)}
                >
                  Forgot Password
                </Link>
              </div>
            </div>
          </div>
        </form>
      </ul>
    </div>
  );
};

export default connector(ChangePassword);
