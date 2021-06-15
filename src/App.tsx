import { Layout, Spin } from 'antd';
import React, { ReactElement, useState, Suspense } from 'react';
import { Redirect, Route, Switch, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './App.css';

import logoSquare from './assets/images/logo.png';

import MenuList from './Layout/MenuList/MenuList';
import Header from './Layout/Header/HeaderComponent';
import Welcome from './Welcome';
import Login from './Users/Login';

import { selectCurUser } from './redux/user/userSlice';

const ClientUsers = React.lazy(
  () => import('./Users/ClientUsers/pages/ClientUsers')
);
const AdminUsers = React.lazy(
  () => import('./Users/AdminUsers/pages/AdminUsers')
);
const Carrier = React.lazy(() => import('./Carriers/pages/Carriers'));
const EditCarrierPage = React.lazy(
  () => import('./Carriers/pages/EditCarrierPage')
);
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
  const [logoText, setLogoText] = useState<string | undefined>('ParcelsElite');
  const curUser = useSelector(selectCurUser);

  const togglerLogoText = () => {
    const text = logoText ? undefined : 'ParcelsElite';
    setLogoText(text);
  };

  return (
    <>
      {curUser ? (
        <Layout style={{ minHeight: '100vh' }}>
          <Sider collapsible breakpoint="xl" onCollapse={togglerLogoText}>
            <div>
              <Link to="/" className="logo-container">
                <img className="logo" src={logoSquare} alt="EksShipping" />
                {logoText && (
                  <h1 style={{ color: 'white' }} className="logo-text">
                    {logoText}
                  </h1>
                )}
              </Link>
            </div>
            <MenuList />
          </Sider>
          <Layout className="site-layout">
            <Header />
            <Suspense fallback={<Spin />}>
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
                    <Route
                      path="/carriers/:carrierId"
                      component={EditCarrierPage}
                    />
                    <Route path="/carriers" component={Carrier} />
                    <Route path="/audit" component={AuditTrail} />
                    <Route path="/user/profile" component={UserProfile} />
                    <Redirect to="/" />
                  </Switch>
                </div>
              </Content>
            </Suspense>
            <Footer style={{ textAlign: 'center' }}>
              ParcelsElite Admin ©{new Date().getFullYear()} Created by
              Eksborder Inc
            </Footer>
          </Layout>
        </Layout>
      ) : (
        <Switch>
          <Route path="/" component={Login} exact />
          <Redirect to="/" />
        </Switch>
      )}
    </>
  );
};

export default App;
