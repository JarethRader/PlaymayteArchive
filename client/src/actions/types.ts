/**
 * @Author Jareth Rader
 * @desc Theres are the type definitions for redux
 */

// User types
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILED = 'LOGIN_FAILED';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAILED = 'REGISTER_FAILED';
export const USER_LOADING = 'USER_LOADING';
export const USER_LOADED = 'USER_LOADED';
export const AUTH_ERROR = 'AUTH_ERROR';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILED = 'LOGOUT_FAILED';
export const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS';
export const UPDATE_USER_FAILED = 'UPDATE_USER_FAILED';
export const GET_ABOUT_SUCCESS = 'GET_ABOUT_SUCCESS';
export const GET_ABOUT_FAILED = 'GET_ABOUT_FAILED';
export const UPDATE_ABOUT_SUCCESS = 'UPDATE_ABOUT_SUCCESS';
export const UPDATE_ABOUT_FAILED = 'UPDATE_ABOUT_FAILED';
export const DELETE_USER_SUCCESS = 'DELETE_USER_SUCCESS';
export const DELETE_USER_FAILED = 'DELETE_USER_FAILED';
export const GET_VERIFIED_SUCCESS = 'GET_VERIFIED_SUCCESS';
export const GET_VERIFIED_FAILED = 'GET_VERIFIED_FAILED';
export const UPDATE_PASSWORD_SUCCESS = 'UPDATE_PASSWORD_SUCCESS';
export const UPDATE_PASSWORD_FAILED = 'UPDATE_PASSWORD_FAILED';

export interface IUserModel {
  id?: string;
  gamerTag?: string;
  gender?: string;
  preferredPronoun?: string;
  orientation?: string;
  firstName: string;
  lastName: string;
  email?: string;
  dob: string;
}

export enum errorTypes {
  login,
  register,
  loadUser,
  AuthError,
  Logout,
  UpdateUser,
  updatePassword,
}

// User State Interface
export interface IUserState {
  userInfo?: {};
  isAuthenticated?: boolean;
  isVerified?: boolean;
  aboutMe?: string;
  userLoading?: boolean;
}

// Login action interface
interface LoginSuccess {
  type: typeof LOGIN_SUCCESS;
  payload: IUserModel;
}
interface LoginFail {
  type: typeof LOGIN_FAILED;
  payload?: null;
}

// Login action type
export type LoginActionTypes = LoginSuccess | LoginFail;

// Parameters for registration method
export interface RegistrationObj {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gamerTag: string;
  gender: string;
  preferredPronoun: string;
  orientation: string;
  dob: string;
}

// Register success interface
interface RegisterSuccess {
  type: typeof REGISTER_SUCCESS;
  payload: IUserModel;
}
// Register failed interface
interface RegisterFail {
  type: typeof REGISTER_FAILED;
  payload?: null;
}
// Register action type
export type RegisterActionTypes = RegisterSuccess | RegisterFail;

// User Utility types
interface LoadingUserAction {
  type: typeof USER_LOADING;
  payload?: null;
}

interface AuthFailed {
  type: typeof AUTH_ERROR;
  payload?: any;
}

interface AuthSuccess {
  type: typeof USER_LOADED;
  payload?: IUserModel;
}

type AuthActionTypes = AuthFailed | AuthSuccess;

interface LogoutSuccess {
  type: typeof LOGOUT_SUCCESS;
  payload?: null;
}

interface LoutoutFailed {
  type: typeof LOGOUT_FAILED;
  payload?: null;
}

type LogoutActionTypes = LogoutSuccess | LoutoutFailed;

export interface UpdateObj {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  gamerTag?: string;
  gender?: string | null;
  preferredPronoun?: string | null;
  orientation?: string | null;
}

interface UpdateUserInfoSuccess {
  type: typeof UPDATE_USER_SUCCESS;
  payload: IUserModel;
}

interface UpdateUserInfoFailed {
  type: typeof UPDATE_USER_FAILED;
  payload?: null;
}

type UpdateUserInfoTypes = UpdateUserInfoSuccess | UpdateUserInfoFailed;

interface DeleteUserSuccess {
  type: typeof DELETE_USER_SUCCESS;
  payload?: null;
}

interface DeleteUserFailed {
  type: typeof DELETE_USER_FAILED;
  payload?: null;
}

type DeleteUserTypes = DeleteUserSuccess | DeleteUserFailed;

