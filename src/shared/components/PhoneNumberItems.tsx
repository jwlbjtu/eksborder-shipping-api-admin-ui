import React, { ReactElement, useState } from 'react';
import { Form, Select, Input } from 'antd';
import validateLib from 'validator';

const { Option } = Select;

const PhoneNumberItems = ({
  disabled
}: {
  disabled: boolean;
}): ReactElement => {
  const [phoneLocale, setPhoneLocale] = useState<'en-US' | 'zh-CN'>('en-US');

  const prefixSelector = (
    <Form.Item
      name="countryCode"
      rules={[{ required: true, message: '请输选择国家区号!' }]}
      noStyle
    >
      <Select
        disabled={disabled}
        style={{ width: 70 }}
        onSelect={(value) => {
          setPhoneLocale('en-US');
          if (value === '86') setPhoneLocale('zh-CN');
        }}
      >
        <Option value="1">+1</Option>
        <Option value="86">+86</Option>
      </Select>
    </Form.Item>
  );

  return (
    <Form.Item
      name="phone"
      label="手机"
      rules={[
        { required: true, message: '请输入您的手机号码!' },
        () => ({
          validator(rule, value) {
            if (!value || validateLib.isMobilePhone(value, [phoneLocale])) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('手机号码格式错误！'));
          }
        })
      ]}
    >
      <Input
        placeholder="手机号码"
        addonBefore={prefixSelector}
        style={{ width: '100%' }}
        disabled={disabled}
      />
    </Form.Item>
  );
};

export default PhoneNumberItems;
