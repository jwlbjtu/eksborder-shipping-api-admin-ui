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
  Result
} from 'antd';
import _ from 'lodash';
import {
  CARRIERS_SAMPLE_DATA,
  FEE_TYPE,
  FEE_CALCULATE_BASE,
  DHL_ECOMMERCE_DOMESTIC_SERVICES,
  DHL_ECOMMERCE_FACILITIES
} from '../../../shared/utils/constants';

const { Option } = Select;

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px'
};

interface ClientConnectCarrierFormProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: any) => void;
}

const ClientConnectCarrierForm = ({
  visible,
  onCancel,
  onOk
}: ClientConnectCarrierFormProps): ReactElement => {
  const [form] = Form.useForm();
  const [carrierData, setCarrierData] = useState<any[]>([]);
  const [selectedCarrier, setSelectedCarrier] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // TODO: connect back end
    // load all available carrier accounts
    setLoading(true);
    setTimeout(() => {
      const allData = CARRIERS_SAMPLE_DATA;
      if (allData && allData.length > 0) {
        setCarrierData(allData);
      }
      setLoading(false);
    }, 1000);
  }, []);

  const cancelClickedHandler = () => {
    form.resetFields();
    setSelectedCarrier(null);
    onCancel();
  };

  const okClickedHandler = () => {
    form
      .validateFields()
      .then((values) => {
        console.log(values);
        form.resetFields();
        const services = values.services.map(
          (item: number) => DHL_ECOMMERCE_DOMESTIC_SERVICES[item]
        );
        const facilities = values.facilities.map(
          (item: number) => DHL_ECOMMERCE_FACILITIES[item]
        );
        const result = {
          ...values,
          services,
          facilities,
          carrier: selectedCarrier.carrier,
          connectedAccount: selectedCarrier.name
        };
        onOk(result);
      })
      .catch(() => {});
  };

  const carrierSelectedHandler = (value: number) => {
    setSelectedCarrier(carrierData[value - 1]);
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
              name="name"
              rules={[{ required: true, message: '账号名称必须填！' }]}
            >
              <Input placeholder="账号名称" />
            </Form.Item>
            <Form.Item
              label="选择要关联的账号"
              name="connectedAcconut"
              rules={[{ required: true, message: '请选择要关联的账号！' }]}
            >
              <Select placeholder="关联账号" onChange={carrierSelectedHandler}>
                {carrierData.map((item) => {
                  return (
                    <Option key={item.key} value={item.key}>
                      {item.name}
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
                  {selectedCarrier.services.map((ser: any, index: number) => {
                    return (
                      <Option key={ser.id} value={index} label={ser.id}>
                        {`${ser.id} - ${ser.name}`}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            )}
            {selectedCarrier && selectedCarrier.facilities && (
              <Form.Item
                label="操作中心"
                name="facilities"
                rules={[{ required: true, message: '至少选择一个操作中心！' }]}
              >
                <Select
                  mode="multiple"
                  placeholder="操作中心"
                  disabled={!selectedCarrier}
                  optionLabelProp="label"
                >
                  {selectedCarrier.facilities.map(
                    (item: any, index: number) => {
                      return (
                        <Option key={item} value={index} label={item}>
                          {item}
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
                name="feeType"
                rules={[{ required: true, message: '请选择费率模式' }]}
              >
                <Radio.Group>
                  {FEE_TYPE.map((item) => {
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
                name="feeCalBase"
                rules={[{ required: true, message: '请选择费率基准' }]}
              >
                <Radio.Group>
                  {FEE_CALCULATE_BASE.map((item) => {
                    return (
                      <Radio style={radioStyle} key={item.key} value={item.key}>
                        {item.name}
                      </Radio>
                    );
                  })}
                </Radio.Group>
              </Form.Item>
            </Space>
            <Form.Item label="备注" name="remark">
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
