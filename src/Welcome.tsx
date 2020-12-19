import React, { ReactElement } from 'react';
import { Result } from 'antd';
import { SmileOutlined } from '@ant-design/icons';

const Welcome = (): ReactElement => {
  return (
    <Result
      icon={<SmileOutlined />}
      title="您好，欢迎来到EksShipping管理中心！"
    />
  );
};

export default Welcome;
