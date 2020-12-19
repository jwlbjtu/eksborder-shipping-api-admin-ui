import {
  AccountBookOutlined,
  AuditOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { Menu } from 'antd';
import SubMenu from 'antd/lib/menu/SubMenu';
import React, { ReactElement } from 'react';
import { NavLink } from 'react-router-dom';

const MenuList = (): ReactElement => {
  return (
    <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
      <SubMenu key="sub1" icon={<TeamOutlined />} title="用户管理">
        <Menu.Item key="1">
          <NavLink to="/clients">货代用户</NavLink>
        </Menu.Item>
        <Menu.Item key="2">
          <NavLink to="/admins">内部用户</NavLink>
        </Menu.Item>
      </SubMenu>
      <Menu.Item key="4" icon={<AccountBookOutlined />}>
        <NavLink to="/carriers">物流账号</NavLink>
      </Menu.Item>
      <Menu.Item key="5" icon={<AuditOutlined />}>
        <NavLink to="/audit">操作记录</NavLink>
      </Menu.Item>
    </Menu>
  );
};

export default MenuList;
