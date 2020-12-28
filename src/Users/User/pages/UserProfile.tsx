import React, { ReactElement, useEffect, useState } from 'react';
import { Spin } from 'antd';

import ProfilePage from '../../ProfilePage';
import InfoPanel from '../components/InfoPanel/InfoPanel';
import PasswordPanel from '../../PasswordPanel';

import { USER_DATA } from '../../../shared/utils/constants';

const UserProfile = (): ReactElement => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [subLoading, setSubLoading] = useState(false);

  useEffect(() => {
    // TODO: backend connection
    setLoading(true);
    setTimeout(() => {
      setUserData({
        avatar: USER_DATA.avatar,
        name: USER_DATA.name,
        email: USER_DATA.email,
        countryCode: USER_DATA.phone.countryCode,
        phone: USER_DATA.phone.number
      });
      setLoading(false);
    }, 1000);
  }, []);

  const infoPanelDataHandler = (values: any) => {
    // TODO: connect to back end
    setSubLoading(true);
    setTimeout(() => {
      console.log(`Info updated from top`);
      console.log(values);
      const newData = { ...userData, ...values };
      setUserData(newData);
      console.log(newData);
      setSubLoading(false);
    }, 1000);
  };

  const passwordPanelDataHandler = (values: any) => {
    // TODO: connect to back end
    setSubLoading(true);
    setTimeout(() => {
      console.log(`Password updated from top`);
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
          <ProfilePage
            panels={[
              <InfoPanel data={userData} onSubmit={infoPanelDataHandler} />,
              <PasswordPanel onSumbit={passwordPanelDataHandler} />
            ]}
          />
        </Spin>
      )}
    </>
  );
};

export default UserProfile;
