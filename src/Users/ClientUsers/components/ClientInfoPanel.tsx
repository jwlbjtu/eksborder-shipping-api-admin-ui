import React, { ReactElement, useState } from 'react';
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
import { User, UpdateClientData } from '../../../shared/types/user';
import { DEFAULT_SERVER_HOST } from '../../../shared/utils/constants';

interface InfoPanelProps {
  data: User;
  onUpload: (imageUrl: string) => void;
  onSubmit: (data: UpdateClientData) => void;
}

const ClientInfoPanel = ({
  data,
  onUpload,
  onSubmit
}: InfoPanelProps): ReactElement => {
  const [active, setActive] = useState(data.isActive);
  const [uploading, setUploading] = useState(false);
  const [imageLink, setImageLink] = useState(data.logoImage);

  const infoFormSubmitHandler = (values: any) => {
    const updateData: UpdateClientData = {
      companyName: values.companyName,
      userName: values.userName,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      countryCode: values.countryCode,
      phone: values.phone,
      isActive: active
    };
    onSubmit(updateData);
  };

  const uploadHandler = (info: any) => {
    if (info.file.status === 'uploading') {
      setUploading(true);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      setImageLink(info.file.response.link);
      onUpload(info.file.response.link);
      setUploading(false);
    } else if (info.file.status === 'error') {
      setUploading(false);
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  return (
    <div>
      <div className="profile-avatar">
        <Avatar
          size={144}
          src={imageLink && `${DEFAULT_SERVER_HOST}/${imageLink}`}
          icon={<UserOutlined />}
          style={{ marginBottom: '12px' }}
        />
        <Upload
          name="image"
          accept=".jpg,.png,.jpeg"
          action={`${DEFAULT_SERVER_HOST}/users/logo/${data.id}`}
          // headers={{ authorization: 'authorization-text' }}
          onChange={uploadHandler}
          showUploadList={false}
        >
          <Button
            icon={<UploadOutlined />}
            loading={uploading}
            disabled={!active}
          >
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
          name="userName"
          rules={[{ required: true, message: '用户名必须填！' }]}
        >
          <Input placeholder="姓" disabled={!active} />
        </Form.Item>
        <Form.Item label="公司名称" name="companyName">
          <Input placeholder="公司名称" disabled={!active} />
        </Form.Item>
        <Space size="large" align="baseline" style={{ width: '100%' }}>
          <Form.Item
            style={{ width: '212px' }}
            label="姓"
            name="lastName"
            rules={[{ required: true, message: '姓必须填！' }]}
          >
            <Input placeholder="姓" disabled={!active} />
          </Form.Item>
          <Form.Item
            style={{ width: '212px' }}
            label="名"
            name="firstName"
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
