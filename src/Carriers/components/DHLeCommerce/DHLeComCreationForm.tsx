import React, { ReactElement } from 'react';
import { Form, Input, Divider, Space, Button, Select } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import AddressFormItems from '../../../shared/components/AddressFormItems';
import { DHL_ECOMMERCE_DOMESTIC_SERVICES } from '../../../shared/utils/constants';

const { Option } = Select;

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
      <Form.Item
        label="账号名称"
        name="accountName"
        rules={[
          { required: true, message: '请填写账号名称' },
          { min: 3, message: '账号名称至少3位' }
        ]}
      >
        <Input placeholder="账号名称" disabled={disabled} />
      </Form.Item>
      <Form.Item label="账号说明" name="description">
        <Input placeholder="账号说明" disabled={disabled} />
      </Form.Item>
      {!isUpdate && (
        <Form.Item
          label="Client ID"
          name="clientId"
          rules={[
            { required: !isUpdate, message: 'Client ID 必须填写' },
            { min: 3, message: 'Client ID至少3位' }
          ]}
        >
          <Input placeholder="Client ID" disabled={isUpdate} />
        </Form.Item>
      )}
      {!isUpdate && (
        <Form.Item
          label="Client Secret"
          name="clientSecret"
          rules={[
            { required: !isUpdate, message: 'Client Secret 必须填写' },
            { min: 3, message: 'Client Secret至少3位' }
          ]}
        >
          <Input.Password placeholder="Client Secret" />
        </Form.Item>
      )}
      <Form.Item
        label="Services"
        name="services"
        rules={[{ required: true, message: '至少要有一个Service' }]}
      >
        <Select
          mode="multiple"
          optionLabelProp="label"
          disabled={disabled}
          allowClear
        >
          {DHL_ECOMMERCE_DOMESTIC_SERVICES.map((service, index) => {
            return (
              <Option key={service.key} value={index} label={service.key}>
                {`${service.key} - ${service.name}`}
              </Option>
            );
          })}
        </Select>
      </Form.Item>
      <Space>
        <Form.Item
          name="pickup-main"
          rules={[{ required: true, message: 'Pickup Code 必须填写' }]}
        >
          <Input placeholder="Pickup Code" disabled={disabled} />
        </Form.Item>
        <Form.Item
          name="facility-main"
          rules={[{ required: true, message: 'Facility Code 必须填写' }]}
        >
          <Input placeholder="Facility Code" disabled={disabled} />
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
                  name={[field.name, 'facility']}
                  rules={[
                    { required: true, message: 'Facility Code 必须填写' }
                  ]}
                >
                  <Input placeholder="Facility Code" disabled={disabled} />
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
