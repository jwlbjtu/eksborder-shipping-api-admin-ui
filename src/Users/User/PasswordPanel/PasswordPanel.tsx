import validateLib from 'validator';
import React, { ReactElement } from 'react';
import { Form, Input, Divider, Button } from 'antd';

interface PasswordFormValue {
  password: string;
  'new-password': string;
}

const PasswordPanel = (): ReactElement => {
  const passwordFormSubmitHandler = (values: PasswordFormValue) => {
    console.log(values);
  };

  return (
    <Form className="form-body" onFinish={passwordFormSubmitHandler}>
      <Form.Item
        name="password"
        label="账号密码"
        rules={[{ required: true, message: '请输入密码!' }]}
      >
        <Input.Password />
      </Form.Item>
      <Divider />
      <Form.Item
        name="new-password"
        label="新的密码"
        rules={[
          { required: true, message: '请输入密码!' },
          () => ({
            validator(rule, value) {
              // @ts-expect-error: missing type of validator
              if (!value || validateLib.isStrongPassword(value)) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('密码不符合要求！'));
            }
          })
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        name="confirm-password"
        label="确认密码"
        dependencies={['new-password']}
        rules={[
          { required: true, message: '请输入密码!' },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              if (!value || getFieldValue('new-password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('您输入的密码不匹配!'));
            }
          })
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>
      <Form.Item name="description" label="密码要求">
        <div>
          <div>
            <ul>
              <li>8位字符以上</li>
              <li>大写字母、小写字母、数字</li>
              <li>{'特殊符号： -#!$%^&*()_+|~=`{}[]:";\'<>?,./'}</li>
            </ul>
          </div>
        </div>
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
