import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../reducers/index';
import { Redirect } from 'react-router-dom';

import ReactGA from '../actions/utils/initilizeGA';

import {
  connectSocket,
  getChatLog,
  updateChatLog,
  deleteRoom,
  clearChatLogs,
} from '../actions/chatActions';
import { getRooms, removeFriend } from '../actions/socialActions';
import { IMessage } from '../actions/types';

interface IFriendInfo {
  firstName: string;
  lastName: string;
  friendID: string;
  roomID: string;
}

const mapState = (state: RootState) => ({
  isAuthenticated: state.user.isAuthenticated,
  isVerified: state.user.isVerified,
  socket: state.chat.socket,
  friendList: state.social.friendList,
  info: state.user.userInfo,
  chatLog: state.chat.chatLog,
});

const mapDispatch = {
  connectSocket,
  getRooms,
  getChatLog,
  updateChatLog,
  removeFriend,
  deleteRoom,
  clearChatLogs,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux;

const Messaging: React.FC<Props> = (props: Props) => {
  React.useEffect(() => {
    if (props.friendList.length === 0) {
      props.getRooms();
    }
    if (!props.socket) {
      props.connectSocket();
    }
  });

  React.useEffect(() => {
    if (props.friendList.length === 0) {
      props.getRooms();
    }
    if (!props.socket) {
      props.connectSocket();
    }
  }, [props.friendList]);

  React.useEffect(() => {
    if (props.socket) {
      props.socket.on('message', (msg: IMessage) => {
        props.getChatLog(room);
      });
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest',
        });
      }
    }
  }, [props.chatLog]);

  const [message, setMessage] = React.useState('');

  const sendMessage = () => {
    ReactGA.event({
      category: 'Send Message',
      action: 'User has sent a message',
    });
    props.socket.emit('chatMessage', message, room, props.info.firstName);
    setMessage('');
  };

  const [room, setRoom] = React.useState(
    props.friendList[0] ? props.friendList[0].roomID : ''
  );

  const [friendSelected, setFriend] = React.useState('');

  const handleSetRoom = (
    event: React.MouseEvent<HTMLDivElement>,
    _room: IFriendInfo
  ) => {
    event.preventDefault();
    setRoom(_room.roomID);
    setFriend(_room.friendID);
    props.socket.emit('joinRoom', {
      sender: _room.firstName,
      roomID: _room.roomID,
    });
    props.getChatLog(_room.roomID);
  };

  const bottomRef: React.RefObject<HTMLDivElement> = React.useRef(null);

  const [isOpen, setOpen] = React.useState(false);

  const handleClearChat = (event: React.MouseEvent<HTMLParagraphElement>) => {
    event.preventDefault();
    props.deleteRoom(room);
    setRoom('');
    setFriend('');
    props.clearChatLogs();
  };

  const handleRemoveFriend = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    props.removeFriend(room, friendSelected);
    setRoom('');
    setFriend('');
    props.clearChatLogs();
  };

  // TODO Add a mobile version of the chat so its not formated all weird
  if (!props.isVerified) {
    return <Redirect to='/verification' />;
  } else if (props.isAuthenticated) {
    return (
      <div>
        {isOpen ? (
          <div className='modal-animation'>
            <div className='flex items-center justify-center min-h-screen w-full absolute z-20 opacity-75 bg-gray-700'></div>
            <div
              className='flex items-center justify-center min-h-screen w-full absolute z-30'
              onClick={(e) => {
                setOpen(false);
              }}>
              <div className='bg-white py-2 rounded lg:w-1/4 sm:w-1/2 xs:w-10/12 cursor-pointer'>
                <div
                  className='text-center my-4 py-2 hover:bg-gray-300'
                  onClick={(e) => handleClearChat(e)}>
                  <p className='assistant-font'>Clear chat</p>
                  <p className='text-xs font-hairline'>
                    This will delete the chat for both of you
                  </p>
                </div>
                <div
                  onClick={(e) => handleRemoveFriend(e)}
                  className='text-center assistant-font my-4 py-2 hover:bg-gray-300'>
                  Unmatch
                </div>
              </div>
            </div>
          </div>
        ) : null}
        <div
          className='flex items-center justify-center min-h-screen max-h-screen z-10'
          style={{
            backgroundImage:
              'linear-gradient(90deg, rgba(63,43,150,1) 0%, rgba(168,192,255,1) 50%, rgba(63,43,150,1) 100%)',
          }}>
          <div className='flex-1 text-center px-4 py-4 m-2 bg-gray-100 min-h-4/5 sm:max-w-full md:max-w-7/8 rounded my-auto'>
            <div className='flex flex-col'>
              <div className='grid grid-cols-4'>
                <div className='col-span-1'>
                  <div className='overflow-y-auto chatWindow border border-gray-500 rounded bg-white cursor-pointer'>
                    {props.friendList.map((user: IFriendInfo) =>
                      user.friendID === friendSelected ? (
                        <div key={user.friendID}>
                          <div
                            className='px-2 py-8 bg-gray-300 hover:bg-gray-300'
                            onClick={(e) => handleSetRoom(e, user)}>
                            <div className='grid grid-cols-3'>
                              <div className='col-start-2'>
                                {user.firstName} {user.lastName}
                              </div>
                              <div className='flex justify-end px-2'>
                                <svg
                                  className='fill-current text-gray-500 hover:text-gray-700'
                                  width='10'
                                  height='30'
                                  onClick={(e) => {
                                    setOpen(true);
                                  }}>
                                  <circle cx='5' cy='5' r='4' />
                                  <circle cx='5' cy='15' r='4' />
                                  <circle cx='5' cy='25' r='4' />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          key={user.friendID}
                          className='px-2 py-8 bg-gray-100 hover:bg-gray-300'
                          onClick={(e) => handleSetRoom(e, user)}>
                          {user.firstName} {user.lastName}
                        </div>
                      )
                    )}
                  </div>
                </div>
                <div className='col-span-3'>
                  <div className='ml-2 chatWindow'>
                    <div className='overflow-y-auto min-h-9/10 max-h-9/10 border border-black rounded-md bg-white'>
                      {props.chatLog[0]
                        ? props.chatLog.map(
                            (_message: IMessage, index: number) =>
                              _message.sender === props.info.firstName ? (
                                <div
                                  className='flex justify-end m-4'
                                  key={index}>
                                  <div className='flex-col'>
                                    <div
                                      className='p-2 rounded assistant-font '
                                      style={{
                                        backgroundImage:
                                          'linear-gradient(to right, #77A1D3 0%, #79CBCA 100%)',
                                      }}>
                                      {_message.message}
                                    </div>
                                    <div className='text-xs font-hairline flex justify-end'>
                                      {_message.timestamp}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div
                                  className='flex justify-start m-4'
                                  key={index}>
                                  <div className='flex-col'>
                                    <div
                                      className='p-2 rounded assistant-font'
                                      style={{
                                        backgroundImage:
                                          'linear-gradient(to right, #1CD8D2 0%, #93EDC7 100%)',
                                      }}>
                                      {_message.message}
                                    </div>
                                    <div className='text-xs font-hairline flex justidy-start'>
                                      {_message.timestamp}
                                    </div>
                                  </div>
                                </div>
                              )
                          )
                        : null}
                      <div ref={bottomRef}></div>
                    </div>
                    <div className='my-5 border border-gray-500 rounded bg-white'>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          sendMessage();
                        }}>
                        <input
                          className='bg-white w-11/12 h-full py-3 outline-none'
                          type='type'
                          placeholder='Write a message...'
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                        />
                        <a
                          onClick={sendMessage}
                          className='font-semibold text-blue-500 hover:text-blue-700 cursor-pointer float-center inset-y-0 right-0'>
                          Send
                        </a>
                      </form>
                    </div>
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

export default connector(Messaging);
