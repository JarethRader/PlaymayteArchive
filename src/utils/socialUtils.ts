import User, { IUserModel } from '../models/User';
import Chat, { IChatModel } from '../models/Chat';
import Match, { IMatchModel } from '../models/Match';
import FriendList from '../models/FriendList';

export const _createNewRoom = async (userI: string, userII: string) => {
  return new Promise<IChatModel | null>(async (resolve, reject) => {
    const userIHandle: IUserModel | null = await User.findById(userI);
    const userIIHandle: IUserModel | null = await User.findById(userII);
    try {
      await Chat.findOne({
        'room.userI._ID': userI || userII,
        'room.userII._ID': userII || userI,
      })
        .then(async (room: IChatModel | null) => {
          if (!room) {
            const newChatInfo = {
              room: {
                userI: {
                  _ID: userI,
                  handle: userIHandle?.info.firstName,
                },
                userII: {
                  _ID: userII,
                  handle: userIIHandle?.info.firstName,
                },
              },
            };

            const _newChat: IChatModel = new Chat(newChatInfo);
            await _newChat
              .save()
              .then(async (newChat: IChatModel | null) => {
                if (newChat) {
                  await FriendList.findOne({ userID: userI })
                    .then((list) => {
                      if (list) {
                        list.FriendList.forEach((friend) => {
                          if (friend.friendID === userII) {
                            friend.roomID = newChat.room.roomID;
                            list.save();
                          }
                        });
                      } else {
                        throw new Error('Failed to find friend list');
                      }
                    })
                    .catch((err) => {
                      throw err;
                    });
                  await FriendList.findOne({ userID: userII })
                    .then((list) => {
                      if (list) {
                        list.FriendList.forEach((friend) => {
                          if (friend.friendID === userI) {
                            friend.roomID = newChat.room.roomID;
                            list.save();
                          }
                        });
                      } else {
                        throw new Error('Failed to find friend list');
                      }
                    })
                    .catch((err) => {
                      throw err;
                    });
                  resolve(newChat);
                } else throw new Error('Failed to create new chat room');
              })
              .catch((err: Error) => {
                reject(new Error('Failed to create new chat room'));
              });
          } else {
            resolve(room);
          }
        })
        .catch((err: Error) => {
          reject(new Error('Failed to find chat room'));
        });
    } catch (err) {
      reject(err);
    }
  });
};

export const createNewMatch = async (userI: string, userII: string) => {
  return new Promise<IMatchModel | null>(async (resolve, reject) => {
    const newMatchInfo = {
      UserIMatched: {
        userID: userI,
        matched: true,
      },
      UserIIMatched: {
        userID: userII,
        matched: false,
      },
    };
    const newMatch = new Match(newMatchInfo);
    try {
      await newMatch
        .save()
        .then((savedMatch) => {
          resolve(savedMatch);
        })
        .catch((err: Error) => {
          reject(new Error('Failed to create new match'));
        });
    } catch (err) {
      reject(err);
    }
  });
};

