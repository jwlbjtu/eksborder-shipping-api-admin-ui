import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { message, Spin } from 'antd';

import ProfilePage from '../../ProfilePage';
import InfoPanel from '../components/InfoPanel/InfoPanel';
import PasswordPanel from '../../PasswordPanel';

import { SERVER_ROUTES } from '../../../shared/utils/constants';
import AuthContext from '../../../shared/components/context/auth-context';
import axios from '../../../shared/utils/axios-base';
import errorHandler from '../../../shared/utils/errorHandler';
import { PasswordFormValue, UpdateUserSelf } from '../../../shared/types/user';

const UserProfile = (): ReactElement => {
  const auth = useContext(AuthContext);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [subLoading, setSubLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${SERVER_ROUTES.USERS}/self`, {
        headers: {
          Authorization: `${auth.userData?.token_type} ${auth.userData?.token}`
        }
      })
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        errorHandler(error);
      })
      .finally(() => setLoading(false));
  }, [auth]);

  const infoPanelDataHandler = async (values: UpdateUserSelf) => {
    setSubLoading(true);
    try {
      const response = await axios.put(
        SERVER_ROUTES.USERS,
        { id: userData.id, ...values },
        {
          headers: {
            Authorization: `${auth.userData?.token_type} ${auth.userData?.token}`
          }
        }
      );
      setUserData(response.data);
      const newUserData = {
        ...auth.userData,
        fullName: `${response.data.lastName}${response.data.firstName}`
      };
      // @ts-expect-error: ignore
      auth.setUserData(newUserData);
      message.success('用户信息更新成功！');
    } catch (error) {
      errorHandler(error);
    } finally {
      setSubLoading(false);
    }
  };

  const passwordPanelDataHandler = async (values: PasswordFormValue) => {
    setSubLoading(true);
    try {
      if (userData) {
        await axios.put(`${SERVER_ROUTES.USERS}/selfPassword`, values, {
          headers: {
            Authorization: `${auth.userData?.token_type} ${auth.userData?.token}`
          }
        });
        message.success('密码更新成功！');
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setSubLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <div style={{ marginTop: '15%', textAlign: 'center' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Spin size="large" spinning={subLoading}>
          <ProfilePage
            panels={[
              <InfoPanel data={userData} onSubmit={infoPanelDataHandler} />,
              <PasswordPanel isSelf onSumbit={passwordPanelDataHandler} />
            ]}
          />
        </Spin>
      )}
    </>
  );
};

export default UserProfile;
