import { Header } from 'antd/lib/layout/layout';
import React, { ReactElement } from 'react';
import { Space } from 'antd';
import AvatarDropdown from './AvatarDropdown/AvatarDropdown';

import './HeaderComponent.css';

const HeaderComponent = (): ReactElement => {
  return (
    <Header
      className="site-layout-background"
      style={{ padding: 0, marginBottom: '26px' }}
    >
      <Space className="right">
        <AvatarDropdown />
      </Space>
    </Header>
  );
};

export default HeaderComponent;