export const createNewUnMatch = async (userI: string, userII: string) => {
  return new Promise<IMatchModel | null>(async (resolve, reject) => {
    const newMatchInfo = {
      UserIMatched: {
        userID: userI,
        matched: false,
        unmatched: true,
      },
      UserIIMatched: {
        userID: userII,
        matched: false,
        unmatched: false,
      },
    };
    const newMatch = new Match(newMatchInfo);
    try {
      await newMatch
        .save()
        .then((savedMatch) => {
          resolve(savedMatch);
        })
        .catch((err: Error) => {
          reject(new Error('Failed to create new match'));
        });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 *
 * @param user this is the user ID
 * @param newFriend This is the id of the non-user
 * @param roomID  this is the room id string
 */

export const _addNewFriend = async (
  user: string,
  newFriend: string,
  roomID: string
) => {
  return new Promise(async (resolve, reject) => {
    try {
      await FriendList.findOne({ userID: user })
        .then((list) => {
          if (!list) {
            throw new Error('Failed to find friends list');
          }
          list.addFriend(newFriend, roomID);
        })
        .catch((err: Error) => {
          throw err;
        });
      await FriendList.findOne({ userID: newFriend })
        .then((list) => {
          if (!list) {
            throw new Error('Failed to find friends list');
          }
          list.addFriend(user, roomID);
        })
        .catch((err: Error) => {
          throw err;
        });
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

export const _removeFriend = async (user: string, friend: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      await FriendList.findOne({ userID: user })
        .then((list) => {
          if (!list) {
            throw new Error('Failed to find friends list');
          }
          list.removeFriend(friend);
        })
        .catch((err) => {
          throw err;
        });
      await FriendList.findOne({ userID: friend })
        .then((list) => {
          if (!list) {
            throw new Error('Failed to find friends list');
          }
          list.removeFriend(user);
        })
        .catch((err) => {
          throw err;
        });
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

export const _checkMatch = (match: IMatchModel) => {
  return new Promise<{ match: boolean }>(async (resolve, reject) => {
    try {
      // if there is a match, check if they both matched
      if (match.UserIMatched.matched) {
        // if user 2 has already matched, and user 1 is now matching, it is a match
        match.UserIIMatched.matched = true;
        match.save();
        // create a new room
        await _createNewRoom(
          match.UserIMatched.userID,
          match.UserIIMatched.userID
        )
          .then(async (newRoom) => {
            // add users to each others friends list
            if (newRoom) {
              await _addNewFriend(
                match.UserIMatched.userID,
                match.UserIIMatched.userID,
                newRoom?.room.roomID
              )
                .then(() => {
                  resolve({ match: true });
                })
                .catch((err) => {
                  throw err;
                });
            }
          })
          .catch((err) => {
            throw err;
          });
      } else {
        // user 2 has not matched, but user 1 is matching, update match document
        match.UserIIMatched.matched = true;
        await match
          .save()
          .then((updatedMatch) => {
            resolve({ match: false });
          })
          .catch((err) => {
            throw new Error('Failed to update match');
          });
      }
    } catch (err) {
      reject(err);
    }
  });
};

interface IFriend {
  firstName?: string;
  lastName?: string;
  friendID: string;
  roomID: string;
}

export const _getFriendList = async (userID: string) => {
  return new Promise<{ friendList: IFriend[] }>(async (resolve, reject) => {
    await FriendList.findOne({ userID })
      .then(async (_friendList) => {
        if (_friendList) {
          const parsedFriendList = new Promise<IFriend[]>(
            async (_resolve, _reject) => {
              let list: IFriend[] = [];
              await _friendList.FriendList.forEach(async (room, index) => {
                await User.findById(room.friendID)
                  .then((user) => {
                    const parsedFriendElement: IFriend = {
                      firstName: user?.info.firstName,
                      lastName: user?.info.lastName,
                      friendID: room.friendID,
                      roomID: room.roomID,
                    };
                    list = [...list, parsedFriendElement];
                    if (index === _friendList.FriendList.length - 1)
                      _resolve(list);
                  })
                  .catch((err) => {
                    _reject([...err, new Error('Failed to find user')]);
                  });
              });
            }
          );
          parsedFriendList
            .then((list: IFriend[]) => {
              resolve({ friendList: list });
            })
            .catch((err) => {
              reject(err);
            });
        }
      })
      .catch((err) => {
        reject([...err, new Error('Failed to find users friend list')]);
      });
  });
};

export const _createNewChat = (userI: string, userII: string) => {
  return new Promise<{ match: boolean }>(async (resolve, reject) => {
    // Check if a match docuemnt already exists for these users
    try {
      await Match.findOne({
        'UserIMatched.userID': userI,
        'UserIIMatched.userID': userII,
      })
        .then(async (match) => {
          if (match) {
            await _checkMatch(match)
              .then((didMatch) => {
                if (didMatch) {
                  resolve(didMatch);
                }
              })
              .catch((err) => {
                throw err;
              });
          } else {
            await Match.findOne({
              'UserIMatched.userID': userII,
              'UserIIMatched.userID': userI,
            })
              .then(async (_match) => {
                if (_match) {
                  await _checkMatch(_match)
                    .then((didMatch) => {
                      if (didMatch) {
                        resolve(didMatch);
                      }
                    })
                    .catch((err) => {
                      throw err;
                    });
                } else {
                  // if there is no match, create a new match document
                  await createNewMatch(userI, userII)
                    .then((newMatch) => {
                      resolve({ match: false });
                    })
                    .catch((err) => {
                      throw err;
                    });
                }
              })
              .catch((err) => {
                throw [...err, new Error('Failed to find match 2')];
              });
          }
        })
        .catch((err) => {
          throw [...err, new Error('Failed to find match 1')];
        });
    } catch (err) {
      reject(err);
    }
  });
};

export const _unmatch = (userI: string, userII: string) => {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      await Match.findOne({
        'UserIMatched.userID': userI,
        'UserIIMatched.userID': userII,
      })
        .then(async (match) => {
          if (match) {
            match.UserIMatched.unmatched = true;
            match.save().then((updatedMatch) => {
              if (updatedMatch) {
                resolve(true);
              }
              throw new Error('Failed to remove match');
            });
          } else {
            await Match.findOne({
              'UserIMatched.userID': userII,
              'UserIIMatched.userID': userI,
            })
              .then(async (_match) => {
                if (_match) {
                  _match.UserIIMatched.unmatched = true;
                  _match
                    .save()
                    .then((_updatedMatch) => {
                      if (_updatedMatch) {
                        resolve(true);
                      }
                      throw new Error('Failed to remove match');
                    })
                    .catch((err) => {
                      throw err;
                    });
                } else {
                  await createNewUnMatch(userI, userII)
                    .then((newMatch) => {
                      resolve(false);
                    })
                    .catch((err) => {
                      throw err;
                    });
                }
              })
              .catch((err) => {
                throw [...err, new Error('Failed to find match 2')];
              });
          }
        })
        .catch((err) => {
          throw [...err, new Error('Failed to find match 1')];
        });
    } catch (err) {
      reject(err);
    }
  });
};
