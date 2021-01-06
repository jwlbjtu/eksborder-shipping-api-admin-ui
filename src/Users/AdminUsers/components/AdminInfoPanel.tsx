import React, { ReactElement, useContext, useState } from 'react';
import {
  Form,
  Avatar,
  Upload,
  Button,
  Input,
  message,
  Space,
  Checkbox,
  Switch
} from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import PhoneNumberFormItems from '../../../shared/components/PhoneNumberItems';
import './AdminInfoPanel.css';
import { UpdateUserData, User } from '../../../shared/types/user';
import {
  DEFAULT_SERVER_HOST,
  USER_ROLES
} from '../../../shared/utils/constants';
import AuthContext from '../../../shared/components/context/auth-context';

interface InfoPanelProps {
  data: User | null;
  onSubmit: (updateData: UpdateUserData) => void;
}

const AdminInfoPanel = ({ data, onSubmit }: InfoPanelProps): ReactElement => {
  const auth = useContext(AuthContext);
  const [superAdmin, setSuperAdmin] = useState(
    data ? data.role === USER_ROLES.ADMIN_SUPER : false
  );
  const [active, setActive] = useState(data ? data.isActive : false);
  const [uploading, setUploading] = useState(false);
  const [imageLink, setImageLink] = useState(data && data.logoImage);

  const infoFormSubmitHandler = (values: any) => {
    const updateData: UpdateUserData = {
      companyName: data?.companyName || '',
      userName: values.userName,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      countryCode: values.countryCode,
      phone: values.phone,
      minBalance: data?.minBalance || 0,
      role: superAdmin ? USER_ROLES.ADMIN_SUPER : USER_ROLES.ADMIN,
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
          action={`${DEFAULT_SERVER_HOST}/users/logo/${data && data.id}`}
          headers={{
            Authorization: `${auth.userData?.token_type} ${auth.userData?.token}`
          }}
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
        initialValues={data || undefined}
        onFinish={infoFormSubmitHandler}
      >
        <Form.Item
          label="用户名"
          name="userName"
          rules={[{ required: true, message: '用户名必须填！' }]}
        >
          <Input placeholder="用户名" disabled={!active} />
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
        <Space size="large" align="baseline" style={{ width: '100%' }}>
          <Form.Item name="superAdmin">
            <Checkbox
              disabled={!active}
              defaultChecked={false}
              checked={superAdmin}
              onChange={() => setSuperAdmin(!superAdmin)}
            >
              给予超管(Super Admin)权限
            </Checkbox>
          </Form.Item>
          <Form.Item name="active">
            <Switch
              style={{ marginLeft: '165px' }}
              checkedChildren="启用"
              unCheckedChildren="停用"
              defaultChecked
              checked={active}
              onClick={() => setActive(!active)}
            />
          </Form.Item>
        </Space>
        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={!data}>
            更新基本信息
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AdminInfoPanel;
