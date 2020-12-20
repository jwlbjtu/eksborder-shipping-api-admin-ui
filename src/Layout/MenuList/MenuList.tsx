import _ from 'lodash';
import {
  AccountBookOutlined,
  AuditOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { Menu } from 'antd';
import SubMenu from 'antd/lib/menu/SubMenu';
import React, { ReactElement, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const MenuList = (): ReactElement => {
  const [seletedKey, setSelectedKey] = useState('');
  const location = useLocation().pathname;

  useEffect(() => {
    const key = _.split(location, '/')[1];
    setSelectedKey(key);
  }, [location]);

  return (
    <Menu
      selectedKeys={[seletedKey]}
      theme="dark"
      defaultSelectedKeys={['1']}
      mode="inline"
    >
      <SubMenu key="users" icon={<TeamOutlined />} title="用户管理">
        <Menu.Item key="clients">
          <Link to="/clients">货代用户</Link>
        </Menu.Item>
        <Menu.Item key="admins">
          <Link to="/admins">内部用户</Link>
        </Menu.Item>
      </SubMenu>
      <Menu.Item key="carriers" icon={<AccountBookOutlined />}>
        <Link to="/carriers">物流账号</Link>
      </Menu.Item>
      <Menu.Item key="audit" icon={<AuditOutlined />}>
        <Link to="/audit">操作记录</Link>
      </Menu.Item>
    </Menu>
  );
};

export default MenuList;
