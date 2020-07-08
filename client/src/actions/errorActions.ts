import {
  GET_ERRORS,
  CLEAR_ERRORS,
  ErrorActionTypes,
  errorTypes,
} from './types';

// return errors
export const returnErrors = (
  type: errorTypes,
  msg: string,
  status: number,
  id = null
): ErrorActionTypes => {
  return {
    type: GET_ERRORS,
    payload: {
      type,
      msg,
      status,
      id,
    },
  };
};

export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS,
  };
};
