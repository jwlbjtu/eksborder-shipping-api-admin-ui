import React, { ReactElement, useEffect, useState } from 'react';
import { Modal, Switch, Form } from 'antd';
import { CARRIERS } from '../../../shared/utils/constants';
import DHLeComCreationForm from '../DHLeCommerce/DHLeComCreationForm';

interface UpdateCarrierModalProps {
  data: any;
  visible: boolean;
  cancelClicked: () => void;
  okClicked: (values: any) => void;
}

const UpdateCarrierModal = ({
  data,
  visible,
  cancelClicked,
  okClicked
}: UpdateCarrierModalProps): ReactElement => {
  const [form] = Form.useForm();
  const [carrierForm, setCarrierForm] = useState<ReactElement | null>(null);
  const [dataActive, setDataActive] = useState(data.active);

  useEffect(() => {
    if (data.carrier === CARRIERS.DHL_ECOMMERCE) {
      form.setFieldsValue(data);
      setCarrierForm(
        <DHLeComCreationForm form={form} disabled={!dataActive} isUpdate />
      );
    }
  }, [form, data, dataActive]);

  const okCLickedHandler = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        okClicked({
          ...values,
          key: data.key,
          active: dataActive
        });
      })
      .catch(() => {});
  };

  const changeActiveHandler = () => {
    setDataActive(!dataActive);
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
      okText="更新账号"
      cancelText="取消"
      title={
        <div>
          <strong>{`修改 ${data.carrier} 账号信息`}</strong>
          <Switch
            style={{ float: 'right' }}
            checkedChildren="启用"
            unCheckedChildren="停用"
            checked={dataActive}
            onClick={changeActiveHandler}
          />
        </div>
      }
      onCancel={cancelClicked}
      onOk={okCLickedHandler}
    >
      {carrierForm}
    </Modal>
  );
};

export default UpdateCarrierModal;
