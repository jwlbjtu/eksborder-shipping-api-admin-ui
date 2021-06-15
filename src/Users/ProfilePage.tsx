import React, { ReactElement, useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';

import './ProfilePage.css';

const { Sider, Header, Content } = Layout;

interface ProfilePageProps {
  panels: ReactElement[];
}

const ProfilePage = ({ panels }: ProfilePageProps): ReactElement => {
  const [panelUI, setPanelUI] = useState<ReactElement | null>(panels[0]);
  const [headerTitle, setHeaderTitle] = useState('基本信息');

  const showPanelByIndexHandler = (ind: number, title: string) => {
    setPanelUI(panels[ind]);
    setHeaderTitle(title);
  };

  return (
    <Layout style={{ minHeight: 360 }}>
      <Sider theme="light">
        <Menu
          style={{ height: '100%' }}
          defaultSelectedKeys={['0']}
          mode="inline"
        >
          <Menu.Item
            key="0"
            onClick={() => showPanelByIndexHandler(0, '基本信息')}
          >
            基本信息
          </Menu.Item>
          <Menu.Item
            key="1"
            onClick={() => showPanelByIndexHandler(1, '密码设置')}
          >
            密码设置
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background profile-header">
          {headerTitle}
        </Header>
        <Content>
          <div className="site-layout-background profile-content">
            {panelUI}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ProfilePage;
