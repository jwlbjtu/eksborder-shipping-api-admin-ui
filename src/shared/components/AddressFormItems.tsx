import React, { ReactElement } from 'react';
import { Form, Collapse, Input, Select } from 'antd';

const { Option } = Select;
const { Panel } = Collapse;

const AddressFormItems = ({
  disabled
}: {
  disabled: boolean;
}): ReactElement => {
  return (
    <Collapse>
      <Panel key={1} header="Return Address" forceRender>
        <Form.Item
          label="Company"
          name="company"
          rules={[{ required: true, message: 'Company 必须填写' }]}
        >
          <Input placeholder="Company" disabled={disabled} />
        </Form.Item>
        <Form.Item
          label="Street1"
          name="street1"
          rules={[{ required: true, message: 'Street1 必须填写' }]}
        >
          <Input placeholder="Street1" disabled={disabled} />
        </Form.Item>
        <Form.Item label="Street2" name="street2">
          <Input placeholder="Street2" disabled={disabled} />
        </Form.Item>
        <Form.Item
          label="City"
          name="city"
          rules={[{ required: true, message: 'City 必须填写' }]}
        >
          <Input placeholder="City Secret" disabled={disabled} />
        </Form.Item>
        <Form.Item
          label="State/Province"
          name="state"
          rules={[{ required: true, message: 'State/Province 必须填写' }]}
        >
          <Input placeholder="State/Province" disabled={disabled} />
        </Form.Item>
        <Form.Item
          label="Zip/Postal Code"
          name="postalCode"
          rules={[{ required: true, message: 'Zip/Postal Code 必须填写' }]}
        >
          <Input placeholder="Zip/Postal Code" disabled={disabled} />
        </Form.Item>
        <Form.Item
          label="Country"
          name="country"
          rules={[{ required: true, message: 'Country 必须填写' }]}
        >
          <Select disabled={disabled}>
            <Option value="US">US</Option>
          </Select>
        </Form.Item>
      </Panel>
    </Collapse>
  );
};

export default AddressFormItems;
