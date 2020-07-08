/**
 * @Author Jareth Rader
 * @desc This is the navbar component. It gets the navigation object from its parent.
 * It renders out the page names and and routes to them accordingly
 *
 *  @ATTENTION If you want to change the Link name or the Route,
 * please change the navigation object in resources/js/assets/src/utils/navigation
 */

import * as React from 'react';
import { Link } from 'react-router-dom';
import { slide as Menu } from 'react-burger-menu';
import { Pair } from '../utils/navigation';

import { RootState } from '../reducers/index';
import { connect, ConnectedProps } from 'react-redux';
import { logout, deleteUser } from '../actions/userActions';
import { disconnectSocket } from '../actions/chatActions';

import { logoUrl } from '../App';

const mapState = (state: RootState) => ({
  isAuthenticated: state.user.isAuthenticated,
  socket: state.chat.socket,
});

const mapDispatch = {
  logout,
  disconnectSocket,
  deleteUser,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & { brand: Pair; links: Pair[] };

const Navbar = (props: Props) => {
  const { brand, links } = props;

  const NavLinks: any = () =>
    links.map((link: Pair) => (
      <li className='w-full' key={link.name}>
        <Link
          className='bm-item sidebar-item w-full text-left py-4 px-2'
          to={link.to}>
          <div className='sidebar-item-content text-left'>{link.name}</div>
        </Link>
      </li>
    ));
  const handleDelete = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    props.disconnectSocket(props.socket);
    // Add modal to confirm delete account
    props.deleteUser();
  };

  const [isDeleteOpen, setDeleteOpen] = React.useState(false);
  const [isNavOpen, setNavOpen] = React.useState(false);

  return (
    <aside>
      <div className='absolute object-left-top m-8 cursor-pointer'>
        <svg
          viewBox='0 0 100 80'
          width='40'
          height='40'
          className='fill-current hover:text-gray-700'
          onClick={(e) => {
            setNavOpen(true);
          }}>
          <rect width='100' height='20'></rect>
          <rect y='30' width='100' height='20'></rect>
          <rect y='60' width='100' height='20'></rect>
        </svg>
      </div>
      <div
        className={isNavOpen ? 'sidebar shadow' : 'sidebarClose'}
        onMouseLeave={(e) => {
          setNavOpen(false);
        }}>
        <nav className='nav'>
          <Link className='sidebar-brand-item' to={brand.to}>
            <div className='w-56 h-10 mx-auto'>
              <img src={logoUrl} alt='Logo' />
            </div>
          </Link>
          <ul>
            {props.isAuthenticated ? (
              <NavLinks />
            ) : (
              <div>
                <li className='w-full'>
                  <Link
                    className='bm-item sidebar-item w-full text-left py-4'
                    to='/login'>
                    <div className='sidebar-item-content'>Login</div>
                  </Link>
                </li>
              </div>
            )}
          </ul>
          {props.isAuthenticated ? (
            <div className='outline-none text-left'>
              <div
                className='sidebar-item py-4 font-semibold px-12'
                onClick={(e) => {
                  e.preventDefault();
                  props.disconnectSocket(props.socket);
                  props.logout();
                }}>
                Logout
              </div>
              <div
                className='sidebar-item py-4 font-semibold px-12'
                onClick={(e) => {
                  setDeleteOpen(true);
                }}>
                Delete Account
              </div>
              {isDeleteOpen ? (
                <div className='modal-animation'>
                  <div className='flex items-center justify-center min-h-screen w-full absolute z-20 opacity-75 bg-gray-700'></div>
                  <div
                    className='flex items-start justify-center mt-2 min-h-screen w-full absolute z-30'
                    onClick={(e) => {
                      setDeleteOpen(false);
                    }}>
                    <div className='bg-white py-2 rounded max-w-7/8 cursor-pointer'>
                      <div
                        className='text-center my-4 py-2 hover:bg-gray-300'
                        onClick={(e) => handleDelete(e)}>
                        <p className='assistant-font'>Yes, delete it</p>
                        <p className='text-xs font-hairline px-2'>
                          This will delete your profile and all messages
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
          <div className='flex focus:outline-none'>
            <div className='assistant-font text-sm px-4 py-2 flex-1 self-end text-center'>
              If you have any problems, questions or comments, feel free to
              contact me on Twitter @JarethRader
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default connector(Navbar);
