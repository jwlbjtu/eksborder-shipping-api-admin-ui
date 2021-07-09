import React, { ReactElement } from 'react';
import { Form, Input, Tooltip, Space } from 'antd';
import validateLib from 'validator';
import { QuestionCircleOutlined } from '@ant-design/icons';
import PasswordDescription from './PasswordDescription';

interface PasswordFormItemsProp {
  label: string;
  showDescription: boolean;
}

const PasswordFormItems = ({
  label,
  showDescription
}: PasswordFormItemsProp): ReactElement => {
  return (
    <>
      <Form.Item
        name="new-password"
        label={
          <Space size="small">
            {label}
            {showDescription && (
              <Tooltip placement="topLeft" title={PasswordDescription}>
                <QuestionCircleOutlined />
              </Tooltip>
            )}
          </Space>
        }
        rules={[
          { required: true, message: '请输入密码!' },
          () => ({
            validator(rule, value) {
              if (!value || validateLib.isStrongPassword(value)) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('密码不符合要求！'));
            }
          })
        ]}
        hasFeedback
      >
        <Input.Password placeholder={label} />
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
        <Input.Password placeholder="确认密码" />
      </Form.Item>
    </>
  );
};

export default PasswordFormItems;
