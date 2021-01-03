import React, { ReactElement, useContext, useState } from 'react';
import { Alert, Button, Form, Input, message } from 'antd';
import { Link } from 'react-router-dom';
import { LockTwoTone, UserOutlined } from '@ant-design/icons';
import { Footer } from 'antd/lib/layout/layout';
import logo from '../assets/images/logo-dark.png';

import AuthContext from '../shared/components/context/auth-context';
import axios from '../shared/utils/axios-base';

import './Login.css';
import { SERVER_ROUTES } from '../shared/utils/constants';

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
  const auth = useContext(AuthContext);
  const [submiting, setSubmitting] = useState(false);
  const [userLoginState, setUserLoginState] = useState('ok');

  const loginHandler = async (values: { email: string; password: string }) => {
    setSubmitting(true);
    setUserLoginState('ok');
    try {
      // 登录
      const response = await axios.post(`${SERVER_ROUTES.USERS}/login`, {
        user: values
      });
      message.success('登录成功！');
      auth.login(response.data);
    } catch (error) {
      message.error('登录失败，请重试！');
      // 如果失败去设置用户错误信息
      setUserLoginState('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="content">
        <div className="top">
          <div className="header">
            <Link to="/">
              <img alt="logo" className="loginLogo" src={logo} />
            </Link>
          </div>
        </div>
        <div className="main">
          <Form onFinish={loginHandler}>
            {userLoginState === 'error' && (
              <LoginMessage content="邮箱或密码错误" />
            )}
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
                loading={submiting}
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      <Footer style={{ textAlign: 'center' }}>
        EksShipping Admin ©2020 Created by Eksborder
      </Footer>
    </div>
  );
};

export default Login;
