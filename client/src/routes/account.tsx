import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../reducers/index';
import {
  getGamePreferences,
  updateGamePreferences,
} from '../actions/gameActions';
import {
  getAnimePreferences,
  updateAnimePreferences,
} from '../actions/animeActions';
import {
  loadUser,
  getAboutMe,
  updateAboutMe,
  checkVerification,
} from '../actions/userActions';

import { API } from '../actions/utils/config';
import useDebouncedSearch from '../utils/debounce';

import { Redirect } from 'react-router-dom';

import { Camera } from '@styled-icons/boxicons-solid';
import { Close } from '@styled-icons/evaicons-solid';

const CloudFrontUrl = 'https://d296x3mmma60gj.cloudfront.net';

interface GameResult {
  title: string;
  platform: string;
}

const searchGamesAsync = async (
  text: string,
  abortSignal?: AbortSignal
): Promise<GameResult[]> => {
  const result = await fetch(
    `${API}/games/search?game=${encodeURIComponent(text)}`,
    {
      signal: abortSignal,
    }
  );
  if (result.status !== 200) {
    throw new Error('bad status = ' + result.status);
  }
  const json = await result.json();
  return json.result;
};

const useSearchGame = () =>
  useDebouncedSearch((text) => searchGamesAsync(text));

const searchAnimesAsync = async (
  text: string,
  abortSignal?: AbortSignal
): Promise<GameResult[]> => {
  const result = await fetch(
    `${API}/animes/search?anime=${encodeURIComponent(text)}`,
    {
      signal: abortSignal,
    }
  );
  if (result.status !== 200) {
    throw new Error('bad status = ' + result.status);
  }
  const json = await result.json();
  return json.result;
};

const useSearchAnime = () =>
  useDebouncedSearch((text) => searchAnimesAsync(text));

const mapState = (state: RootState) => ({
  isAuthenticated: state.user.isAuthenticated,
  userInfo: state.user.userInfo,
  games: state.games.gamePreferences,
  animes: state.animes.animePreferences,
  aboutMe: state.user.aboutMe,
});

