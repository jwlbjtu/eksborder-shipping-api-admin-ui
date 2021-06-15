import React, { ReactElement, useEffect } from 'react';
import { Alert, Button, Form, Input } from 'antd';
import { Link } from 'react-router-dom';
import { LockTwoTone, UserOutlined } from '@ant-design/icons';
import { Footer } from 'antd/lib/layout/layout';
import { useDispatch, useSelector } from 'react-redux';
import logo from '../assets/images/logo.png';

import './Login.css';
import {
  loginUserHandler,
  selectLoginerror,
  selectLoginLoading,
  setLoginError
} from '../redux/user/userSlice';

const LoginMessage: React.FC<{ content: string }> = ({
  content
}: {
  content: string;
}) => (
  <Alert
    style={{
      marginBottom: 24
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login = (): ReactElement => {
  const dispatch = useDispatch();
  const loginLoading = useSelector(selectLoginLoading);
  const loginError = useSelector(selectLoginerror);

  useEffect(() => {
    dispatch(setLoginError(false));
  }, [dispatch]);

  return (
    <div className="container">
      <div className="content">
        <div className="top">
          <div className="header">
            <Link to="/">
              <img alt="logo" className="loginLogo" src={logo} />
            </Link>
          </div>
          <div className="desc">ParcelsElite 货代物流平台管理网站</div>
        </div>
        <div className="main">
          <Form onFinish={(values) => dispatch(loginUserHandler(values))}>
            {loginError && <LoginMessage content="邮箱或密码错误" />}
            <Form.Item
              name="email"
              rules={[
                { type: 'email', message: '邮箱格式不正确' },
                { required: true, message: '请输入邮箱' }
              ]}
            >
              <Input
                size="large"
                prefix={<UserOutlined className="prefixIcon" />}
                placeholder="请输入登录邮箱"
                allowClear
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password
                size="large"
                prefix={<LockTwoTone className="prefixIcon" />}
                placeholder="请输入密码"
              />
            </Form.Item>
            <Form.Item>
              <Link to="/">忘记密码?</Link>
            </Form.Item>
            <Form.Item>
              <Button
                htmlType="submit"
                style={{ width: '100%' }}
                type="primary"
                size="large"
                loading={loginLoading}
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      <Footer style={{ textAlign: 'center' }}>
        ParcelsElite Admin ©{new Date().getFullYear()} Created by Eksborder Inc
      </Footer>
    </div>
  );
};

export default Login;
