import { Layout } from 'antd';
import React, { useState } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import logoSquare from './assets/images/logo-square.png';

import MenuList from './Layout/MenuList';
import Header from './Layout/Header';
import Welcome from './Welcome';
import ClientUsers from './Users/ClientUsers/pages/ClientUsers';
import AdminUsers from './Users/AdminUsers/pages/AdminUsers';
import Carrier from './Carriers/pages/Carriers';
import AuditTrail from './AuditTrail/pages/AuditTrail';

const { Sider, Content, Footer } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const collapseHandler = () => setCollapsed(!collapsed);

  return (
    <BrowserRouter>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={collapseHandler}>
          <div className="logo-container">
            <img className="logo" src={logoSquare} alt="EksShipping" />
            {!collapsed && (
              <h1 style={{ color: 'white' }} className="logo-text">
                EksShipping
              </h1>
            )}
          </div>
          <MenuList />
        </Sider>
        <Layout className="site-layout">
          <Header />
          <Content style={{ margin: '0 16px' }}>
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: 360 }}
            >
              <Switch>
                <Route path="/" component={Welcome} exact />
                <Route path="/clients" component={ClientUsers} />
                <Route path="/admins" component={AdminUsers} />
                <Route path="/carriers" component={Carrier} />
                <Route path="/audit" component={AuditTrail} />
                <Redirect to="/" />
              </Switch>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            EksShipping Admin ©2020 Created by Eksborder
          </Footer>
        </Layout>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
