import React, { ReactElement, useEffect } from 'react';
import { Form, Input, Divider, Space, Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import AddressFormItems from '../../../shared/components/AddressFormItems';

interface FormProps {
  data: Record<string, unknown>;
}

const DHLeComCreationForm = ({ data }: FormProps): ReactElement => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(data);
  }, [form, data]);

  return (
    <Form layout="vertical" form={form}>
      <Form.Item label="账号名称" name="name">
        <Input placeholder="账号名称" />
      </Form.Item>
      <Form.Item
        label="Client ID"
        name="clientId"
        rules={[{ required: true, message: 'Client ID 必须填写' }]}
      >
        <Input placeholder="Client ID" />
      </Form.Item>
      <Form.Item
        label="Client Secret"
        name="clientSecret"
        rules={[{ required: true, message: 'Client Secret 必须填写' }]}
      >
        <Input placeholder="Client Secret" />
      </Form.Item>
      <Space>
        <Form.Item
          name="pickup-main"
          rules={[{ required: true, message: 'Pickup Code 必须填写' }]}
        >
          <Input placeholder="Pickup Code" />
        </Form.Item>
        <Form.Item
          name="destribution-main"
          rules={[{ required: true, message: 'Destribution Code 必须填写' }]}
        >
          <Input placeholder="Destribution Code" />
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
                  <Input placeholder="Pickup Code" />
                </Form.Item>
                <Form.Item
                  name={[field.name, 'destribution']}
                  rules={[
                    { required: true, message: 'Desctribution Code 必须填写' }
                  ]}
                >
                  <Input placeholder="Destribution Code" />
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
              >
                Add Pickup Information
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <Divider />
      <AddressFormItems />
    </Form>
  );
};

export default DHLeComCreationForm;
