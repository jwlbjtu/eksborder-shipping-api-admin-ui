import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Menu } from 'antd';
import React, { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  logoutUserHandler,
  selectCurUser
} from '../../../redux/user/userSlice';

import { DEFAULT_SERVER_HOST } from '../../../shared/utils/constants';

const AvatarDropdown = (): ReactElement => {
  const dispatch = useDispatch();
  const curUser = useSelector(selectCurUser);

  const menuHeaderDropdown = (
    <Menu className="menu">
      <Menu.Item key="center" icon={<UserOutlined />}>
        <Link to="/user/profile">个人中心</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        key="logout"
        icon={<LogoutOutlined />}
        onClick={() => dispatch(logoutUserHandler())}
      >
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
          src={`${DEFAULT_SERVER_HOST}/${curUser?.logoImage}`}
          alt="avatar"
        />
        <span className="anticon">{curUser?.fullName}</span>
      </span>
    </Dropdown>
  );
};

export default AvatarDropdown;
