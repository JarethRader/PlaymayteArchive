import moment from 'moment';
import Chat, { IMessage } from '../models/Chat';

export const formatMessage = (sender: string, msg: string) => {
  return {
    sender,
    message: msg,
    timestamp: moment().format('h:mm a'),
  };
};

export const updateChatLog = async (
  roomID: string,
  sender: string,
  msg: string
) => {
  return new Promise<boolean>(async (resolve, reject) => {
    const message: IMessage = formatMessage(sender, msg);
    try {
      await Chat.findOne({ 'room.roomID': roomID })
        .then((chat) => {
          if (chat) {
            chat.history = [...chat.history, message];
            chat
              .save()
              .then(() => {
                resolve(true);
              })
              .catch((err) => {
                reject(new Error('Failed to update chat log'));
              });
          } else {
            reject(new Error('Room is empty'));
          }
        })
        .catch((err) => {
          reject(Error('Failed to find room'));
        });
    } catch (err) {
      reject(err);
    }
  });
};
