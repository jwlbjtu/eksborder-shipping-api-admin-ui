import React, { ReactElement, useState } from 'react';
import { Layout, Menu } from 'antd';

import './Profile.css';

import InfoPanel from '../InfoPanel/InfoPanel';
import PasswordPanel from '../PasswordPanel/PasswordPanel';

const { Sider, Header, Content } = Layout;

// TODO - backen conection
const USER_DATA = {
  name: 'Wenlong Jiang',
  email: 'wenlong.jiang@eksborder.com',
  phone: {
    countryCode: '1',
    number: '6173010512'
  }
};

const Profile = (): ReactElement => {
  const [showInfo, setShowInfo] = useState(true);
  // should  use 'fields' property
  const [infoFormData, setInfoFormData] = useState({
    name: USER_DATA.name,
    email: USER_DATA.email,
    prefix: USER_DATA.phone.countryCode,
    phone: USER_DATA.phone.number
  });

  const menuClickedHandler = (showInfoFlag: boolean) => {
    setShowInfo(showInfoFlag);
  };

  const showContent = showInfo ? (
    <InfoPanel data={infoFormData} />
  ) : (
    <PasswordPanel />
  );

  return (
    <Layout style={{ minHeight: 360 }}>
      <Sider theme="light">
        <Menu
          style={{ height: '100%' }}
          defaultSelectedKeys={['info']}
          mode="inline"
        >
          <Menu.Item key="info" onClick={() => menuClickedHandler(true)}>
            基本信息
          </Menu.Item>
          <Menu.Item key="security" onClick={() => menuClickedHandler(false)}>
            密码设置
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background profile-header">
          {showInfo ? '基本信息' : '密码设置'}
        </Header>
        <Content>
          <div className="site-layout-background profile-content">
            {showContent}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Profile;
