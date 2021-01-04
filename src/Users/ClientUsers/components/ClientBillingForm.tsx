import React, { ReactElement } from 'react';
import { Modal, Form, Input, Row, Col, InputNumber, Radio } from 'antd';
import { CreateBillingData } from '../../../shared/types/billing';

interface CreateClientFormProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: CreateBillingData) => void;
}

const ClientBillingForm = ({
  visible,
  onCancel,
  onOk
}: CreateClientFormProps): ReactElement => {
  const [form] = Form.useForm();

  const cancelClickedHandler = () => {
    form.resetFields();
    onCancel();
  };

  const okClickedHandler = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        const result: CreateBillingData = {
          total: values.total,
          addFund: values.addFund === 2,
          description: values.description
        };
        onOk(result);
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
      visible={visible}
      okText="添加账单"
      cancelText="取消"
      title="添加账单信息"
      onCancel={cancelClickedHandler}
      onOk={okClickedHandler}
    >
      <Form form={form} layout="vertical">
        <Row>
          <Col span={12}>
            <Form.Item
              label="账单金额"
              name="total"
              rules={[{ required: true, message: '账单金额必须填！' }]}
            >
              <InputNumber
                style={{ width: 'auto' }}
                autoFocus
                min={0}
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={(value) =>
                  value ? value.replace(/\$\s?|(,*)/g, '') : 0
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="账单类型"
              initialValue={1}
              name="addFund"
              rules={[{ required: true, message: '请选择账单类型！' }]}
            >
              <Radio.Group name="radiogroup">
                <Radio value={1}>扣款</Radio>
                <Radio value={2}>充值</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label="账单说明"
          name="description"
          rules={[{ required: true, message: '账单说明必须填!' }]}
        >
          <Input.TextArea placeholder="账单说明" autoSize />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ClientBillingForm;
