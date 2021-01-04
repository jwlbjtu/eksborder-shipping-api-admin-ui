import React, { ReactElement, useState } from 'react';
import { Modal, Form, Input, Space, Checkbox } from 'antd';
import PasswordFormItems from '../../../shared/components/PasswordFormItems';
import PhoneFormItems from '../../../shared/components/PhoneNumberItems';
import { CreateUserData } from '../../../shared/types/user';
import { USER_ROLES } from '../../../shared/utils/constants';

interface CreateAdminFormProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: CreateUserData) => void;
}

const CreateAdminForm = ({
  visible,
  onCancel,
  onOk
}: CreateAdminFormProps): ReactElement => {
  const [form] = Form.useForm();
  const [superAdmin, setSuperAdmin] = useState(false);

  const cancelClickedHandler = () => {
    form.resetFields();
    setSuperAdmin(false);
    onCancel();
  };

  const okClickedHandler = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        const role = superAdmin ? USER_ROLES.ADMIN_SUPER : USER_ROLES.ADMIN;
        const result: CreateUserData = {
          companyName: 'Eksborder Inc',
          userName: values.userName,
          password: values['new-password'],
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          countryCode: values.countryCode,
          phone: values.phone,
          role,
          isActive: true
        };
        onOk(result);
        setSuperAdmin(false);
      })
      .catch(() => {});
  };

  return (
    <Modal
      width={600}
      bodyStyle={{
        minHeight: '300px',
        maxHeight: '1000px',
        overflowY: 'auto',
        margin: '10px 50px'
      }}
      centered
      closable={false}
      visible={visible}
      okText="创建账号"
      cancelText="取消"
      title="创建管理员账号"
      onCancel={cancelClickedHandler}
      onOk={okClickedHandler}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="用户名"
          name="userName"
          rules={[{ required: true, message: '用户名必须填！' }]}
        >
          <Input placeholder="用户名" />
        </Form.Item>
        <PasswordFormItems label="密码" showDescription />
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
            { required: true, message: '邮箱必须填!' }
          ]}
        >
          <Input placeholder="邮箱" />
        </Form.Item>
        <PhoneFormItems disabled={false} />
      </Form>
      <Form.Item name="superAdmin">
        <Checkbox
          defaultChecked={false}
          checked={superAdmin}
          onChange={() => setSuperAdmin(!superAdmin)}
        >
          给予超管(Super Admin)权限
        </Checkbox>
      </Form.Item>
    </Modal>
  );
};

export default CreateAdminForm;
