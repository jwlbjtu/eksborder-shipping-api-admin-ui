import React, { ReactElement, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Spin, Breadcrumb, Divider, message } from 'antd';

import axios from '../../../shared/utils/axios-base';

import ProfilePage from '../../ProfilePage';
import PasswordPanel from '../../PasswordPanel';
import AdminInfoPanel from '../components/AdminInfoPanel';
import LoadError from '../../../shared/components/ErrorPages';

import { SERVER_ROUTES } from '../../../shared/utils/constants';
import errorHandler from '../../../shared/utils/errorHandler';
import {
  PasswordFormValue,
  UpdateUserData,
  User
} from '../../../shared/types/user';

const AdminProfile = (): ReactElement => {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    // TODO: add authentication
    setLoading(true);
    setFailed(false);
    axios
      .get(`${SERVER_ROUTES.USERS}/${id}`)
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        errorHandler(error);
        setFailed(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const getUserData = async () => {
    // TODO: add authentication
    setLoading(true);
    setFailed(false);
    try {
      const response = await axios.get(`${SERVER_ROUTES.USERS}/${id}`);
      setUserData(response.data);
    } catch (error) {
      errorHandler(error);
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };

  const infoPanelDataHandler = async (data: UpdateUserData) => {
    // TODO: add auth
    setSubLoading(true);
    try {
      if (userData) {
        const response = await axios.put(SERVER_ROUTES.USERS, {
          id: userData.id,
          ...data
        });
        const updatedUser = response.data;
        setUserData(updatedUser);
        message.success('用户信息更新成功！');
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setSubLoading(false);
    }
  };

  const passwordPanelDataHandler = async (values: PasswordFormValue) => {
    // TODO: add auth
    setSubLoading(true);
    try {
      if (userData) {
        await axios.put(`${SERVER_ROUTES.USERS}/password`, {
          id: userData.id,
          ...values
        });
        message.success('密码更新成功！');
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setSubLoading(false);
    }
  };

  const content = failed ? (
    <LoadError
      title="获取用户信息错误，请稍后再试！"
      text="再试一次"
      onButtonClick={getUserData}
    />
  ) : (
    <Spin size="large" spinning={subLoading}>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/admins">内部用户</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          {userData && `${userData.lastName} ${userData.firstName}`}
        </Breadcrumb.Item>
      </Breadcrumb>
      <Divider />
      <ProfilePage
        panels={[
          <AdminInfoPanel data={userData} onSubmit={infoPanelDataHandler} />,
          <PasswordPanel isSelf={false} onSumbit={passwordPanelDataHandler} />
        ]}
      />
    </Spin>
  );

  return (
    <>
      {loading ? (
        <div style={{ marginTop: '15%', textAlign: 'center' }}>
          <Spin size="large" />
        </div>
      ) : (
        content
      )}
    </>
  );
};

export default AdminProfile;
