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
  Checkbox,
  Divider,
  Button
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  RATE_BASES,
  WeightUnit,
  Currency,
  CarrierRateType,
  CARRIERS,
  Country,
  COUNTRY_NAMES
} from '../../../shared/utils/constants';
import { Carrier, Facility, Service } from '../../../shared/types/carrier';
import { CreateUserCarrierData } from '../../../shared/types/user.d';
import {
  selectShowUserCarrier,
  selectUserCarrierLoading,
  setShowUserCarrer
} from '../../../redux/user/userCarrierSlice';
import {
  fetchCarriersHandler,
  selectCarriers
} from '../../../redux/carrier/carrierSlice';

const { Option } = Select;

interface ClientConnectCarrierFormProps {
  onOk: (values: CreateUserCarrierData) => void;
}

const ClientConnectCarrierForm = ({
  onOk
}: ClientConnectCarrierFormProps): ReactElement => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const carriers = useSelector(selectCarriers);
  const showCreate = useSelector(selectShowUserCarrier);
  const loading = useSelector(selectUserCarrierLoading);
  const [selectedCarrier, setSelectedCarrier] = useState<Carrier | undefined>();
  const [useThirdparty, setUseThirdparty] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchCarriersHandler());
    setUseThirdparty(false);
  }, [dispatch]);

  const cancelClickedHandler = () => {
    form.resetFields();
    setSelectedCarrier(undefined);
    dispatch(setShowUserCarrer(false));
  };

  const okClickedHandler = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        if (selectedCarrier) {
          const service = selectedCarrier.services[values.service];
          const facility = values.facility;
          const result: CreateUserCarrierData = {
            accountName: values.accountName,
            accountId: values.accountId,
            carrier: selectedCarrier.carrierName,
            connectedAccount: selectedCarrier.accountName,
            service,
            facility,
            address: {
              name: values.name,
              company: values.company,
              phone: values.phone,
              street1: values.street1,
              street2: values.street2,
              city: values.city,
              state: values.state,
              zip: values.zip,
              country: values.country
            },
            rates: values.rates,
            carrierRef: selectedCarrier.id,
            userRef: '',
            note: values.note,
            thirdpartyPrice: useThirdparty,
            isActive: true,
            payOffline: values.payOffline
          };
          onOk(result);
          setSelectedCarrier(undefined);
        }
      })
      .catch(() => {});
  };

  const carrierSelectedHandler = (index: number) => {
    setSelectedCarrier(carriers[index]);
  };

  return (
    <Modal
      width={1000}
      bodyStyle={{
        minHeight: '300px',
        maxHeight: '1000px',
        overflowY: 'auto',
        margin: '10px 50px'
      }}
      centered
      closable={false}
      visible={showCreate}
      okText="关联账号"
      cancelText="取消"
      title="关联物流账号"
      onCancel={cancelClickedHandler}
      onOk={okClickedHandler}
      okButtonProps={{ disabled: !(carriers && carriers.length > 0) }}
    >
      <Spin size="large" spinning={loading}>
        {carriers && carriers.length > 0 ? (
          <Form form={form} layout="vertical">
            <Space size="large">
              <Form.Item
                label="账号名称"
                name="accountName"
                rules={[{ required: true, message: '账号名称必须填！' }]}
              >
                <Input placeholder="账号名称" />
              </Form.Item>
              <Form.Item
                label="渠道代码"
                name="accountId"
                rules={[{ required: true, message: '渠道代码必须填！' }]}
              >
                <Input placeholder="渠道代码" />
              </Form.Item>
            </Space>

            <Form.Item
              label="选择要关联的账号"
              name="connectedAccount"
              rules={[{ required: true, message: '请选择要关联的账号！' }]}
            >
              <Select placeholder="关联账号" onChange={carrierSelectedHandler}>
                {carriers.map((item: Carrier, index: number) => {
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
                name="service"
                rules={[{ required: true, message: '请选择一个服务！' }]}
              >
                <Select
                  placeholder="授权服务"
                  disabled={!selectedCarrier}
                  options={selectedCarrier.services.map(
                    (service: Service, index: number) => {
                      if (selectedCarrier.carrierName === CARRIERS.RUI_YUN) {
                        return {
                          label: `${service.name} - ${service.id}`,
                          value: index
                        };
                      }
                      return {
                        label: `${service.key} - ${service.id}`,
                        value: index
                      };
                    }
                  )}
                />
              </Form.Item>
            )}
            {selectedCarrier &&
              selectedCarrier.facilities &&
              selectedCarrier.facilities.length > 0 && (
                <Form.Item
                  label="操作中心"
                  name="facility"
                  rules={[{ required: true, message: '请选择一个操作中心！' }]}
                >
                  <Select
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
            <Form.Item label="备注" name="note">
              <Input.TextArea autoSize placeholder="账号相关备注" />
            </Form.Item>
            <Space>
              <Form.Item name="thirdpartyPrice">
                <Checkbox
                  checked={useThirdparty}
                  onClick={() => setUseThirdparty(!useThirdparty)}
                >
                  三方价格
                </Checkbox>
              </Form.Item>
              <Form.Item name="payOffline" valuePropName="checked">
                <Checkbox>线下付款</Checkbox>
              </Form.Item>
            </Space>
            <Divider orientation="left" plain>
              备案地址
            </Divider>
            <Space size="large">
              <Form.Item
                label="姓名"
                name="name"
                rules={[{ required: true, message: '姓名必须填！' }]}
              >
                <Input placeholder="姓名" />
              </Form.Item>
              <Form.Item
                label="公司名"
                name="company"
                rules={[{ required: true, message: '公司名必须填！' }]}
              >
                <Input placeholder="公司名" />
              </Form.Item>
              <Form.Item label="电话" name="phone">
                <Input placeholder="电话" />
              </Form.Item>
            </Space>
            <Form.Item
              label="地址1"
              name="street1"
              rules={[{ required: true, message: '地址1必须填！' }]}
            >
              <Input placeholder="地址1" />
            </Form.Item>
            <Form.Item label="地址2" name="street2">
              <Input placeholder="地址2" />
            </Form.Item>
            <Space size="large">
              <Form.Item
                label="城市"
                name="city"
                rules={[{ required: true, message: '城市必须填！' }]}
              >
                <Input placeholder="城市" />
              </Form.Item>
              <Form.Item
                label="州"
                name="state"
                rules={[{ required: true, message: '州必须填！' }]}
              >
                <Input placeholder="州" />
              </Form.Item>
              <Form.Item
                label="邮编"
                name="zip"
                rules={[{ required: true, message: '邮编必须填！' }]}
              >
                <Input placeholder="邮编" />
              </Form.Item>
              <Form.Item
                label="国家代码"
                name="country"
                rules={[{ required: false, message: '国家代码必须填' }]}
                style={{ width: '215px' }}
              >
                <Select placeholder="国家代码">
                  return (
                  <>
                    <Option value={Country.USA}>
                      {COUNTRY_NAMES[Country.USA]}
                    </Option>
                    <Option value={Country.CHINA}>
                      {COUNTRY_NAMES[Country.CHINA]}
                    </Option>
                    <Option value={Country.AUSTRALIA}>
                      {COUNTRY_NAMES[Country.AUSTRALIA]}
                    </Option>
                  </>
                  );
                </Select>
              </Form.Item>
            </Space>
            <Divider orientation="left" plain>
              费率
            </Divider>
            <Form.List name="rates">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <div key={field.key}>
                      <Space
                        size="large"
                        align="baseline"
                        style={{ width: '100%' }}
                      >
                        <Form.Item
                          name={[field.name, 'ratebase']}
                          rules={[
                            { required: true, message: '收费基准必须选' }
                          ]}
                        >
                          <Select
                            placeholder="收费基准"
                            style={{ width: '180px' }}
                          >
                            {Object.values(RATE_BASES).map((ele) => (
                              <Option key={ele} value={ele}>
                                {ele}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                        <Form.Item
                          noStyle
                          shouldUpdate={(prevValues, currentValues) => {
                            if (currentValues.rates[index]) {
                              return (
                                (prevValues.rates[index] === undefined &&
                                  currentValues.rates[index] !== undefined) ||
                                prevValues.rates[index].ratebase !==
                                  currentValues.rates[index].ratebase
                              );
                            }
                            return false;
                          }}
                        >
                          {({ getFieldValue }) =>
                            getFieldValue('rates')[index] &&
                            getFieldValue('rates')[index].ratebase ===
                              RATE_BASES.WEIGHT ? (
                              <Form.Item
                                name={[field.name, 'weightUnit']}
                                rules={[
                                  { required: true, message: '重量单位必须选' }
                                ]}
                              >
                                <Select
                                  placeholder="重量单位"
                                  style={{ width: '180px' }}
                                >
                                  {Object.values(WeightUnit).map((ele) => (
                                    <Option key={ele} value={ele}>
                                      {ele}
                                    </Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            ) : null
                          }
                        </Form.Item>
                      </Space>
                      <Space
                        key={field.key}
                        size="large"
                        align="baseline"
                        style={{ width: '100%' }}
                      >
                        <Form.Item
                          name={[field.name, 'currency']}
                          rules={[
                            { required: true, message: '货币种类必须填' }
                          ]}
                        >
                          <Select placeholder="货币" style={{ width: '80px' }}>
                            {Object.values(Currency).map((ele) => (
                              <Option key={ele} value={ele}>
                                {ele}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                        <Form.Item
                          name={[field.name, 'rate']}
                          rules={[{ required: true, message: '费率必须填！' }]}
                        >
                          <InputNumber
                            placeholder="费率"
                            min={0}
                            style={{ width: '100px' }}
                            step="0.01"
                            precision={2}
                          />
                        </Form.Item>
                        <Form.Item
                          name={[field.name, 'ratetype']}
                          rules={[
                            { required: true, message: '请选择费率模式' }
                          ]}
                        >
                          <Radio.Group>
                            {Object.values(CarrierRateType).map((item) => {
                              return (
                                <Radio key={item} value={item}>
                                  {item}
                                </Radio>
                              );
                            })}
                          </Radio.Group>
                        </Form.Item>
                        <MinusCircleOutlined
                          onClick={() => {
                            remove(field.name);
                          }}
                        />
                      </Space>
                      <Divider />
                    </div>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      添加费率
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
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
