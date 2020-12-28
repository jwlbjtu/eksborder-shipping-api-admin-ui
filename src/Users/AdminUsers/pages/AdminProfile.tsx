import React, { ReactElement, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Spin, Breadcrumb, Divider } from 'antd';

import ProfilePage from '../../ProfilePage';
import PasswordPanel from '../../PasswordPanel';
import AdminInfoPanel from '../components/AdminInfoPanel';

import { ADMIN_SAMPLE_DATA } from '../../../shared/utils/constants';

const AdminProfile = (): ReactElement => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    // TODO: backend connection
    setLoading(true);
    setTimeout(() => {
      setUserData(ADMIN_SAMPLE_DATA[+id - 1]);
      setLoading(false);
    }, 1000);
  }, [id]);

  const infoPanelDataHandler = (values: any) => {
    // TODO: connect to back end
    setSubLoading(true);
    setTimeout(() => {
      console.log(`Info updated from admin top`);
      console.log(values);
      const newData = {
        ...userData,
        ...values,
        date: '2020/12/19',
        role: values.superAdmin ? 'Super' : 'Admin'
      };
      setUserData(newData);
      console.log(newData);
      setSubLoading(false);
    }, 1000);
  };

  const passwordPanelDataHandler = (values: any) => {
    // TODO: connect to back end
    setSubLoading(true);
    setTimeout(() => {
      console.log(`Password updated from admin top`);
      console.log(values);
      setSubLoading(false);
    }, 1000);
  };

  return (
    <>
      {loading ? (
        <div style={{ marginTop: '15%', textAlign: 'center' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Spin size="large" spinning={subLoading}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/admins">内部用户</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {userData && `${userData.lastname} ${userData.firstname}`}
            </Breadcrumb.Item>
          </Breadcrumb>
          <Divider />
          <ProfilePage
            panels={[
              <AdminInfoPanel
                data={userData}
                onSubmit={infoPanelDataHandler}
              />,
              <PasswordPanel onSumbit={passwordPanelDataHandler} />
            ]}
          />
        </Spin>
      )}
    </>
  );
};

export default AdminProfile;
