import { create } from 'lodash';
import { createContext } from 'react';

const AuthContext = createContext({
  isLoggedIn: true, // TODO: change back to false
  login: () => {},
  logout: () => {}
});

export default AuthContext;
