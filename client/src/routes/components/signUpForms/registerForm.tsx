import * as React from 'react';
import { ToggleProps } from '../../login';

import { genderOptions, getGender } from '../../../utils/genderUtils';
import {
  orientationsOptions,
  getOrientation,
} from '../../../utils/orientationUtils';
import {
  pronounOptions,
  getPreferredPronouns,
} from '../../../utils/pronounUtils';

import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../../reducers/index';
import { register } from '../../../actions/userActions';
import { clearErrors } from '../../../actions/errorActions';

const mapState = (state: RootState) => ({
  isAuthenticated: state.isAuthenticated,
  errors: state.errors.errors,
});

const mapDispatch = { register, clearErrors };

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & ToggleProps;

const RegisterForm: React.FC<Props> = (props: Props) => {
  React.useEffect(() => {
    props.clearErrors();
  }, []);
  const [gender, setGender] = React.useState(genderOptions[0]);
  const handleSetGender = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setGender(event.target.value);
  };

  const [orientation, setOrientation] = React.useState(orientationsOptions[0]);
  const handleSetOrientation = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setOrientation(event.target.value);
  };

  const [pronouns, setPronouns] = React.useState(pronounOptions[0]);
  const handleSetPronoun = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPronouns(event.target.value);
  };

  const [day, setBirthDay] = React.useState('');
  const handleSetDay = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setBirthDay(event.target.value);
  };
  const [month, setBirthMonth] = React.useState('');
  const handleSetMonth = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setBirthMonth(event.target.value);
  };
  const [year, setBirthYear] = React.useState('');
  const handleSetYear = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setBirthYear(event.target.value);
  };

  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [gamerTag, setGamerTag] = React.useState('');

  const [loading, setLoading] = React.useState(false);

  function handleRegister(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setLoading(true);
    const body = {
      firstName,
      lastName,
      email,
      password,
      gamerTag,
      gender: getGender(gender),
      preferredPronoun: getPreferredPronouns(pronouns),
      orientation: getOrientation(orientation),
      dob: month + '/' + day + '/' + year,
    };
    props.clearErrors();
    props.register(body);
  }

  return (
    <div className='container object-center lg:w-1/3 sm:w-2/3 xs:w-10/12 rounded-md text-center shadow-md p-0 bg-gray-100 open-register-animation v'>
      <div className='grid grid-rows-1'>
        <div
          className='flex items-center row-span-1 text-white justify-center h-16 rounded-t-md w-full'
          style={{
            backgroundImage:
              'radial-gradient( circle farthest-corner at 50.3% 44.5%,  rgba(116,147,179,1) 0%, rgba(62,83,104,1) 100.2% )',
          }}>
          <h1 className='assistant-font' style={{ fontSize: '24px' }}>
            Sign up
          </h1>
        </div>
        <div className='mt-4 text-red-600 bg-red-200 w-3/4 mx-auto rounded-sm'>
          {props.errors.msg
            ? props.errors.status <= 400
              ? props.errors.msg
              : null
            : null}
        </div>
        <form className='px-8 pt-6 pb-8 mb-4'>
          <div className='mb-2 grid grid-cols-2 gap-1'>
            <div>
              <label
                className='block text-black text-sm font-bold mb-2 float-left assistant-font'
                style={{ fontSize: '18px' }}>
                First name
              </label>
              <input
                type='text'
                placeholder='First Name'
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                id='first'
                className='shadow-lg appearance-none rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              />
            </div>
            <div>
              <label
                className='block text-black text-sm font-bold mb-2 float-left assistant-font'
                style={{ fontSize: '18px' }}>
                Last name
              </label>
              <input
                type='text'
                placeholder='Last Name'
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                id='last'
                className='shadow-lg appearance-none rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              />
            </div>
          </div>
          <div className='mb-2'>
            <label
              className='block text-black text-sm font-bold mb-2 float-left assistant-font'
              style={{ fontSize: '18px' }}>
              Email
            </label>
            <input
              type='email'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id='email'
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id='password'
              className='shadow-lg appearance-none rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            />
          </div>

          <div className='flex flex-wrap justify-center mx-3 md:mb-0 mt-4'>
            <h1 className='self-baseline mx-3 text-bold text-black text-lg assistant-font'>
              Birthday
            </h1>
            <div className='w-full md:w-1/4 mb-2'>
              <div className='relative'>
                <select
                  value={month}
                  onChange={handleSetMonth}
                  className='self-center shadow-lg block appearance-none w-full bg-gray-300 border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-l-lg rounded-r-none leading-tight focus:outline-none focus:bg-white focus:border-gray-500'>
                  <option>Month</option>
                  {[...Array(12).keys()].map((i) => (
                    <option key={i} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className='w-full md:w-1/4 mb-2'>
              <div className='relative'>
                <select
                  value={day}
                  onChange={handleSetDay}
                  className='shadow-lg block appearance-none w-full bg-gray-300 border border-gray-300 text-gray-700 py-3 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'>
                  <option>Day</option>
                  {[...Array(31).keys()].map((i) => (
                    <option key={i} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className='w-full md:w-1/4 mb-2'>
              <div className='relative'>
                <select
                  value={year}
                  onChange={handleSetYear}
                  className='shadow-lg block appearance-none w-full bg-gray-300 border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-r-lg rounded-l-none leading-tight focus:outline-none focus:bg-white focus:border-gray-500'>
                  <option>Year</option>
                  {[...Array(103).keys()]
                    .slice(0)
                    .reverse()
                    .map((i) => (
                      <option key={i} value={i + 1900}>
                        {i + 1900}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
          <hr className='my-2' />
          <p className='assistant-font text-gray-700 text-sm font-thin'>
            These fields are optional
          </p>
          <div className='mb-2'>
            <label
              className='block text-black text-sm font-bold mb-2 float-left assistant-font'
              style={{ fontSize: '18px' }}>
              GamerTag
            </label>
            <input
              type='GamerTag'
              placeholder='GamerTag'
              value={gamerTag}
              onChange={(e) => setGamerTag(e.target.value)}
              id='GamerTag'
              className='shadow-lg appearance-none rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            />
          </div>
          <div className='flex flex-wrap mx-3 md:mb-0'>
            <div className='w-full md:w-1/3 px-3 mb-2'>
              <div className='relative'>
                <label className='block text-black text-md font-bold mb-2 assistant-font h-10'>
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={handleSetGender}
                  className='self-center shadow-lg block appearance-none w-full bg-gray-300 border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-gray-500'>
                  {genderOptions.map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className='w-full md:w-1/3 px-3 mb-2'>
              <div className='relative'>
                <label className='block text-black text-md font-bold mb-2 assistant-font h-10'>
                  Sexual Orientation
                </label>
                <select
                  value={orientation}
                  onChange={handleSetOrientation}
                  className='shadow-lg block appearance-none w-full bg-gray-300 border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-gray-500'>
                  {orientationsOptions.map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className='w-full md:w-1/3 px-3 mb-2'>
              <div className='relative'>
                <label className='block text-black text-md font-bold mb-2 assistant-font h-10'>
                  Preferred Pronouns
                </label>
                <select
                  value={pronouns}
                  onChange={handleSetPronoun}
                  className='shadow-lg block appearance-none w-full bg-gray-300 border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-gray-500'>
                  {pronounOptions.map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className='flex items-start justify-between pt-12 grid-row-2'>
            {loading ? (
              <div className='text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline login-btn bg-blue-800 '>
                Sign Up
              </div>
            ) : (
              <button
                onClick={(e) => handleRegister(e)}
                className='text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline login-btn bg-blue-600 hover:bg-blue-800'>
                Sign up
              </button>
            )}
          </div>
        </form>
        <div className='my-auto text-gray-500'>
          Have an account?
          <div
            className='text-blue-600 hover:text-blue-800 cursor-pointer focus:none inline pl-1'
            onClick={(e) => props.ClickHandler(e)}>
            Log in
          </div>
        </div>
      </div>
    </div>
  );
};

export default connector(RegisterForm);
