import React, { ReactElement, useContext, useEffect, useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Space,
  Select,
  Spin,
  Radio,
  InputNumber,
  Result
} from 'antd';
import {
  FEE_TYPE,
  FEE_CALCULATE_BASE,
  SERVER_ROUTES
} from '../../../shared/utils/constants';
import { Carrier, Facility, Service } from '../../../shared/types/carrier';
import { CreateUserCarrierData } from '../../../shared/types/user.d';
import axios from '../../../shared/utils/axios-base';
import errorHandler from '../../../shared/utils/errorHandler';
import AuthContext from '../../../shared/components/context/auth-context';

const { Option } = Select;

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px'
};

interface ClientConnectCarrierFormProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: CreateUserCarrierData) => void;
}

const ClientConnectCarrierForm = ({
  visible,
  onCancel,
  onOk
}: ClientConnectCarrierFormProps): ReactElement => {
  const auth = useContext(AuthContext);
  const [form] = Form.useForm();
  const [carrierData, setCarrierData] = useState<Carrier[]>([]);
  const [selectedCarrier, setSelectedCarrier] = useState<Carrier | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(SERVER_ROUTES.CARRIER, {
        headers: {
          Authorization: `${auth.userData?.token_type} ${auth.userData?.token}`
        }
      })
      .then((response) => {
        setCarrierData(response.data);
      })
      .catch((error) => {
        errorHandler(error);
      })
      .finally(() => setLoading(false));
  }, [auth]);

  const cancelClickedHandler = () => {
    form.resetFields();
    setSelectedCarrier(null);
    onCancel();
  };

  const okClickedHandler = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        if (selectedCarrier) {
          const services = values.services.map(
            (index: number) => selectedCarrier.services[index].key
          );
          const facilities =
            values.facilities &&
            values.facilities.map(
              (index: number) => selectedCarrier.facilities[index].facility
            );
          const result: CreateUserCarrierData = {
            accountName: values.accountName,
            carrier: selectedCarrier.carrierName,
            connectedAccount: selectedCarrier.accountName,
            services,
            facilities,
            fee: values.fee,
            feeBase: values.feeBase,
            billingType: values.billingType,
            carrierRef: selectedCarrier.id,
            userRef: '',
            note: values.note,
            isActive: true
          };
          onOk(result);
          setSelectedCarrier(null);
        }
      })
      .catch(() => {});
  };

  const carrierSelectedHandler = (index: number) => {
    setSelectedCarrier(carrierData[index]);
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
      okText="关联账号"
      cancelText="取消"
      title="关联物流账号"
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
            >
              <Input placeholder="账号名称" />
            </Form.Item>
            <Form.Item
              label="选择要关联的账号"
              name="connectedAccount"
              rules={[{ required: true, message: '请选择要关联的账号！' }]}
            >
              <Select placeholder="关联账号" onChange={carrierSelectedHandler}>
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
              >
                <Select
                  mode="multiple"
                  placeholder="授权服务"
                  disabled={!selectedCarrier}
                  optionLabelProp="label"
                >
                  {selectedCarrier.services.map(
                    (service: Service, index: number) => {
                      return (
                        <Option
                          key={service.key}
                          value={index}
                          label={service.key}
                        >
                          {`${service.key} - ${service.name}`}
                        </Option>
                      );
                    }
                  )}
                </Select>
              </Form.Item>
            )}
            {selectedCarrier &&
              selectedCarrier.facilities &&
              selectedCarrier.facilities.length > 0 && (
                <Form.Item
                  label="操作中心"
                  name="facilities"
                  rules={[
                    { required: true, message: '至少选择一个操作中心！' }
                  ]}
                >
                  <Select
                    mode="multiple"
                    placeholder="操作中心"
                    disabled={!selectedCarrier}
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
              >
                <InputNumber min={0} style={{ width: '180px' }} />
              </Form.Item>
              <Form.Item
                label="费率模式"
                name="billingType"
                rules={[{ required: true, message: '请选择费率模式' }]}
              >
                <Radio.Group>
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
              >
                <Radio.Group>
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
            <Form.Item label="备注" name="note">
              <Input.TextArea autoSize placeholder="账号相关备注" />
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

export default ClientConnectCarrierForm;
