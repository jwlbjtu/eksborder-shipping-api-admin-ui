import React, { ReactElement } from 'react';
import { Form, Collapse, Input, Select } from 'antd';

const { Option } = Select;
const { Panel } = Collapse;

const AddressFormItems = (): ReactElement => {
  return (
    <Collapse>
      <Panel key={1} header="Return Address">
        <Form.Item
          label="Company"
          name="company"
          rules={[{ required: true, message: 'Company 必须填写' }]}
        >
          <Input placeholder="Company" />
        </Form.Item>
        <Form.Item
          label="Street1"
          name="street1"
          rules={[{ required: true, message: 'Street1 必须填写' }]}
        >
          <Input placeholder="Street1" />
        </Form.Item>
        <Form.Item label="Street2" name="street2">
          <Input placeholder="Street2" />
        </Form.Item>
        <Form.Item
          label="City"
          name="city"
          rules={[{ required: true, message: 'City 必须填写' }]}
        >
          <Input placeholder="City Secret" />
        </Form.Item>
        <Form.Item
          label="State/Province"
          name="state"
          rules={[{ required: true, message: 'State/Province 必须填写' }]}
        >
          <Input placeholder="State/Province" />
        </Form.Item>
        <Form.Item
          label="State/Province"
          name="state"
          rules={[{ required: true, message: 'State/Province 必须填写' }]}
        >
          <Input placeholder="State/Province" />
        </Form.Item>
        <Form.Item
          label="Zip/Postal Code"
          name="postalCode"
          rules={[{ required: true, message: 'Zip/Postal Code 必须填写' }]}
        >
          <Input placeholder="Zip/Postal Code" />
        </Form.Item>
        <Form.Item
          label="Country"
          name="country"
          rules={[{ required: true, message: 'Country 必须填写' }]}
        >
          <Select>
            <Option value="US">US</Option>
          </Select>
        </Form.Item>
      </Panel>
    </Collapse>
  );
};

export default AddressFormItems;
