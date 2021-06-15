import React, { ReactElement } from 'react';
import { Modal, Form, Input, Space, InputNumber } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import PasswordFormItems from '../../../shared/components/PasswordFormItems';
import PhoneFormItems from '../../../shared/components/PhoneNumberItems';
import { USER_ROLES } from '../../../shared/utils/constants';
import { CreateUserData } from '../../../shared/types/user';
import {
  createUserHandler,
  selectShowCreateClient,
  setShowCreateClient
} from '../../../redux/user/userDataSlice';

const CreateClientForm = (): ReactElement => {
  const dispatch = useDispatch();
  const showModal = useSelector(selectShowCreateClient);
  const [form] = Form.useForm();

  const cancelClickedHandler = () => {
    form.resetFields();
    dispatch(setShowCreateClient(false));
  };

  const okClickedHandler = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        const role = USER_ROLES.API_USER;
        const result: CreateUserData = {
          companyName: values.companyName,
          userName: values.userName,
          password: values['new-password'],
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          countryCode: values.countryCode,
          phone: values.phone,
          minBalance: values.minBalance,
          role,
          isActive: true
        };
        dispatch(createUserHandler(result));
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
      visible={showModal}
      okText="创建账号"
      cancelText="取消"
      title="创建货代用户账号"
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
        <Form.Item label="公司名称" name="companyName">
          <Input placeholder="公司名称" />
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
            { required: true, message: '邮箱必须填!' }
          ]}
        >
          <Input placeholder="邮箱" />
        </Form.Item>
        <PhoneFormItems disabled={false} />
        <Form.Item
          label="最低额度"
          name="minBalance"
          rules={[{ required: true, message: '最低额度必须填！' }]}
        >
          <InputNumber<number>
            style={{ width: 'auto' }}
            min={0}
            formatter={(value) =>
              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            parser={(value) =>
              value ? parseFloat(value.replace(/\$\s?|(,*)/g, '')) : 0
            }
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateClientForm;
