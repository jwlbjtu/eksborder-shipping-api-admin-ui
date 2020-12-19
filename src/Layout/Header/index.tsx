import { Header } from 'antd/lib/layout/layout';
import React, { ReactElement } from 'react';

const HeaderComponent = (): ReactElement => {
  return (
    <Header
      className="site-layout-background"
      style={{ padding: 0, marginBottom: '26px' }}
    />
  );
};

export default HeaderComponent;
