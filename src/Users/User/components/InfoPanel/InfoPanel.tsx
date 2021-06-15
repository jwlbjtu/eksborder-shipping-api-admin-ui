import React, { ReactElement, useState } from 'react';
import { Form, Avatar, Upload, Button, Input, message, Space } from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import PhoneNumberFormItems from '../../../../shared/components/PhoneNumberItems';
import './InfoPanel.css';
import { UpdateUserSelf, User, UserData } from '../../../../shared/types/user';
import { DEFAULT_SERVER_HOST } from '../../../../shared/utils/constants';
import {
  selectCurUser,
  selectUserLoading,
  updateCurUser
} from '../../../../redux/user/userSlice';

interface InfoPanelProps {
  data: User | UserData;
  onSubmit: (id: string, values: UpdateUserSelf) => void;
}

const InfoPanel = ({ data, onSubmit }: InfoPanelProps): ReactElement => {
  const dispatch = useDispatch();
  const curUser = useSelector(selectCurUser);
  const loading = useSelector(selectUserLoading);
  const [uploading, setUploading] = useState(false);
  const [imageLink, setImageLink] = useState(data.logoImage);

  const infoFormSubmitHandler = (values: any) => {
    const updateData: UpdateUserSelf = {
      companyName: data?.companyName || '',
      userName: values.userName,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      countryCode: values.countryCode,
      phone: values.phone
    };
    onSubmit(data.id, updateData);
  };

  const uploadHandler = (info: any) => {
    if (info.file.status !== 'uploading') {
      setUploading(true);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      setImageLink(info.file.response.link);
      if (curUser && data.id === curUser.id) {
        const newUserData: UserData = {
          ...curUser,
          logoImage: info.file.response.link
        };
        dispatch(updateCurUser(newUserData));
      }
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
          headers={{
            Authorization: `${curUser?.token_type} ${curUser?.token}`
          }}
          onChange={uploadHandler}
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />} loading={uploading}>
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
          <Input placeholder="用户名" />
        </Form.Item>
        <Space size="large" align="baseline" style={{ width: '100%' }}>
          <Form.Item
            style={{ width: '212px' }}
            label="姓"
            name="lastName"
            rules={[{ required: true, message: '姓必须填！' }]}
          >
            <Input placeholder="姓" />
          </Form.Item>
          <Form.Item
            style={{ width: '212px' }}
            label="名"
            name="firstName"
            rules={[{ required: true, message: '名必须填！' }]}
          >
            <Input placeholder="名" />
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
          <Input placeholder="邮箱" />
        </Form.Item>
        <PhoneNumberFormItems disabled={false} />
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            更新基本信息
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default InfoPanel;
