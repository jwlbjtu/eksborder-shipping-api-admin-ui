import Layout, { Content, Footer } from 'antd/lib/layout/layout';
import React, { useState } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import './App.css';

import Sider from './Layout/Sider';
import Header from './Layout/Header';
import Welcome from './Welcome';
import ClientUsers from './Users/ClientUsers/pages/ClientUsers';
import AdminUsers from './Users/AdminUsers/pages/AdminUsers';
import Carrier from './Carriers/pages/Carriers';
import AuditTrail from './AuditTrail/pages/AuditTrail';

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const collapseHandler = () => setCollapsed(!collapsed);

  return (
    <BrowserRouter>
      <Layout hasSider style={{ minHeight: '100vh' }}>
        <Sider collapsed={collapsed} collapseHandler={collapseHandler} />
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
