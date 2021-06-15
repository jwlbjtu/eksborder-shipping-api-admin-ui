import React, { ReactElement, useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Breadcrumb, Divider } from 'antd';

import { useDispatch, useSelector } from 'react-redux';

import ProfilePage from '../../ProfilePage';
import PasswordPanel from '../../PasswordPanel';
import AdminInfoPanel from '../components/AdminInfoPanel';

import { PasswordFormValue, User } from '../../../shared/types/user';
import {
  selectAdminUsers,
  updateUserPasswordHandler
} from '../../../redux/user/userDataSlice';

const AdminProfile = (): ReactElement => {
  const dispatch = useDispatch();
  const history = useHistory();
  const adminUsers = useSelector(selectAdminUsers);
  const [userData, setUserData] = useState<User | undefined>();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const user = adminUsers.find((ele) => ele.id === id);
    if (!user) history.push('/admins');
    setUserData(user);
  }, [id, dispatch, adminUsers, history]);

  const passwordPanelDataHandler = async (values: PasswordFormValue) => {
    if (userData) {
      dispatch(updateUserPasswordHandler(userData.id, values));
    }
  };

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/admins">内部用户</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          {userData && `${userData.lastName} ${userData.firstName}`}
        </Breadcrumb.Item>
      </Breadcrumb>
      <Divider />
      {userData && (
        <ProfilePage
          panels={[
            <AdminInfoPanel data={userData} />,
            <PasswordPanel isSelf={false} onSumbit={passwordPanelDataHandler} />
          ]}
        />
      )}
    </>
  );
};

export default AdminProfile;
