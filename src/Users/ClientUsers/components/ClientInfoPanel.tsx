import React, { ReactElement, useEffect, useState } from 'react';
import {
  Form,
  Avatar,
  Upload,
  Button,
  Input,
  message,
  Space,
  Switch
} from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import PhoneNumberFormItems from '../../../shared/components/PhoneNumberItems';
import './ClientInfoPanel.css';

interface InfoPanelProps {
  data: any;
  onSubmit: (values: any) => void;
}

const ClientInfoPanel = ({ data, onSubmit }: InfoPanelProps): ReactElement => {
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (data) {
      setActive(data.active);
    }
  }, [data]);

  const infoFormSubmitHandler = (values: any) => {
    onSubmit({ ...values, active });
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

  return (
    <div>
      <div className="profile-avatar">
        <Avatar
          size={144}
          src={data && data.avatar}
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
          <Button icon={<UploadOutlined />} disabled={!active}>
            更换头像
          </Button>
        </Upload>
      </div>
      <Form
        layout="vertical"
        className="form-body"
        initialValues={data}
        onFinish={infoFormSubmitHandler}
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: '用户名必须填！' }]}
        >
          <Input placeholder="姓" disabled={!active} />
        </Form.Item>
        <Form.Item label="公司名称" name="company">
          <Input placeholder="公司名称" disabled={!active} />
        </Form.Item>
        <Space size="large" align="baseline" style={{ width: '100%' }}>
          <Form.Item
            style={{ width: '212px' }}
            label="姓"
            name="lastname"
            rules={[{ required: true, message: '姓必须填！' }]}
          >
            <Input placeholder="姓" disabled={!active} />
          </Form.Item>
          <Form.Item
            style={{ width: '212px' }}
            label="名"
            name="firstname"
            rules={[{ required: true, message: '名必须填！' }]}
          >
            <Input placeholder="名" disabled={!active} />
          </Form.Item>
        </Space>
        <Form.Item
          label="邮箱"
          name="email"
          rules={[
            { type: 'email', message: '邮箱格式不正确!' },
            { required: true, message: '请输入您的邮箱!' }
          ]}
        >
          <Input placeholder="邮箱" disabled={!active} />
        </Form.Item>
        <PhoneNumberFormItems disabled={!active} />
        <Form.Item name="active">
          <Switch
            checkedChildren="启用"
            unCheckedChildren="停用"
            defaultChecked
            checked={active}
            onClick={() => setActive(!active)}
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

export default ClientInfoPanel;
