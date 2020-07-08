import Prospect, { ProspectType } from '../models/Prospect';

export const _addAllToNew = (userID: string) => {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      await Prospect.find({})
        .then((allUsers) => {
          // all users except new
          const usersExceptNew = allUsers.filter(
            (user) => user.userID !== userID
          );
          // new user
          const userProspect = allUsers.filter(
            (user) => user.userID === userID
          )[0];
          // get all user ID's from usersExceptNew, add to new ProspectType object,
          // push that new object onto userProspect.prospectList
          const addedAll = new Promise<ProspectType[] | null>(
            async (_resolve, _reject) => {
              let _addProspects: ProspectType[] = [];
              if (usersExceptNew.length > 0) {
                await usersExceptNew.forEach(async (user, index) => {
                  _addProspects = [
                    ..._addProspects,
                    { prospectID: user.userID, decided: false },
                  ];
                  if (index === usersExceptNew.length - 1) {
                    _resolve(_addProspects);
                  }
                });
              }
              _resolve(null);
            }
          );
          addedAll
            .then(async (addProspects) => {
              if (addProspects) {
                userProspect.prospects = addProspects;
                await userProspect.save();
              }
              resolve(true);
            })
            .catch((err) => reject(err));
        })
        .catch((err) => {
          // throw new Error('failed to fetch all users');
          throw err;
        });
    } catch (err) {
      reject(err);
    }
  });
};

export const _addNewToAll = (userID: string) => {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      await Prospect.find({})
        .then((allUsers) => {
          const usersExceptNew = allUsers.filter(
            (user) => user.userID !== userID
          );
          // new user
          const newProspect = {
            prospectID: allUsers.filter((user) => user.userID === userID)[0]
              .userID,
            decided: false,
          };
          const added = new Promise<boolean>(async (_resolve, _reject) => {
            if (usersExceptNew.length > 0) {
              usersExceptNew.forEach(async (_prospect, index) => {
                _prospect.prospects = [..._prospect.prospects, newProspect];
                await _prospect.save();
                if (index === usersExceptNew.length - 1) {
                  _resolve(true);
                }
              });
            }
            _resolve(false);
          });
          added.then((success) => resolve(true)).catch((err) => reject(err));
        })
        .catch((err) => {
          // throw new Error('failed to fetch all users');
          reject(err);
        });
    } catch (err) {
      reject(err);
    }
  });
};

export const _removeFromAll = (userID: string) => {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      await Prospect.find({})
        .then((allUsers) => {
          const usersExceptNew = allUsers.filter(
            (user) => user.userID !== userID
          );

          const removed = new Promise<boolean>((_resolve, _reject) => {
            usersExceptNew.forEach((userProspect, index) => {
              userProspect.prospects = userProspect.prospects.filter(
                (prospect) => prospect.prospectID !== userID
              );
              userProspect.save();
              if (index === usersExceptNew.length - 1) {
                _resolve(true);
              }
            });
          });
          removed.then((success) => resolve(true)).catch((err) => reject(err));
        })
        .catch((err) => {
          reject(err);
        });
    } catch (err) {
      reject(err);
    }
  });
};

export const _addNew = (userID: string) => {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      await _addAllToNew(userID)
        .then((ATNuccess) => {
          if (ATNuccess) {
            _addNewToAll(userID)
              .then((NTAsuccess) => {
                if (NTAsuccess) {
                  resolve(true);
                }
              })
              .catch((err) => {
                reject(err);
              });
          }
        })
        .catch((err) => {
          reject(err);
        });
    } catch (err) {
      reject(err);
    }
  });
};

export const _setDecidedTrue = (userID: string, matchID: string) => {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      await Prospect.findOne({ userID })
        .then((userProspect) => {
          if (userProspect) {
            const decidedSet = new Promise<boolean>((_resolve, _reject) => {
              userProspect.prospects.forEach((prospect, index) => {
                if (prospect.prospectID === matchID) {
                  userProspect.prospects[index].decided = true;
                }
                if (index === userProspect.prospects.length - 1) {
                  _resolve(true);
                }
              });
            });
            decidedSet.then((success) => {
              userProspect.save();
              resolve(true);
            });
          } else throw new Error('Failed to find user prospect document');
        })
        .catch((err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
};
