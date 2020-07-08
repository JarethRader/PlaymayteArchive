import * as React from 'react';
import {
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch,
} from 'react-router-dom';

import { navigation, Pair } from '../utils/navigation';
import { Redirect } from 'react-router-dom';

import ChangePassword from './components/settingsPages/changePassword';
import EditProfile from './components/settingsPages/editProfile';
// import { ManageContent } from './components/settingsPages/manageContent';
// import { PrivacySecurity } from './components/settingsPages/privacySecurity';

import { RootState } from '../reducers/index';
import { connect, ConnectedProps } from 'react-redux';

const mapState = (state: RootState) => ({
  isAuthenticated: state.user.isAuthenticated,
  isVerified: state.user.isVerified,
  userInfo: state.user.userInfo,
});

const connector = connect(mapState, {});

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux;

const Settings: React.FC<Props> = (props: Props) => {
  const { path, url } = useRouteMatch();
  const { isAuthenticated, userInfo } = props;
  if (!props.isVerified) {
    return <Redirect to='/verification' />;
  } else if (!isAuthenticated || isAuthenticated === undefined) {
    return <Redirect to='/login' />;
  } else {
    return (
      <div
        className='min-h-screen flex content-center grid grid-cols-1'
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(63,43,150,1) 0%, rgba(168,192,255,1) 50%, rgba(63,43,150,1) 100%)',
        }}>
        <div className='container object-center md:w-3/4 lg:w-8/12 rounded shadow-lg bg-gray-100'>
          <div className='grid grid-cols-3' style={{ minHeight: '80vh' }}>
            <div className='col-span-1 border-r-2 border-gray-400'>
              <div className='grid grid-cols-1'>
                {navigation!.links[navigation.links.length - 1]!.routes!.map(
                  (link: Pair) => (
                    <Link
                      className='py-4 border-b-2 border-gray-500 hover:bg-gray-500'
                      to={`${url}${link.to}`}
                      key={link.name}>
                      <div className='bm-item'>
                        <div className='sidebar-item-content'>{link.name}</div>
                      </div>
                    </Link>
                  )
                )}
              </div>
            </div>
            <div className='col-span-2 py-4 pl-3 pr-8 mt-6'>
              <div className='grid grid-cols-4 col-gap-6'>
                <div className='col-span-1 text-right text-md assistant-font text-black self-center bg-transparent'>
                  Profile Picture
                </div>
                <div className='col-span-3'>
                  {userInfo.firstName} {userInfo.lastName}
                </div>
              </div>
              <hr className='my-4' />
              <Switch>
                <Route path={`${path}/:OptionsId`}>
                  <Options />
                </Route>
              </Switch>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

const Options = () => {
  const { OptionsId } = useParams();

  switch (OptionsId) {
    case 'editProfile':
      return <EditProfile />;
    case 'changePassword':
      return <ChangePassword />;
    // case 'manageContent':
    //   return <ManageContent />;
    // case 'privacySecurity':
    //   return <PrivacySecurity />;
    default:
      return <EditProfile />;
  }
};

export default connector(Settings);
