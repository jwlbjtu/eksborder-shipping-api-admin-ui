import { createContext } from 'react';
import { UserData } from '../../types/user';

interface AuthContextProps {
  isLoggedIn: boolean;
  userData: UserData | null;
  login: (data: UserData) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  isLoggedIn: false,
  userData: null,
  login: (data: UserData) => {},
  logout: () => {}
});

export default AuthContext;
