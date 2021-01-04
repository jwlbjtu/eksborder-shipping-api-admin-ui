import { message } from 'antd';
import { useState, useCallback, useEffect } from 'react';
import { UserData } from '../types/user';
import { SERVER_ROUTES } from '../utils/constants';
import axios from '../utils/axios-base';

let logoutTimer: NodeJS.Timeout;

const useAuth = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [tokenExpDate, setTokenExpDate] = useState<Date | null>(null);

  const login = useCallback((data: UserData, expirationDate?: Date) => {
    setUserData(data);
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 3600);
    setTokenExpDate(tokenExpirationDate);
    localStorage.setItem(
      'eksb-userData',
      JSON.stringify({ data, expiration: tokenExpirationDate.toISOString() })
    );
  }, []);

  const logout = useCallback(async () => {
    try {
      if (userData) {
        await axios.get(`${SERVER_ROUTES.USERS}/logout`, {
          headers: {
            Authorization: `${userData.token_type} ${userData.token}`
          }
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      message.info('已登出');
      setUserData(null);
      setTokenExpDate(null);
      localStorage.removeItem('eksb-userData');
    }
  }, [userData]);

  useEffect(() => {
    if (userData && tokenExpDate) {
      const remainingTime = tokenExpDate.getTime() - new Date().getTime();
      // log user out 3 mins befor token expires
      logoutTimer = setTimeout(logout, remainingTime - 1000 * 60 * 3);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [logout, userData, tokenExpDate]);

  useEffect(() => {
    const value = localStorage.getItem('eksb-userData');
    if (value) {
      const storedData: { data: UserData; expiration: string } = JSON.parse(
        value
      );
      if (
        storedData.data &&
        storedData.data.token &&
        new Date(storedData.expiration) > new Date()
      ) {
        login(storedData.data, new Date(storedData.expiration));
      }
    }
  }, [login]);

  return { userData, setUserData, login, logout };
};

export default useAuth;
