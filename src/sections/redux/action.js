export const AUTH_DATA = 'AUTH_DATA';

export const addData = (data) => ({
  type: AUTH_DATA,
  payload: data,
});

export const LOGOUT = 'LOGOUT';

export const logout = () => ({
  type: LOGOUT,
});