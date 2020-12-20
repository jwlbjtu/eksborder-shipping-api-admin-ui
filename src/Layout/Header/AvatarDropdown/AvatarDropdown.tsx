import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Menu } from 'antd';
import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';

const menuHeaderDropdown = (
  <Menu className="menu">
    <Menu.Item key="center" icon={<UserOutlined />}>
      <Link to="/user/profile">个人中心</Link>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="logout" icon={<LogoutOutlined />}>
      退出登录
    </Menu.Item>
  </Menu>
);

const AvatarDropdown = (): ReactElement => {
  return (
    <Dropdown overlay={menuHeaderDropdown}>
      <span className="action account">
        <Avatar
          size="small"
          className="avatar"
          src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
          alt="avatar"
        />
        <span className="anticon">Wenlong Jiang</span>
      </span>
    </Dropdown>
  );
};

export default AvatarDropdown;
