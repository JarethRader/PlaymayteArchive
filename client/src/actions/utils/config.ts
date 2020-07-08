import Cookies from 'universal-cookie';

export const config: any = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export const BASE =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8000'
    : 'https://playmayte.com';

export const API = BASE + '/api/v1';

export const setCSRF = async () => {
  return new Promise<boolean>(async (resolve, reject) => {
    await fetch(API + '/user/', {
      method: 'GET',
      headers: config,
      credentials: 'include',
    })
      .then(async (response) => {
        const cookies = new Cookies();
        if (cookies.getAll()['CSRF-Token']) {
          localStorage.setItem('csrfToken', cookies.getAll()['CSRF-Token']);
          resolve(true);
        }
      })
      .catch((err) => {
        reject();
      });
  });
};

export const CSRFConfig = () => {
  const headers: any = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'CSRF-Token': localStorage.getItem('csrfToken'),
  };
  return headers;
};

export default config;
