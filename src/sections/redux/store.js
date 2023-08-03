import { createStore } from 'redux';
import { LOGOUT } from './action';

const rootReducer = (state = {}, action) => {
  switch (action.type) {
    case "AUTH_DATA":
        return {
          ...state,
          loggedIn: true,
          user: (action)? action.payload.jwt_auth.original.user: {},
          token: (action)? action.payload.jwt_auth.original.access_token: "",
        };
        case LOGOUT:
      return {};
    default:
      return state;
  }
};

const store = createStore(rootReducer);

export default store;