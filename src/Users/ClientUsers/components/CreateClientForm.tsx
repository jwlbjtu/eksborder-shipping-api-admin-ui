import React, { ReactElement } from 'react';
import { Modal, Form, Input, Space } from 'antd';
import PasswordFormItems from '../../../shared/components/PasswordFormItems';
import PhoneFormItems from '../../../shared/components/PhoneNumberItems';

interface CreateClientFormProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: any) => void;
}

const CreateClientForm = ({
  visible,
  onCancel,
  onOk
}: CreateClientFormProps): ReactElement => {
  const [form] = Form.useForm();

  const cancelClickedHandler = () => {
    form.resetFields();
    onCancel();
  };

  const okClickedHandler = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        const result = { ...values };
        onOk(result);
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
      title="创建货代用户账号"
      onCancel={cancelClickedHandler}
      onOk={okClickedHandler}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: '用户名必须填！' }]}
        >
          <Input placeholder="用户名" />
        </Form.Item>
        <PasswordFormItems label="密码" showDescription />
        <Form.Item label="公司名称" name="company">
          <Input placeholder="公司名称" />
        </Form.Item>
        <Space size="large" align="baseline" style={{ width: '100%' }}>
          <Form.Item
            style={{ width: '212px' }}
            label="姓"
            name="lastname"
            rules={[{ required: true, message: '姓必须填！' }]}
          >
            <Input placeholder="姓" />
          </Form.Item>
          <Form.Item
            style={{ width: '212px' }}
            label="名"
            name="firstname"
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
    </Modal>
  );
};

export default CreateClientForm;