interface UpdateAboutSuccess {
  type: typeof UPDATE_ABOUT_SUCCESS;
  payload: string;
}

interface UpdateAboutFailed {
  type: typeof UPDATE_ABOUT_FAILED;
  payload?: null;
}

type UpdateAboutTypes = UpdateAboutSuccess | UpdateAboutFailed;

interface GetAboutSuccess {
  type: typeof GET_ABOUT_SUCCESS;
  payload: string;
}

interface GetAboutFailed {
  type: typeof GET_ABOUT_FAILED;
  payload?: null;
}

type GetAboutTypes = GetAboutSuccess | GetAboutFailed;

interface GetVerifiedSuccess {
  type: typeof GET_VERIFIED_SUCCESS;
  payload: boolean;
}

interface GetVerifiedFailled {
  type: typeof GET_VERIFIED_FAILED;
  payload?: null;
}

type GetVerifiedAction = GetVerifiedSuccess | GetVerifiedFailled;

interface UpdatePasswordSuccess {
  type: typeof UPDATE_PASSWORD_SUCCESS;
  payload?: null;
}

interface UpdatePasswordFailed {
  type: typeof UPDATE_PASSWORD_FAILED;
  payload?: null;
}

type UpdatePasswordAction = UpdatePasswordSuccess | UpdatePasswordFailed;

/**
 * @desc action type exports
 */
// Export Combined user types
export type UserActionTypes =
  | LoginActionTypes
  | RegisterActionTypes
  | LoadingUserAction
  | AuthActionTypes
  | LogoutActionTypes
  | UpdateUserInfoTypes
  | DeleteUserTypes
  | GetAboutTypes
  | UpdateAboutTypes
  | GetVerifiedAction
  | UpdatePasswordAction;

// Game Types
export const GAMES_LOADING = 'GAMES_LOADING';
export const GET_GAME_PREFERENCES_SUCCESS = 'GET_GAME_PREFERENCES_SUCCESS';
export const GET_GAME_PREFERENCES_FAILED = 'GET_GAME_PREFERENCES_FAILED';
export const UPDATE_GAME_PREFERENCES_SUCCESS =
  'UPDATE_GAME_PREFERENCES_SUCCESS';
export const UPDATE_GAME_PREFERENCES_FAILED = 'UPDATE_GAME_PREFERENCES_FAILED';

export interface IGamesState {
  gamePreferences?: {};
  gamesLoading?: boolean;
}

interface GamesLoading {
  type: typeof GAMES_LOADING;
  payload?: null;
}

export interface GamesObj {
  currentlyPlaying?: string[];
  favoriteGames?: string[];
  beteNoireGames?: string[];
  other?: string[];
}

interface GetGamesSuccess {
  type: typeof GET_GAME_PREFERENCES_SUCCESS;
  payload: GamesObj;
}

interface GetGamesFailed {
  type: typeof GET_GAME_PREFERENCES_FAILED;
  payload?: null;
}

type GetGamesActionTypes = GetGamesSuccess | GetGamesFailed;

interface UpdateGamesSuccess {
  type: typeof UPDATE_GAME_PREFERENCES_SUCCESS;
  payload: GamesObj;
}

interface UpdateGamesFailed {
  type: typeof UPDATE_GAME_PREFERENCES_FAILED;
  payload?: null;
}

type updateGamesActionTypes = UpdateGamesSuccess | UpdateGamesFailed;

export type GameActionTypes =
  | GamesLoading
  | GetGamesActionTypes
  | updateGamesActionTypes;

// Anime Types
export const ANIMES_LOADING = 'ANIMES_LOADING';
export const GET_ANIME_PREFERENCES_SUCCESS = 'GET_ANIME_PREFERENCES_SUCCESS';
export const GET_ANIME_PREFERENCES_FAILED = 'GET_ANIME_PREFERENCES_FAILED';
export const UPDATE_ANIME_PREFERENCES_SUCCESS =
  'UPDATE_ANIME_PREFERENCES_SUCCESS';
export const UPDATE_ANIME_PREFERENCES_FAILED =
  'UPDATE_ANIME_PREFERENCES_FAILED';

export interface IAnimesState {
  animePreferences?: {};
  animesLoading?: boolean;
}

interface AnimesLoading {
  type: typeof ANIMES_LOADING;
  payload?: null;
}

export interface AnimesObj {
  currentlyWatching?: string[];
  finishedAnimes?: string[];
  favoriteAnimes?: string[];
  beteNoireAnimes?: string[];
  other?: string[];
}

