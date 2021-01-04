import React, { ReactElement, useEffect, useState } from 'react';
import { Modal, Switch, Form } from 'antd';
import {
  CARRIERS,
  DHL_ECOMMERCE_DOMESTIC_SERVICES
} from '../../../shared/utils/constants';
import DHLeComCreationForm from '../DHLeCommerce/DHLeComCreationForm';
import {
  Address,
  Carrier,
  CarrierUpdateData,
  Facility,
  Service
} from '../../../shared/types/carrier';

interface UpdateCarrierModalProps {
  data: Carrier;
  visible: boolean;
  cancelClicked: () => void;
  okClicked: (id: string, values: CarrierUpdateData) => void;
}

const UpdateCarrierModal = ({
  data,
  visible,
  cancelClicked,
  okClicked
}: UpdateCarrierModalProps): ReactElement => {
  const [form] = Form.useForm();
  const [carrierForm, setCarrierForm] = useState<ReactElement | null>(null);
  const [dataActive, setDataActive] = useState(data.isActive);

  useEffect(() => {
    if (data.carrierName === CARRIERS.DHL_ECOMMERCE) {
      const formData = {
        accountName: data.accountName,
        carrierName: data.carrierName,
        description: data.description,
        'pickup-main': data.facilities[0].pickup,
        'facility-main': data.facilities[0].facility,
        locations: data.facilities
          .map((item) => {
            return {
              key: item.pickup,
              pickup: item.pickup,
              facility: item.facility
            };
          })
          .slice(1),
        services: data.services.map((item) => {
          return DHL_ECOMMERCE_DOMESTIC_SERVICES.findIndex(
            (service) => service.key === item.key
          );
        }),
        company: data.returnAddress.company,
        street1: data.returnAddress.street1,
        street2: data.returnAddress.street2,
        city: data.returnAddress.city,
        state: data.returnAddress.state,
        country: data.returnAddress.country,
        postalCode: data.returnAddress.postalCode
      };
      form.setFieldsValue(formData);
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
        let carrierServices: Service[] = [];
        let services: Service[] = [];
        if (data.carrierName === CARRIERS.DHL_ECOMMERCE) {
          carrierServices = DHL_ECOMMERCE_DOMESTIC_SERVICES;
        }
        if (carrierServices.length > 0) {
          services = values.services.map(
            (inds: number) => carrierServices[inds]
          );
        }

        const facilities: Facility[] = [];
        if (data.carrierName === CARRIERS.DHL_ECOMMERCE) {
          facilities.push({
            pickup: values['pickup-main'],
            facility: values['facility-main']
          });
          if (values.locations) {
            values.locations.forEach((element: Facility) => {
              facilities.push(element);
            });
          }
        }

        const address: Address = {
          company: values.company,
          street1: values.street1,
          street2: values.street2,
          city: values.city,
          state: values.state,
          country: values.country,
          postalCode: values.postalCode
        };

        const updateData: CarrierUpdateData = {
          accountName: values.accountName,
          carrierName: data.carrierName,
          description: values.description,
          facilities,
          services,
          returnAddress: address,
          shipperId: values.shipperId,
          isActive: dataActive
        };
        okClicked(data.id, updateData);
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
          <strong>{`修改 ${data.carrierName} 账号信息`}</strong>
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
