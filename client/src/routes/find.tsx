import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../reducers/index';

import { genderOptions, getGender, genderTypes } from '../utils/genderUtils';
import { orientationsOptions, getOrientation } from '../utils/orientationUtils';
import { pronounOptions, getPreferredPronouns } from '../utils/pronounUtils';

import { IUserProfile } from '../actions/types';

import {
  getUsersProfile,
  match,
  pass,
  getProspects,
  ClearProspects,
} from '../actions/socialActions';

const moment = require('moment');

const CloudFrontUrl = 'https://d296x3mmma60gj.cloudfront.net';

const mapState = (state: RootState) => ({
  isAuthenticated: state.user.isAuthenticated,
  isVerified: state.user.isVerified,
  prospectList: state.social.prospectList,
  selectedUser: state.social.selectedUser,
});

const mapDispatch = {
  match,
  pass,
  getUsersProfile,
  getProspects,
  ClearProspects,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux;

export const Find: React.FC<Props> = (props: Props) => {
  React.useEffect(() => {
    if (props.prospectList.length === 0) {
      props.getProspects();
    }
  }, []);

  React.useEffect(() => {
    if (props.prospectList[index]) {
      props.getUsersProfile(props.prospectList[index].prospectID);
    }
  }, [props.prospectList]);

  const [index, setIndex] = React.useState(0);
  const handleIndex = () => {
    const incrementIndex = index + 1;
    if (incrementIndex === props.prospectList.length) {
      props.ClearProspects();
    } else {
      setIndex(incrementIndex);
      props.getUsersProfile(props.prospectList[incrementIndex].prospectID);
    }
  };
  if (!props.isVerified) {
    return <Redirect to='/verification' />;
  } else if (props.isAuthenticated) {
    return (
      <div
        className='flex items-center justify-center min-h-screen max-h-screen'
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(63,43,150,1) 0%, rgba(168,192,255,1) 50%, rgba(63,43,150,1) 100%)',
        }}>
        {props.selectedUser.info ? (
          <UserTile
            user={props.selectedUser}
            handleIndex={handleIndex}
            match={props.match}
            pass={props.pass}
          />
        ) : (
          <div className='bg-gray-300 px-4 py-4 rounded shadow assistant-font text-center'>
            You have no more matches to make
            <hr className='my-2' />
            <div>
              <Link
                to='/messaging'
                className='text-blue-500 hover:text-blue-700 underline cursor-pointer'>
                Go to messages
              </Link>
              <br />
              <Link
                to='/account'
                className='text-blue-500 hover:text-blue-700 underline cursor-pointer'>
                Go to your account
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  } else {
    return <Redirect to='/login' />;
  }
};

interface UserTileState {
  user: IUserProfile;
  handleIndex: () => void;
  match: (matchID: string) => void;
  pass: (matchID: string) => void;
}

const UserTile: React.FC<UserTileState> = (props: UserTileState) => {
  const getAge = (): number => {
    return moment().diff(props.user.info.dob.replace('/', '-'), 'years', false);
  };

  const handleMatch = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    props.match(props!.user!.info!.id!);
    props.handleIndex();
  };

  const handlePass = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    props.pass(props!.user!.info!.id!);
    props.handleIndex();
  };

  const profPicReq = JSON.stringify({
    bucket: 'playmayte-images',
    key: `images/${props.user.info.id}/profile.png`,
  });

  const profilePic = `${CloudFrontUrl}/${btoa(profPicReq)}`;

  return (
    <div className='m-2 bg-gray-100 rounded w-full lg:w-10/12 shadow'>
      <div className='flex flex-col'>
        <div
          className='rounded-t'
          style={{
            backgroundImage:
              'linear-gradient(90deg, rgba(15,12,41,1) 0%, rgba(48,43,99,1) 50%, rgba(36,36,62,1) 100%)',
          }}>
          <div className='flex items-stretch h-16 justify-center'>
            <div className='self-center'>
              <div className='text-center text-white assistant-font text-2xl self-center'>
                {props.user.info.firstName} {props.user.info.lastName}
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-wrap mx-2 my-4'>
          <div className='flex justify-center self-center mx-auto'>
            <img
              src={profilePic}
              alt='Profile'
              className='w-64 h-64 p-4 rounded'
              style={{
                backgroundImage:
                  'linear-gradient(90deg, rgba(15,12,41,1) 0%, rgba(48,43,99,1) 50%, rgba(36,36,62,1) 100%)',
              }}
            />
          </div>
          <div className='my-8 mx-auto'>
            <div className='text-left assistant-font font-semibold text-xl underline'>
              Info
            </div>
            <UserInfoRow
              desc={'Gamer handle'}
              value={props.user.info.gamerTag || ''}
            />
            <UserInfoRow desc={'About'} value={props.user.aboutMe} />
            <UserInfoRow desc={'Age'} value={getAge().toString()} />
            <UserInfoRow
              desc={'Gender'}
              value={
                genderOptions[
                  genderOptions.indexOf(
                    Object.keys(genderTypes).filter(
                      (currentGender) =>
                        getGender(currentGender) === props.user.info.gender
                    )[0]
                  )
                ] || 'Prefer not to say'
              }
            />
            <UserInfoRow
              desc={'Preferred Pronouns'}
              value={
                pronounOptions[
                  [...Array(pronounOptions.length).keys()].filter((index) =>
                    getPreferredPronouns(pronounOptions[index]) ===
                    props.user.info.preferredPronoun
                      ? index
                      : 0
                  )[0]
                ] || 'Prefer not to say'
              }
            />
            <UserInfoRow
              desc={'Sexual Orientation'}
              value={
                orientationsOptions[
                  [
                    ...Array(orientationsOptions.length).keys(),
                  ].filter((index) =>
                    getOrientation(orientationsOptions[index]) ===
                    props.user.info.orientation
                      ? index
                      : 0
                  )[0]
                ] || 'Prefer not to say'
              }
            />
          </div>
        </div>
        <hr className='my-2 mx-4' />
        <div className='flex flex-wrap mx-2 my-4 lg:grid lg:grid-cols-2 lg:cols-gap-4'>
          <div>
            <div className='text-center assistant-font font-semibold text-xl underline'>
              Games
            </div>
            <PreferencesInfoRow
              /* tslint:disable */
              desc={"They're currently playing"}
              /* tslint:enable */
              list={props.user.games.currentlyPlaying}
            />
            <PreferencesInfoRow
              desc={'Some of their favorite games are'}
              list={props.user.games.favoriteGames}
            />
            <PreferencesInfoRow
              desc={'Some of their least favorite games are'}
              list={props.user.games.beteNoireGames}
            />
          </div>
          <div>
            <div className='text-center assistant-font font-semibold text-xl underline'>
              Animes
            </div>
            <PreferencesInfoRow
              /* tslint:disable */
              desc={"Some animes they're currently watching are"}
              /* tslint:enable */
              list={props.user.animes.currentlyWatching}
            />
            <PreferencesInfoRow
              desc={'Some of their favorite animes are'}
              list={props.user.animes.favoriteAnimes}
            />
            <PreferencesInfoRow
              /* tslint:disable */
              desc={"Some animes they're finished watching are"}
              /* tslint:enable */
              list={props.user.animes.finishedAnimes}
            />
            <PreferencesInfoRow
              desc={'Some of their least favorite animes are'}
              list={props.user.animes.beteNoireAnimes}
            />
          </div>
        </div>
        <div className='grid grid-cols-2 text-center'>
          <div className='pb-2 mx-2'>
            <button
              className='text-white text-2xl font-bold py-2 px-4 focus:outline-none focus:shadow-outline login-btn w-full bg-red-600 hover:bg-red-800'
              onClick={(e) => handlePass(e)}>
              Pass
            </button>
          </div>
          <div className='pb-2 mx-2'>
            <button
              className='text-white text-2xl font-bold py-2 px-4 focus:outline-none focus:shadow-outline login-btn w-full bg-green-600 hover:bg-green-800'
              onClick={(e) => handleMatch(e)}>
              Match
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface UserInfoRowState {
  desc: string;
  value: string;
}

const UserInfoRow: React.FC<UserInfoRowState> = (props: UserInfoRowState) => {
  return (
    <div className='grid grid-cols-4 col-gap-2 my-4'>
      <div className='col-span-1 text-right text-md assistant-font text-black px-2 border-r-2 border-black'>
        {props.desc}
      </div>
      <div className='col-span-3'>{props.value}</div>
    </div>
  );
};

interface PreferencesInfoRowState {
  desc: string;
  list: any;
}

const PreferencesInfoRow: React.FC<PreferencesInfoRowState> = (
  props: PreferencesInfoRowState
) => {
  return (
    <div className='my-8 mx-4'>
      <div className='grid grid-cols-2 col-gap-2 my-4'>
        <div className='col-span-1 text-right text-md assistant-font text-black pr-4 border-r-2 border-black h-full'>
          {props.desc}
        </div>
        <div className='col-span-1'>
          <div className='p-2'>
            <ul>
              {props.list
                ? props.list.map((element: string) => (
                    <li className='my-2' key={element}>
                      {element}
                    </li>
                  ))
                : null}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connector(Find);
