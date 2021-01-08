import { Layout, Spin } from 'antd';
import React, { ReactElement, useState, Suspense } from 'react';
import { BrowserRouter, Redirect, Route, Switch, Link } from 'react-router-dom';
import useAuth from './shared/hooks/auth-hook';
import './App.css';

import logoSquare from './assets/images/logo-square.png';

import MenuList from './Layout/MenuList/MenuList';
import Header from './Layout/Header/HeaderComponent';
import Welcome from './Welcome';
import Login from './Users/Login';

import AuthContext from './shared/components/context/auth-context';

const ClientUsers = React.lazy(
  () => import('./Users/ClientUsers/pages/ClientUsers')
);
const AdminUsers = React.lazy(
  () => import('./Users/AdminUsers/pages/AdminUsers')
);
const Carrier = React.lazy(() => import('./Carriers/pages/Carriers'));
const AuditTrail = React.lazy(() => import('./AuditTrail/pages/AuditTrail'));
const UserProfile = React.lazy(() => import('./Users/User/pages/UserProfile'));
const AdminProfile = React.lazy(
  () => import('./Users/AdminUsers/pages/AdminProfile')
);
const ClientManagePage = React.lazy(
  () => import('./Users/ClientUsers/pages/ClientManagePage')
);

const { Sider, Content, Footer } = Layout;

const App: React.FC = (): ReactElement => {
  const { userData, setUserData, login, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const collapseHandler = () => setCollapsed(!collapsed);

  let page = null;
  if (userData) {
    page = (
      <BrowserRouter>
        <Layout style={{ minHeight: '100vh' }}>
          <Sider collapsible collapsed={collapsed} onCollapse={collapseHandler}>
            <div>
              <Link to="/" className="logo-container">
                <img className="logo" src={logoSquare} alt="EksShipping" />
                {!collapsed && (
                  <h1 style={{ color: 'white' }} className="logo-text">
                    EksShipping
                  </h1>
                )}
              </Link>
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
                  <Route path="/clients/:id" component={ClientManagePage} />
                  <Route path="/clients" component={ClientUsers} />
                  <Route path="/admins/:id" component={AdminProfile} />
                  <Route path="/admins" component={AdminUsers} />
                  <Route path="/carriers" component={Carrier} />
                  <Route path="/audit" component={AuditTrail} />
                  <Route path="/user/profile" component={UserProfile} />
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
  } else {
    page = (
      <BrowserRouter>
        <Switch>
          <Route path="/" component={Login} exact />
          <Redirect to="/" />
        </Switch>
      </BrowserRouter>
    );
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: !!userData, userData, setUserData, login, logout }}
    >
      <Suspense fallback={<Spin />}>{page}</Suspense>
    </AuthContext.Provider>
  );
};

export default App;
