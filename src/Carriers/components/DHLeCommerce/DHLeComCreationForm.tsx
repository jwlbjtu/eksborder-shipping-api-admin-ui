import React, { ReactElement } from 'react';
import { Form, Input, Divider, Space, Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import AddressFormItems from '../../../shared/components/AddressFormItems';

interface FormProps {
  form: any;
  disabled: boolean;
  isUpdate: boolean;
}

const DHLeComCreationForm = ({
  form,
  disabled,
  isUpdate
}: FormProps): ReactElement => {
  return (
    <Form layout="vertical" form={form}>
      <Form.Item label="账号名称" name="name">
        <Input placeholder="账号名称" disabled={disabled} />
      </Form.Item>
      <Form.Item label="账号说明" name="description">
        <Input placeholder="账号说明" disabled={disabled} />
      </Form.Item>
      <Form.Item
        label="Client ID"
        name="clientId"
        rules={[{ required: !isUpdate, message: 'Client ID 必须填写' }]}
      >
        <Input placeholder="Client ID" disabled={isUpdate} />
      </Form.Item>
      <Form.Item
        label="Client Secret"
        name="clientSecret"
        rules={[{ required: !isUpdate, message: 'Client Secret 必须填写' }]}
      >
        <Input.Password placeholder="Client Secret" />
      </Form.Item>
      <Space>
        <Form.Item
          name="pickup-main"
          rules={[{ required: true, message: 'Pickup Code 必须填写' }]}
        >
          <Input placeholder="Pickup Code" disabled={disabled} />
        </Form.Item>
        <Form.Item
          name="destribution-main"
          rules={[{ required: true, message: 'Destribution Code 必须填写' }]}
        >
          <Input placeholder="Destribution Code" disabled={disabled} />
        </Form.Item>
      </Space>
      <Form.List name="locations">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              <Space
                key={field.key}
                style={{ display: 'flex', marginBottom: 8 }}
                align="baseline"
              >
                <Form.Item
                  name={[field.name, 'pickup']}
                  rules={[{ required: true, message: 'Pickup Code 必须填写' }]}
                >
                  <Input placeholder="Pickup Code" disabled={disabled} />
                </Form.Item>
                <Form.Item
                  name={[field.name, 'destribution']}
                  rules={[
                    { required: true, message: 'Desctribution Code 必须填写' }
                  ]}
                >
                  <Input placeholder="Destribution Code" disabled={disabled} />
                </Form.Item>
                <MinusCircleOutlined
                  onClick={() => {
                    remove(field.name);
                  }}
                />
              </Space>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
                disabled={disabled}
              >
                Add Pickup Information
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <Divider />
      <AddressFormItems disabled={disabled} />
    </Form>
  );
};

export default DHLeComCreationForm;
