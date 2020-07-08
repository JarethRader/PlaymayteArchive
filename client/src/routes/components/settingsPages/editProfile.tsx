import React from 'react';
import {
  genderOptions,
  getGender,
  genderTypes,
} from '../../../utils/genderUtils';
import {
  orientationsOptions,
  getOrientation,
} from '../../../utils/orientationUtils';
import {
  pronounOptions,
  getPreferredPronouns,
} from '../../../utils/pronounUtils';
import { RootState } from '../../../reducers/index';
import { connect, ConnectedProps } from 'react-redux';
import { UpdateObj } from '../../../actions/types';
import { updateUserInfo } from '../../../actions/userActions';

const mapState = (state: RootState) => ({
  isAuthenticated: state.user.isAuthenticated,
  userInfo: state.user.userInfo,
});

const mapDispatch = {
  updateUserInfo,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux;

const EditProfile: React.FC<Props> = (props: Props) => {
  const { userInfo } = props;

  const [gender, setGender] = React.useState(
    genderOptions[
      genderOptions.indexOf(
        Object.keys(genderTypes).filter(
          (currentGender) => getGender(currentGender) === userInfo.gender
        )[0]
      )
    ]
  );
  const handleSetGender = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setGender(event.target.value);
  };

  const [orientation, setOrientation] = React.useState(
    orientationsOptions[
      [...Array(orientationsOptions.length).keys()].filter((index) =>
        getOrientation(orientationsOptions[index]) === userInfo.orientation
          ? index
          : 0
      )[0]
    ]
  );
  const handleSetOrientation = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setOrientation(event.target.value);
  };

  const [pronouns, setPronouns] = React.useState(
    pronounOptions[
      [...Array(pronounOptions.length).keys()].filter((index) =>
        getPreferredPronouns(pronounOptions[index]) ===
        userInfo.preferredPronoun
          ? index
          : 0
      )[0]
    ]
  );

  const handleSetPronoun = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPronouns(event.target.value);
  };

  const [firstName, setFirstName] = React.useState(userInfo.firstName);
  const handleChangeFirstname = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    setFirstName(event.target.value);
  };

  const [lastName, setLastName] = React.useState(userInfo.lastName);
  const handleChangeLastname = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setLastName(event.target.value);
  };

  const [email, setEmail] = React.useState(userInfo.email);
  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setEmail(event.target.value);
  };

  const [gamerTag, setGamerTag] = React.useState(userInfo.gamerTag);
  const handleChangeGamerTag = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setGamerTag(event.target.value);
  };

  const handleUpdateInfo = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const body: UpdateObj = {};
    /* tslint:disable:no-string-literal */
    if (firstName !== userInfo.firstName) body['firstName'] = firstName;
    if (lastName !== userInfo.lastName) body['lastName'] = lastName;
    if (email !== userInfo.email) body['email'] = email;
    if (gamerTag !== userInfo.gamerTag) body['gamerTag'] = gamerTag;
    if (gender.toUpperCase() !== userInfo.gender)
      body['gender'] = getGender(gender);
    if (orientation.toUpperCase() !== userInfo.orientation)
      body['orientation'] = getOrientation(orientation);
    if (
      getPreferredPronouns(pronouns).toUpperCase() !== userInfo.preferredPronoun
    )
      body['preferredPronoun'] = getPreferredPronouns(pronouns);
    /* tslint:enable:no-string-literal */

    if (Object.keys(body).length > 0) {
      props.updateUserInfo(body);
      setMsg('Settings updated successfully!');
    }
  };

  const [msg, setMsg] = React.useState<undefined | string>(undefined);

  return (
    <div className='container-fluid'>
      <div className='mt-4 text-green-600 bg-green-200 w-3/4 mx-auto rounded-sm text-center'>
        {msg ? msg : null}
      </div>
      <ul>
        <form>
          <div className='grid grid-rows-8 row-gap-6'>
            <div>
              <div className='grid grid-cols-4 col-gap-6'>
                <div className='col-span-1 text-right text-md assistant-font text-black self-center bg-transparent'>
                  First Name
                </div>
                <div className='col-span-3'>
                  <input
                    type='text'
                    value={firstName}
                    onChange={(e) => handleChangeFirstname(e)}
                    id='first'
                    className='shadow-lg appearance-none rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  />
                </div>
              </div>
            </div>
            <div>
              <div className='grid grid-cols-4 col-gap-6'>
                <div className='col-span-1 text-right text-md assistant-font text-black self-center bg-transparent'>
                  Last Name
                </div>
                <div className='col-span-3'>
                  <input
                    type='text'
                    value={lastName}
                    onChange={(e) => handleChangeLastname(e)}
                    id='last'
                    className='shadow-lg appearance-none rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  />
                </div>
              </div>
            </div>
            <div>
              <div className='grid grid-cols-4 col-gap-6'>
                <div className='col-span-1 text-right text-md assistant-font text-black'>
                  Email
                </div>
                <div className='col-span-3'>
                  <input
                    type='text'
                    value={email}
                    onChange={(e) => handleChangeEmail(e)}
                    id='email'
                    className='shadow-lg appearance-none rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  />
                </div>
              </div>
            </div>
            <div>
              <div className='grid grid-cols-4 col-gap-6'>
                <div className='col-span-1 text-right text-md assistant-font text-black'>
                  Gamertag
                </div>
                <div className='col-span-3'>
                  <input
                    type='text'
                    value={gamerTag}
                    onChange={(e) => handleChangeGamerTag(e)}
                    id='gamerTag'
                    className='shadow-lg appearance-none rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  />
                </div>
              </div>
            </div>
            <div>
              <div className='grid grid-cols-4 col-gap-6'>
                <div className='col-span-1 text-right text-md assistant-font text-black'>
                  Gender
                </div>
                <div className='col-span-2'>
                  <select
                    value={gender}
                    onChange={handleSetGender}
                    className='self-center shadow-lg block appearance-none w-full border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-gray-500'>
                    {genderOptions.map((key) => (
                      <option key={key} value={key}>
                        {key}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div>
              <div className='grid grid-cols-4 col-gap-6'>
                <div className='col-span-1 text-right text-md assistant-font text-black'>
                  Sexual Orientation
                </div>
                <div className='col-span-2'>
                  <select
                    value={orientation}
                    onChange={handleSetOrientation}
                    className='shadow-lg block appearance-none w-full border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-gray-500'>
                    {orientationsOptions.map((key) => (
                      <option key={key} value={key}>
                        {key}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div>
              <div className='grid grid-cols-4 col-gap-6'>
                <div className='col-span-1 text-right text-md assistant-font text-black'>
                  Preferred Pronouns
                </div>
                <div className='col-span-2'>
                  <select
                    value={pronouns}
                    onChange={handleSetPronoun}
                    className='shadow-lg block appearance-none w-full border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-gray-500'>
                    {pronounOptions.map((key) => (
                      <option key={key} value={key}>
                        {key}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <div className='grid grid-cols-4 col-gap-6'>
                <div className='col-start-2'>
                  <div>
                    <button
                      onClick={(e) => handleUpdateInfo(e)}
                      className='text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline login-btn'>
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </ul>
    </div>
  );
};

export default connector(EditProfile);