interface GetAnimesSuccess {
  type: typeof GET_ANIME_PREFERENCES_SUCCESS;
  payload: AnimesObj;
}

interface GetAnimesFailed {
  type: typeof GET_ANIME_PREFERENCES_FAILED;
  payload?: null;
}

type GetAnimesActionTypes = GetAnimesSuccess | GetAnimesFailed;

interface UpdateAnimesSuccess {
  type: typeof UPDATE_ANIME_PREFERENCES_SUCCESS;
  payload: AnimesObj;
}

interface UpdateAnimesFailed {
  type: typeof UPDATE_ANIME_PREFERENCES_FAILED;
  payload?: null;
}

type UpdateAnimesAcitonTypes = UpdateAnimesSuccess | UpdateAnimesFailed;

export type AnimeActionTypes =
  | AnimesLoading
  | GetAnimesActionTypes
  | UpdateAnimesAcitonTypes;

// Error Types

export const GET_ERRORS = 'GET_ERRORS';
export const CLEAR_ERRORS = 'CLEAR_ERRORS';

export interface IErrorState {
  errors?: {
    type: errorTypes | null;
    msg: string;
    status: number;
    id: number | null;
  };
}

interface GetErrorType {
  type: typeof GET_ERRORS;
  payload: {
    type: errorTypes | null;
    msg: string;
    status: number;
    id: number | null;
  };
}

interface ClearErrors {
  type: typeof CLEAR_ERRORS;
  payload?: null;
}

export type ErrorActionTypes = GetErrorType | ClearErrors;

export const CHAT_LOADING = 'CHAT_LOADING';
export const CONNECT_SOCKET_SUCCESS = 'CONNECT_SOCKET_SUCCESS';
export const CONNECT_SOCKET_FAILED = 'CONNECT_SOCKET_FAILED';
export const DISCONNECT_SOCKET_SUCCESS = 'DISCONNECT_SOCKET_SUCCESS';
export const DISCONNECT_SOCKET_FAILED = 'DISCONNECT_SOCKET_FAILED';
export const GET_CHAT_LOG_SUCCESS = 'GET_CHAT_LOG_SUCCESS';
export const GET_CHAT_LOG_FAILED = 'GET_CHAT_LOG_FAILED';
export const UPDATE_CHAT_LOG = 'UPDATE_CHAT_LOG';
export const DELETE_CHAT_SUCCESS = 'DELETE_CHAT_SUCCESS';
export const DELETE_CHAT_FAILED = 'DELETE_CHAT_FAILED';
export const CLEAR_CHAT = 'CLEAR_CHAT';

export interface IMessage {
  sender: string; // username
  message: string;
  timestamp: string;
}

export interface IChatState {
  socket?: SocketIOClient.Socket | null;
  chatLog?: IMessage[];
  chatLoading?: boolean;
}

interface ChatLoading {
  type: typeof CHAT_LOADING;
  payload?: null;
}

interface ConnectSuccess {
  type: typeof CONNECT_SOCKET_SUCCESS;
  payload: any;
}

interface ConnectFailed {
  type: typeof CONNECT_SOCKET_FAILED;
  payload?: null;
}

type ConnectSocketTypes = ConnectSuccess | ConnectFailed;

interface DisconnectSuccess {
  type: typeof DISCONNECT_SOCKET_SUCCESS;
  payload?: null;
}

interface DisconnectFailed {
  type: typeof DISCONNECT_SOCKET_FAILED;
  payload?: null;
}

type DisconnectSocketTypes = DisconnectSuccess | DisconnectFailed;

interface GetChatLogSuccess {
  type: typeof GET_CHAT_LOG_SUCCESS;
  payload: IMessage[];
}

interface GetChatLogFailed {
  type: typeof GET_CHAT_LOG_FAILED;
  payload?: null;
}

type GetChatLogAction = GetChatLogSuccess | GetChatLogFailed;

interface UpdateChatLog {
  type: typeof UPDATE_CHAT_LOG;
  payload: IMessage;
}

type UpdateChatLogAction = UpdateChatLog;

interface DeleteChatSuccess {
  type: typeof DELETE_CHAT_SUCCESS;
  payload?: null;
}

interface DeleteChatFailed {
  type: typeof DELETE_CHAT_FAILED;
  payload?: null;
}

