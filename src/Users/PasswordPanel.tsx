import React, { ReactElement } from 'react';
import { Form, Input, Divider, Button } from 'antd';
import PasswordFormItems from '../shared/components/PasswordFormItems';
import PasswordDescription from '../shared/components/PasswordDescription';
import { PasswordFormValue } from '../shared/types/user';

interface PasswordPanelProps {
  isSelf: boolean;
  onSumbit: (values: PasswordFormValue) => void;
}

const PasswordPanel = ({
  isSelf,
  onSumbit
}: PasswordPanelProps): ReactElement => {
  const [form] = Form.useForm();
  const passwordFormSubmitHandler = (values: PasswordFormValue) => {
    form.resetFields();
    onSumbit(values);
  };

  return (
    <Form
      form={form}
      className="form-body"
      onFinish={passwordFormSubmitHandler}
    >
      {isSelf && (
        <>
          {' '}
          <Form.Item
            name="password"
            label="账号密码"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Divider />{' '}
        </>
      )}
      <PasswordFormItems label="新的密码" showDescription={false} />
      <Form.Item name="description" label="密码要求">
        <PasswordDescription />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          修改密码
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PasswordPanel;
