import React, { ReactElement, useEffect, useState } from 'react';
import { Form, Modal, Button, Image, Divider } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import DHLeComCreationForm from '../DHLeCommerce/DHLeComCreationForm';
import {
  CARRIERS,
  DEFAULT_ADDRESS_FORM_DATA
} from '../../../shared/utils/constants';

interface AddCarrierModalProps {
  carrier: string;
  logo: string;
  visible: boolean;
  backClicked: () => void;
  cancelCliecked: () => void;
  okClicked: (values: any) => void;
}

const AddCarrierModal = ({
  carrier,
  logo,
  visible,
  backClicked,
  cancelCliecked,
  okClicked
}: AddCarrierModalProps): ReactElement => {
  const [form] = Form.useForm();
  const [addCarrierForm, setAddCarrierForm] = useState<ReactElement | null>(
    null
  );

  useEffect(() => {
    if (carrier === CARRIERS.DHL_ECOMMERCE) {
      form.setFieldsValue(DEFAULT_ADDRESS_FORM_DATA);
      setAddCarrierForm(
        <DHLeComCreationForm form={form} disabled={false} isUpdate={false} />
      );
    }
  }, [form, carrier]);

  const okClickedHandler = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        okClicked({ ...values, carrier });
      })
      .catch(() => {});
  };

  return (
    <Modal
      width={600}
      bodyStyle={{
        minHeight: '300px',
        maxHeight: '1000px',
        overflowY: 'auto'
      }}
      centered
      closable={false}
      visible={visible}
      okText="添加"
      cancelText="取消"
      title={
        <Button
          style={{ fontWeight: 700 }}
          size="small"
          type="text"
          onClick={backClicked}
          icon={<LeftOutlined />}
        >
          返回
        </Button>
      }
      onCancel={cancelCliecked}
      onOk={okClickedHandler}
      transitionName=""
      maskTransitionName=""
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Image width={100} height={81.53} src={logo} alt={carrier} />
        <span style={{ marginTop: '12px' }}>
          <strong>{`添加 ${carrier} 账号`}</strong>
        </span>
      </div>
      <Divider />
      {addCarrierForm}
    </Modal>
  );
};

export default AddCarrierModal;
