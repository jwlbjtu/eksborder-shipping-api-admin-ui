import { Layout } from 'antd';
import React, { ReactElement, useContext, useState } from 'react';
import { BrowserRouter, Redirect, Route, Switch, Link } from 'react-router-dom';
import './App.css';
import logoSquare from './assets/images/logo-square.png';

import MenuList from './Layout/MenuList/MenuList';
import Header from './Layout/Header/HeaderComponent';
import Welcome from './Welcome';
import ClientUsers from './Users/ClientUsers/pages/ClientUsers';
import AdminUsers from './Users/AdminUsers/pages/AdminUsers';
import Carrier from './Carriers/pages/Carriers';
import AuditTrail from './AuditTrail/pages/AuditTrail';
import UserProfile from './Users/User/pages/UserProfile';
import AdminProfile from './Users/AdminUsers/pages/AdminProfile';
import ClientManagePage from './Users/ClientUsers/pages/ClientManagePage';
import Login from './Users/Login';

import AuthContext from './shared/components/context/auth-context';

const { Sider, Content, Footer } = Layout;

const App: React.FC = (): ReactElement => {
  const auth = useContext(AuthContext);
  const [collapsed, setCollapsed] = useState(false);
  const collapseHandler = () => setCollapsed(!collapsed);
  const [isLoggedIn, setIsLoggedIn] = useState(auth.isLoggedIn);

  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  let page = null;
  if (isLoggedIn) {
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
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {page}
    </AuthContext.Provider>
  );
};

export default App;
