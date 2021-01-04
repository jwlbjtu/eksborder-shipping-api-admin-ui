import { createContext } from 'react';
import { UserData } from '../../types/user';

interface AuthContextProps {
  isLoggedIn: boolean;
  userData: UserData | null;
  setUserData: (data: UserData) => void;
  login: (data: UserData, expirationDate?: Date) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  isLoggedIn: false,
  userData: null,
  setUserData: (data: UserData) => {},
  login: (data: UserData) => {},
  logout: () => {}
});

export default AuthContext;
