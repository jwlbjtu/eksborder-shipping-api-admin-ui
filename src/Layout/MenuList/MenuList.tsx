import _ from 'lodash';
import {
  AccountBookOutlined,
  MoneyCollectOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { Menu } from 'antd';
import SubMenu from 'antd/lib/menu/SubMenu';
import React, { ReactElement, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurUser } from '../../redux/user/userSlice';
import { USER_ROLES } from '../../shared/utils/constants';

const MenuList = (): ReactElement => {
  const [seletedKey, setSelectedKey] = useState('');
  const location = useLocation().pathname;
  const curUser = useSelector(selectCurUser);

  useEffect(() => {
    const key = _.split(location, '/')[1];
    setSelectedKey(key);
  }, [location]);

  return (
    <Menu selectedKeys={[seletedKey]} theme="dark" mode="inline">
      <SubMenu key="users" icon={<TeamOutlined />} title="用户管理">
        <Menu.Item key="clients">
          <Link to="/clients">货代用户</Link>
        </Menu.Item>
        {curUser!.role === USER_ROLES.ADMIN_SUPER && (
          <Menu.Item key="admins">
            <Link to="/admins">内部用户</Link>
          </Menu.Item>
        )}
      </SubMenu>
      {curUser!.role === USER_ROLES.ADMIN_SUPER && (
        <>
          <Menu.Item key="carriers" icon={<AccountBookOutlined />}>
            <Link to="/carriers">物流账号</Link>
          </Menu.Item>
          <Menu.Item key="accounting" icon={<MoneyCollectOutlined />}>
            <Link to="/accounting">财务对账</Link>
          </Menu.Item>
        </>
      )}
    </Menu>
  );
};

export default MenuList;
