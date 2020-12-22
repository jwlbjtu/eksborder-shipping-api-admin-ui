import React, { ReactElement } from 'react';
import { Form, Avatar, Upload, Button, Input, message, Select } from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import './InfoPanel.css';

const { Option } = Select;

interface InfoFormValue {
  name: string;
  email: string;
  prefix: string;
  phone: string;
}

const InfoPanel = ({ data }: { data: InfoFormValue }): ReactElement => {
  const infoFormSubmitHandler = (values: InfoFormValue) => {
    console.log(values);
  };

  const uploadHandler = (info: any) => {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="1">+1</Option>
        <Option value="86">+86</Option>
      </Select>
    </Form.Item>
  );

  return (
    <div>
      <div className="profile-avatar">
        <Avatar
          size={144}
          icon={<UserOutlined />}
          style={{ marginBottom: '12px' }}
        />
        <Upload
          name="avarta"
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          headers={{ authorization: 'authorization-text' }}
          onChange={uploadHandler}
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />}>更换头像</Button>
        </Upload>
      </div>
      <Form
        className="form-body"
        initialValues={data}
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
};

export default InfoPanel;
