import React, { ReactElement, useEffect, useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Space,
  Select,
  Spin,
  Radio,
  InputNumber,
  Result,
  Switch
} from 'antd';
import {
  FEE_TYPE,
  FEE_CALCULATE_BASE,
  SERVER_ROUTES
} from '../../../shared/utils/constants';
import { UserCarrier } from '../../../shared/types/user';
import { Carrier, Facility, Service } from '../../../shared/types/carrier';
import axios from '../../../shared/utils/axios-base';
import errorHandler from '../../../shared/utils/errorHandler';

const { Option } = Select;

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px'
};

interface ClientUpdateCarrierFormProps {
  visible: boolean;
  data: UserCarrier;
  onCancel: () => void;
  onOk: (values: any) => void;
}

const ClientUpdateCarrierForm = ({
  visible,
  data,
  onCancel,
  onOk
}: ClientUpdateCarrierFormProps): ReactElement => {
  const [form] = Form.useForm();
  const [carrierData, setCarrierData] = useState<Carrier[]>([]);
  const [selectedCarrier, setSelectedCarrier] = useState<Carrier | null>(null);
  const [loading, setLoading] = useState(false);
  const [dataActive, setDataActive] = useState(data.isActive);

  useEffect(() => {
    // TODO: add auth
    // load all available carrier accounts
    setLoading(true);
    axios
      .get(SERVER_ROUTES.CARRIER)
      .then((response) => {
        const allCarriers = response.data;
        setCarrierData(allCarriers);
        if (allCarriers.length > 0) {
          const carrier = allCarriers.find(
            (item: Carrier) => item.accountName === data.connectedAccount
          );
          setSelectedCarrier(carrier);
        } else {
          setSelectedCarrier(null);
        }
      })
      .catch((error) => {
        errorHandler(error);
      })
      .finally(() => setLoading(false));
  }, [data]);

  const cancelClickedHandler = () => {
    form.resetFields();
    setSelectedCarrier(null);
    onCancel();
  };

  const okClickedHandler = () => {
    form
      .validateFields()
      .then((values) => {
        // form.resetFields();
        if (selectedCarrier) {
          const services = values.services.map(
            (index: number) => selectedCarrier.services[index].key
          );
          const facilities =
            values.facilities &&
            values.facilities.map(
              (index: number) => selectedCarrier.facilities[index].facility
            );
          const result = {
            id: data.id,
            carrier: selectedCarrier.carrierName,
            connectedAccount: selectedCarrier.accountName,
            services,
            facilities,
            fee: values.fee,
            feeBase: values.feeBase,
            billingType: values.billingType,
            carrierRef: selectedCarrier.id,
            note: values.note,
            isActive: dataActive
          };
          onOk(result);
        }
      })
      .catch(() => {});
  };

  const carrierSelectedHandler = (index: number) => {
    setSelectedCarrier(carrierData[index]);
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
        overflowY: 'auto',
        margin: '10px 50px'
      }}
      centered
      closable={false}
      visible={visible}
      okText="修改账号"
      cancelText="取消"
      title={
        <div>
          <strong>修改物流账号</strong>
          <Switch
            style={{ float: 'right' }}
            checkedChildren="启用"
            unCheckedChildren="停用"
            checked={dataActive}
            onClick={changeActiveHandler}
          />
        </div>
      }
      onCancel={cancelClickedHandler}
      onOk={okClickedHandler}
      okButtonProps={{ disabled: !(carrierData && carrierData.length > 0) }}
    >
      <Spin size="large" spinning={loading}>
        {carrierData && carrierData.length > 0 ? (
          <Form form={form} layout="vertical">
            <Form.Item
              label="账号名称"
              name="accountName"
              rules={[{ required: true, message: '账号名称必须填！' }]}
              initialValue={data.accountName}
            >
              <Input placeholder="账号名称" disabled />
            </Form.Item>
            <Form.Item
              label="选择要关联的账号"
              name="connectedAcconut"
              rules={[{ required: true, message: '请选择要关联的账号！' }]}
              initialValue={carrierData.findIndex(
                (item: Carrier) => item.accountName === data.connectedAccount
              )}
            >
              <Select
                placeholder="关联账号"
                onChange={carrierSelectedHandler}
                disabled={!dataActive}
              >
                {carrierData.map((item: Carrier, index: number) => {
                  return (
                    <Option key={item.id} value={index}>
                      {item.accountName}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            {selectedCarrier && selectedCarrier.services && (
              <Form.Item
                label="授权服务"
                name="services"
                rules={[{ required: true, message: '至少选择一个服务！' }]}
                initialValue={data.services.map((item: string) =>
                  selectedCarrier.services.findIndex(
                    (ele: Service) => ele.key === item
                  )
                )}
              >
                <Select
                  mode="multiple"
                  placeholder="授权服务"
                  disabled={!dataActive}
                  optionLabelProp="label"
                >
                  {selectedCarrier.services.map(
                    (ser: Service, index: number) => {
                      return (
                        <Option key={ser.key} value={index} label={ser.key}>
                          {`${ser.key} - ${ser.name}`}
                        </Option>
                      );
                    }
                  )}
                </Select>
              </Form.Item>
            )}
            {selectedCarrier && selectedCarrier.facilities && (
              <Form.Item
                label="操作中心"
                name="facilities"
                rules={[{ required: true, message: '至少选择一个操作中心！' }]}
                initialValue={data.facilities.map((item: string) =>
                  selectedCarrier.facilities.findIndex(
                    (ele: Facility) => ele.facility === item
                  )
                )}
              >
                <Select
                  mode="multiple"
                  placeholder="操作中心"
                  disabled={!dataActive}
                  optionLabelProp="label"
                >
                  {selectedCarrier.facilities.map(
                    (item: Facility, index: number) => {
                      return (
                        <Option
                          key={item.facility}
                          value={index}
                          label={item.facility}
                        >
                          {item.facility}
                        </Option>
                      );
                    }
                  )}
                </Select>
              </Form.Item>
            )}
            <Space size="large" align="baseline" style={{ width: '100%' }}>
              <Form.Item
                label="费率"
                name="fee"
                rules={[{ required: true, message: '费率必须填！' }]}
                initialValue={data.fee}
              >
                <InputNumber
                  min={0}
                  style={{ width: '180px' }}
                  disabled={!dataActive}
                />
              </Form.Item>
              <Form.Item
                label="费率模式"
                name="billingType"
                rules={[{ required: true, message: '请选择费率模式' }]}
                initialValue={data.billingType}
              >
                <Radio.Group disabled={!dataActive}>
                  {Object.values(FEE_TYPE).map((item) => {
                    return (
                      <Radio style={radioStyle} key={item.key} value={item.key}>
                        {item.name}
                      </Radio>
                    );
                  })}
                </Radio.Group>
              </Form.Item>
              <Form.Item
                label="费率基准"
                name="feeBase"
                rules={[{ required: true, message: '请选择费率基准' }]}
                initialValue={data.feeBase}
              >
                <Radio.Group disabled={!dataActive}>
                  {Object.values(FEE_CALCULATE_BASE).map((item) => {
                    return (
                      <Radio style={radioStyle} key={item.key} value={item.key}>
                        {item.name}
                      </Radio>
                    );
                  })}
                </Radio.Group>
              </Form.Item>
            </Space>
            <Form.Item label="备注" name="note" initialValue={data.note}>
              <Input.TextArea
                autoSize
                placeholder="账号相关备注"
                disabled={!dataActive}
              />
            </Form.Item>
          </Form>
        ) : (
          <Result
            status="warning"
            title="未找到可以关联的物流账号，请先创建物流账号"
          />
        )}
      </Spin>
    </Modal>
  );
};

export default ClientUpdateCarrierForm;
