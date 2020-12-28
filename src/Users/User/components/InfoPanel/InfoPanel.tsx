import React, { ReactElement } from 'react';
import { Form, Avatar, Upload, Button, Input, message } from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import PhoneNumberFormItems from '../../../../shared/components/PhoneNumberItems';
import './InfoPanel.css';

interface InfoFormValue {
  avatar: string;
  name: string;
  email: string;
  prefix: string;
  phone: string;
}

interface InfoPanelProps {
  data: InfoFormValue;
  onSubmit: (values: any) => void;
}

const InfoPanel = ({ data, onSubmit }: InfoPanelProps): ReactElement => {
  const infoFormSubmitHandler = (values: InfoFormValue) => {
    onSubmit(values);
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
        <PhoneNumberFormItems disabled={false} />
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
