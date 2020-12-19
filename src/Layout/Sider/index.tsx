import {
  AccountBookOutlined,
  AuditOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { Menu } from 'antd';
import Sider from 'antd/lib/layout/Sider';
import SubMenu from 'antd/lib/menu/SubMenu';
import React, { ReactElement } from 'react';
import logoSquare from '../../assets/images/logo-square.png';
import './index.css';

interface SiderComponentProps {
  collapsed: boolean;
  collapseHandler: () => void;
}

const SiderComponent = ({
  collapsed,
  collapseHandler
}: SiderComponentProps): ReactElement => {
  return (
    <Sider collapsible collapsed={collapsed} onCollapse={collapseHandler}>
      <div className="logo-container">
        <img className="logo" src={logoSquare} alt="EksShipping" />
        {!collapsed && (
          <h1 style={{ color: 'white' }} className="logo-text">
            EksShipping
          </h1>
        )}
      </div>

      <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
        <SubMenu key="sub1" icon={<TeamOutlined />} title="用户管理">
          <Menu.Item key="1">货代用户</Menu.Item>
          <Menu.Item key="2">内部用户</Menu.Item>
        </SubMenu>
        <Menu.Item key="4" icon={<AccountBookOutlined />}>
          物流账号
        </Menu.Item>
        <Menu.Item key="5" icon={<AuditOutlined />}>
          操作记录
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default SiderComponent;