const mapDispatch = {
  updateGamePreferences,
  getGamePreferences,
  updateAnimePreferences,
  getAnimePreferences,
  updateAboutMe,
  getAboutMe,
  loadUser,
  checkVerification,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux;

const Account: React.FC<Props> = (props: Props) => {
  React.useEffect(() => {
    async function loadUserPreferences() {
      if (!props.games.gamePreferences) {
        await props.getGamePreferences();
      }
      if (!props.animes.animePrefereces) {
        await props.getAnimePreferences();
      }
      if (!props.userInfo) {
        await props.loadUser();
      }
      if (!props.aboutMe) {
        await props.getAboutMe();
      }
    }
    loadUserPreferences();
    checkVerification();
  }, []);

  const profPicReq = JSON.stringify({
    bucket: 'playmayte-images',
    key: `images/${props.userInfo.id}/profile.png`,
    edits: {
      resize: {
        width: 200,
        height: 200,
        fit: 'inside',
      },
    },
  });

  const [profilePic, setProfilePic] = React.useState(
    `${CloudFrontUrl}/${btoa(profPicReq)}?${Date.now()}`
  );

  const [editID, setEdit] = React.useState('');

  const [about, setAbout] = React.useState('');
  const handleSetAbout = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setAbout(event.target.value);
  };

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const target = event.target as HTMLInputElement;
    const files = target.files;

    if (files && files.length > 0) {
      const data = new FormData();
      data.append('file', files[0]);
      data.append('user', props.userInfo.id);

      await fetch(API + '/images/setProfile', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'CSRF-Token': localStorage.getItem('csrfToken')!,
        },
        body: data,
      })
        .then(() => {
          setProfilePic(`${CloudFrontUrl}/${btoa(profPicReq)}?${Date.now()}`);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  if (props.isAuthenticated) {
    return (
      <div
        className='min-h-screen flex content-center grid grid-cols-1'
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(63,43,150,1) 0%, rgba(168,192,255,1) 50%, rgba(63,43,150,1) 100%)',
        }}>
        <div className='container object-center bg-white w-full lg:w-10/12 rounded shadow-lg'>
          <div className='grid grid-rows-4' style={{ minHeight: '90vh' }}>
            <div
              className='row-span-1 border-b-2 border-gray-400 flex items-stretch rounded-t'
              style={{
                backgroundImage:
                  'linear-gradient(90deg, rgba(15,12,41,1) 0%, rgba(48,43,99,1) 50%, rgba(36,36,62,1) 100%)',
              }}>
              <div className='flex my-6 pl-12'>
                <img
                  src={profilePic}
                  key={Date.now()}
                  alt='Profile'
                  className=' self-center w-32 rounded border-black border-2'
                />
              </div>
              <div className='flex items-center'>
                <React.Fragment>
                  <div className='text-white hover:text-gray-500 assistant-font mr-6 ml-3 self-end my-8 cursor-pointer'>
                    <button className='upload-btn-wrapper'>
                      <Camera size='24' />
                      <input
                        className='custom-file-input profilePicture'
                        type='file'
                        accept='image/png, image/jpeg'
                        onChange={uploadImage}
                      />
                    </button>
                  </div>
                </React.Fragment>
                <div className='my-12 text-white text-4xl font-black assistant-font'>
                  Hello, {props.userInfo.firstName}
                </div>
              </div>
            </div>

            <div className='row-span-3 border-gray-500 bg-gray-100'>
              <div className='overflow-y-auto accountWindow w-full my-4 px-4'>
                <div
                  id='profile'
                  className='h-32 mt-4 text-center rounded shadow-lg h-auto pb-2 bg-gray-200'>
                  <div
                    className='flex items-center justify-center rounded-t h-12'
                    style={{
                      backgroundImage:
                        'radial-gradient( circle farthest-corner at 50.3% 44.5%,  rgba(116,147,179,1) 0%, rgba(62,83,104,1) 100.2% )',
                    }}>
                    <div className='w-full'>
                      <div className='self-center flex-1 my-auto text-white assistant-font font-normal text-2xl stroke'>
                        Profile
                      </div>
                    </div>
                  </div>
                  <div className='my-4 grid grid-row-4 gap-6 assistant-font'>
                    <div className='flex items-stretch mx-4 grid grid-cols-4 gap-4'>
                      <div className='col-span-1 text-right'>
                        <div className='flex-1 pr-4 border-r-2 border-black h-full'>
                          About Me
                        </div>
                      </div>
                      <div className='col-span-3 text-left'>
                        {editID === 'profile' ? (
                          <div className='pl-4'>
                            <input
                              type='text'
                              value={about}
                              onChange={handleSetAbout}
                              className='shadow-lg appearance-none rounded-lg w-4/5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            />
                            <div className='flex justify-end'>
                              <div
                                onClick={async (e) => {
                                  e.preventDefault();
                                  await props.updateAboutMe(about);
                                  await props.getAboutMe();
                                  setEdit('');
                                }}
                                className='px-8 text-black hover:text-gray-600 cursor-pointer assistant-font text-base'>
                                Save
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className='pl-4'>{props.aboutMe}</div>
                            <div className='flex justify-end'>
                              <div
                                onClick={(e) => {
                                  e.preventDefault();
                                  setAbout(props.aboutMe);
                                  setEdit('profile');
                                }}
                                className='px-8 text-black hover:text-gray-600 cursor-pointer assistant-font text-base'>
                                Edit
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  id='games'
                  className='h-32 mt-4 text-center rounded shadow-lg h-auto pb-2 bg-gray-200'>
                  <div
                    className='flex items-center justify-center rounded-t h-12'
                    style={{
                      backgroundImage:
                        'radial-gradient( circle farthest-corner at 50.3% 44.5%,  rgba(116,147,179,1) 0%, rgba(62,83,104,1) 100.2% )',
                    }}>
                    <div className='grid grid-cols-3 w-full'>
                      <div className='col-start-2 cols-span-1'>
                        <div className='self-center flex-1 my-auto text-white assistant-font font-normal text-2xl stroke'>
                          Games
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='mt-8 grid grid-row-4 gap-6 assistant-font'>
                    <PreferencesComponent
                      /* tslint:disable */
                      desc={"I'm currently playing"}
                      /* tslint:enable */
                      list={props.games.currentlyPlaying}
                      updateFunction={props.updateGamePreferences}
                      objectKey='currentlyPlaying'
                      searchFunc={useSearchGame}
                    />

                    <PreferencesComponent
                      desc={'Some of my favorite games are'}
                      list={props.games.favoriteGames}
                      updateFunction={props.updateGamePreferences}
                      objectKey='favoriteGames'
                      searchFunc={useSearchGame}
                    />

                    <PreferencesComponent
                      desc={'Some of my least favorite games are'}
                      list={props.games.beteNoireGames}
                      updateFunction={props.updateGamePreferences}
                      objectKey='beteNoireGames'
                      searchFunc={useSearchGame}
                    />
                  </div>
                </div>

                <div
                  id='animes'
                  className='h-32 my-4 text-center rounded shadow-lg h-auto mb-2 bg-gray-200'>
                  <div
                    className='flex items-center justify-center rounded-t h-12'
                    style={{
                      backgroundImage:
                        'radial-gradient( circle farthest-corner at 50.3% 44.5%,  rgba(116,147,179,1) 0%, rgba(62,83,104,1) 100.2% )',
                    }}>
                    <div className='grid grid-cols-3 w-full'>
                      <div className='col-start-2 cols-span-1'>
                        <div className='self-center flex-1 my-auto text-white assistant-font font-normal text-2xl stroke'>
                          Animes
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='mt-8 grid grid-row-5 gap-6 assistant-font'>
                    <PreferencesComponent
                      /* tslint:disable */
                      desc={"I'm currently watching"}
                      /* tslint:enable */
                      list={props.animes.currentlyWatching}
                      updateFunction={props.updateAnimePreferences}
                      objectKey='currentlyWatching'
                      searchFunc={useSearchAnime}
                      loadPropsFunc={props.getAnimePreferences}
                    />

                    <PreferencesComponent
                      /* tslint:disable */
                      desc={"Some animes I've finished watching are"}
                      /* tslint:enable */
                      list={props.animes.finishedAnimes}
                      updateFunction={props.updateAnimePreferences}
                      objectKey='finishedAnimes'
                      searchFunc={useSearchAnime}
                      loadPropsFunc={props.getAnimePreferences}
                    />

                    <PreferencesComponent
                      desc={'Some of my favorite animes'}
                      list={props.animes.favoriteAnimes}
                      updateFunction={props.updateAnimePreferences}
                      objectKey='favoriteAnimes'
                      searchFunc={useSearchAnime}
                      loadPropsFunc={props.getAnimePreferences}
                    />

                    <PreferencesComponent
                      desc={'Some of my least favorite animes are'}
                      list={props.animes.beteNoireAnimes}
                      updateFunction={props.updateAnimePreferences}
                      objectKey='beteNoireAnimes'
                      searchFunc={useSearchAnime}
                      loadPropsFunc={props.getAnimePreferences}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <Redirect to='/login' />;
  }
};

interface PreferencesProps {
  list: string[];
  desc: string;
  updateFunction: any;
  objectKey: string;
  searchFunc: any;
  loadPropsFunc?: any;
}

const PreferencesComponent: React.FC<PreferencesProps> = (
  props: PreferencesProps
) => {
  const [editing, setEdit] = React.useState(false);
  const { inputText, setInputText, searchResults } = props.searchFunc();
  const [addNew, setAddNew] = React.useState(['']);
  const [loading, setLoading] = React.useState(false);

  const handleAdd = (
    event: React.MouseEvent<HTMLOptionElement, MouseEvent>,
    gameArray: string[],
    setFunc: React.Dispatch<any>
  ) => {
    event.preventDefault();
    const target = event.target as HTMLOptionElement;
    const newCurrentlyPlaying = [...gameArray, target.value];
    setFunc(newCurrentlyPlaying);
    setInputText('');
  };

  const handleRemoveItem = (
    event: React.MouseEvent<HTMLDivElement>,
    removeGame: string,
    gameArray: string[],
    setFunc: React.Dispatch<any>
  ) => {
    event.preventDefault();
    const newCurrentlyPlaying = gameArray.filter(
      (game: string) => game !== removeGame
    );
    setFunc(newCurrentlyPlaying);
  };

  const handleSave = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    props.updateFunction({ [props.objectKey]: addNew });
    setEdit(!editing);
  };

  return (
    <div className='flex items-stretch mx-4 grid grid-cols-4 gap-4 my-2'>
      <div className='col-span-1 text-right'>
        <div className='flex-1 pr-4 border-r-2 border-black h-full'>
          {props.desc}
        </div>
      </div>
      <div className='col-span-3 text-left'>
        {editing === true ? (
          <div className='pl-4 mb-4 flex-row'>
            <input
              className='shadow-lg appearance-none rounded-t-lg w-4/5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              type='text'
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            {searchResults.status === 'success' ? (
              searchResults.result !== 'No result' ? (
                searchResults.result.length > 0 ? (
                  <select
                    className='w-4/5 rounded-b-lg px-3'
                    name='games'
                    id='games'
                    multiple={true}>
                    {searchResults!.result!.map(
                      (element: GameResult, index: number) => (
                        <option
                          className='hover:bg-gray-300'
                          key={index}
                          value={element.title}
                          onClick={(e) => handleAdd(e, addNew, setAddNew)}>
                          {element.title}
                        </option>
                      )
                    )}
                  </select>
                ) : null
              ) : (
                <select
                  className='w-4/5 rounded-b-lg px-3'
                  name='noResult'
                  id='noResult'>
                  <option value='noResult'>No results found</option>
                </select>
              )
            ) : (
              <div className='w-4/5 flex justify-center'>
                <div className='lds-ellipsis'>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            )}
            <ul>
              {addNew
                ? addNew.map((element: string) => (
                    <li key={element}>
                      <div className='my-1 p-2 bg-gray-300 inline-flex'>
                        <div>{element}</div>
                        <div
                          className='text-red-300 hover:text-red-500 cursor-pointer pl-2'
                          onClick={(e) =>
                            handleRemoveItem(e, element, addNew, setAddNew)
                          }>
                          <Close size='24' />
                        </div>
                      </div>
                    </li>
                  ))
                : null}
            </ul>
            <div className='flex justify-end'>
              <div
                onClick={(e) => handleSave(e)}
                className='cols-span-1 text-right my-auto flex-1 px-8 text-black hover:text-gray-600 cursor-pointer assistant-font text-base'>
                Save
              </div>
            </div>
          </div>
        ) : (
          <div className='pl-4 p-2'>
            <ul>
              {props.list
                ? props.list.map((element: string) => (
                    <li key={element}>
                      <div>{element}</div>
                    </li>
                  ))
                : null}
            </ul>
            <div className='flex justify-end'>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  setAddNew(props.list);
                  setEdit(!editing);
                }}
                className='px-8 text-black hover:text-gray-600 cursor-pointer assistant-font text-base'>
                Edit
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default connector(Account);
