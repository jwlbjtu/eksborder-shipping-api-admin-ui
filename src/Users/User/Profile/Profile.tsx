import React, { ReactElement, useState } from 'react';
import {
  Layout,
  Menu,
  Form,
  Input,
  Select,
  Button,
  Divider,
  Avatar,
  Upload,
  message
} from 'antd';

import './Profile.css';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';

const { Sider, Header, Content } = Layout;
const { Option } = Select;

// TODO - backen conection
const USER_DATA = {
  name: 'Wenlong Jiang',
  email: 'wenlong.jiang@eksborder.com',
  phone: {
    countryCode: '1',
    number: '6173010512'
  }
};

interface InfoFormValue {
  name: string;
  email: string;
  prefix: number;
  phone: number;
}

interface PasswordFormValue {
  password: string;
  'new-password': string;
}

const Profile = (): ReactElement => {
  const [showInfo, setShowInfo] = useState(true);
  const [infoFormData, setInfoFormData] = useState({
    name: USER_DATA.name,
    email: USER_DATA.email,
    prefix: USER_DATA.phone.countryCode,
    phone: USER_DATA.phone.number
  });

  const menuClickedHandler = (showInfoFlag: boolean) => {
    setShowInfo(showInfoFlag);
  };

  const infoFormSubmitHandler = (values: InfoFormValue) => {
    console.log(values);
  };

  const passwordFormSubmitHandler = (values: PasswordFormValue) => {
    console.log(values);
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="1">+1</Option>
        <Option value="86">+86</Option>
      </Select>
    </Form.Item>
  );

  const infoPanel = (
    <div>
      <div
        style={{
          width: '100%',
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '448px',
          padding: '20px'
        }}
      >
        <Avatar
          size={144}
          icon={<UserOutlined />}
          style={{ marginBottom: '12px' }}
        />
        <Upload
          name="avarta"
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          headers={{ authorization: 'authorization-text' }}
          onChange={(info: any) => {
            if (info.file.status !== 'uploading') {
              console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
              message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
              message.error(`${info.file.name} file upload failed.`);
            }
          }}
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />}>更换头像</Button>
        </Upload>
      </div>
      <Form
        className="form-body"
        initialValues={infoFormData}
        onFinish={infoFormSubmitHandler}
      >
        <Form.Item
          label="姓名"
          name="name"
          rules={[{ required: true, message: '请输入您的姓名' }]}
        >
          <Input placeholder="姓名" />
        </Form.Item>
        <Form.Item
          label="邮箱"
          name="email"
          rules={[
            { type: 'email', message: '邮箱格式不正确!' },
            { required: true, message: '请输入您的邮箱!' }
          ]}
        >
          <Input placeholder="邮箱" />
        </Form.Item>
        <Form.Item
          name="phone"
          label="电话"
          rules={[{ required: true, message: '请输入您的电话!' }]}
        >
          <Input
            placeholder="电话号码"
            addonBefore={prefixSelector}
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            更新基本信息
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
  const passwordPanel = (
    <Form className="form-body" onFinish={passwordFormSubmitHandler}>
      <Form.Item
        name="password"
        label="账号密码"
        rules={[{ required: true, message: '请输入密码!' }]}
      >
        <Input.Password />
      </Form.Item>
      <Divider />
      <Form.Item
        name="new-password"
        label="新的密码"
        rules={[{ required: true, message: '请输入密码!' }]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        name="confirm-password"
        label="确认密码"
        rules={[
          { required: true, message: '请输入密码!' },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              if (!value || getFieldValue('new-password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('您输入的密码不匹配!'));
            }
          })
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          修改密码
        </Button>
      </Form.Item>
    </Form>
  );
  const showContent = showInfo ? infoPanel : passwordPanel;

  return (
    <Layout style={{ minHeight: 360 }}>
      <Sider theme="light">
        <Menu
          style={{ height: '100%' }}
          defaultSelectedKeys={['info']}
          mode="inline"
        >
          <Menu.Item key="info" onClick={() => menuClickedHandler(true)}>
            基本信息
          </Menu.Item>
          <Menu.Item key="security" onClick={() => menuClickedHandler(false)}>
            密码设置
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background profile-header">
          {showInfo ? '基本信息' : '密码设置'}
        </Header>
        <Content>
          <div
            className="site-layout-background"
            style={{ padding: '26px 50px', minHeight: 360 }}
          >
            {showContent}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Profile;