type DeleteChatAction = DeleteChatSuccess | DeleteChatFailed;

interface ClearChat {
  type: typeof CLEAR_CHAT;
  payload?: null;
}

type ClearChatAction = ClearChat;

export type ChatActionTypes =
  | ChatLoading
  | ConnectSocketTypes
  | DisconnectSocketTypes
  | GetChatLogAction
  | UpdateChatLogAction
  | DeleteChatAction
  | ClearChatAction;

export const SOCIAL_LOADING = 'SOCIAL_LOADING';
export const GET_PROFILE_SUCCESS = 'GET_PROFILE_SUCCESS';
export const GET_PROFILE_FAILED = 'GET_PROFILE_FAILED';
export const GET_ROOMS_SUCCESS = 'GET_ROOMS_SUCCESS';
export const GET_ROOMS_FAILED = 'GET_ROOMS_FAILED';
export const REMOVE_FRIEND_SUCCESS = 'REMOVE_FRIEND_SUCCESS';
export const REMOVE_FRIEND_FAILED = 'REMOVE_FRIEND_FAILED';
export const MATCH_SUCCESS = 'MATCH_SUCCESS';
export const MATCH_FAILED = 'MATCH_FAILED';
export const PASS_SUCCESS = 'PASS_SUCCESS';
export const PASS_FAILED = 'PASS_FAILED';
export const GET_PROPSECTS_SUCCESS = 'GET_PROPSECTS_SUCCESS';
export const GET_PROPSECTS_FAILED = 'GET_PROPSECTS_FAILED';
export const CLEAR_PROSPECTS = 'CLEAR_PROSPECTS';

export interface IUserProfile {
  info: IUserModel;
  games: GamesObj;
  animes: AnimesObj;
  aboutMe: string;
}

export class ProspectType {
  public prospectID: string = '';
  public decided: boolean = false;
}

export interface ISocialState {
  socialLoading?: boolean;
  selectedUser?: IUserProfile | {};
  friendList?: any;
  prospectList?: ProspectType[];
}

interface SetSocialLoading {
  type: typeof SOCIAL_LOADING;
  payload?: null;
}

interface GetProfileSuccess {
  type: typeof GET_PROFILE_SUCCESS;
  payload: IUserProfile;
}

interface GetProfileFailed {
  type: typeof GET_PROFILE_FAILED;
  payload?: null;
}

type GetProfileAction = GetProfileSuccess | GetProfileFailed;

interface IFriendList {
  FriendList: {
    friendID: string;
    roomID: string; // list of roomIDs the user is a part of
  }[];
}

interface GetRoomsSuccess {
  type: typeof GET_ROOMS_SUCCESS;
  payload: IFriendList;
}

interface GetRoomsFailed {
  type: typeof GET_ROOMS_FAILED;
  payload?: null;
}

type GetRoomsAction = GetRoomsSuccess | GetRoomsFailed;

interface RemoveFriendSuccess {
  type: typeof REMOVE_FRIEND_SUCCESS;
  payload: IFriendList;
}

interface RemoveFriendFailed {
  type: typeof REMOVE_FRIEND_FAILED;
  payload?: null;
}

type RemoveFriendAction = RemoveFriendSuccess | RemoveFriendFailed;

interface MatchSuccess {
  type: typeof MATCH_SUCCESS;
  payload: string;
}

interface Matchfailed {
  type: typeof MATCH_FAILED;
  payload?: null;
}

type MatchAction = MatchSuccess | Matchfailed;

interface PassSuccess {
  type: typeof PASS_SUCCESS;
  payload?: null;
}

interface PassFailed {
  type: typeof PASS_FAILED;
  payload: string;
}

type PassAction = PassSuccess | PassFailed;

interface GetProspectsSuccess {
  type: typeof GET_PROPSECTS_SUCCESS;
  payload: ProspectType[];
}

interface GetProspectsFailed {
  type: typeof GET_PROPSECTS_FAILED;
  payload?: null;
}

type GetProspectsAction = GetProspectsSuccess | GetProspectsFailed;

interface ClearProspects {
  type: typeof CLEAR_PROSPECTS;
  payload?: null;
}

type ClearProspectsAction = ClearProspects;

export type SocialActionTypes =
  | SetSocialLoading
  | GetProfileAction
  | GetRoomsAction
  | RemoveFriendAction
  | MatchAction
  | PassAction
  | GetProspectsAction
  | ClearProspectsAction;
