import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Menu } from 'antd';
import React, { ReactElement, useContext } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

import AuthContext from '../../../shared/components/context/auth-context';

const AvatarDropdown = (): ReactElement => {
  const auth = useContext(AuthContext);

  const menuHeaderDropdown = (
    <Menu className="menu">
      <Menu.Item key="center" icon={<UserOutlined />}>
        <Link to="/user/profile">个人中心</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={auth.logout}>
        退出登录
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menuHeaderDropdown}>
      <span className="action account">
        <Avatar
          size="small"
          className="avatar"
          icon={<UserOutlined />}
          src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
          alt="avatar"
        />
        <span className="anticon">Wenlong Jiang</span>
      </span>
    </Dropdown>
  );
};

export default AvatarDropdown;
