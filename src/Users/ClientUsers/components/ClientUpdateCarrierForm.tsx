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
  Switch,
  Divider,
  Button,
  Checkbox
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  CarrierRateType,
  Currency,
  WeightUnit,
  RATE_BASES,
  Country,
  COUNTRY_NAMES
} from '../../../shared/utils/constants';
import { UserCarrier } from '../../../shared/types/user';
import { Carrier, Facility, Service } from '../../../shared/types/carrier';
import {
  selectShowUpdateUserCarrier,
  selectUserCarrierLoading
} from '../../../redux/user/userCarrierSlice';
import {
  fetchCarriersHandler,
  selectCarriers
} from '../../../redux/carrier/carrierSlice';

const { Option } = Select;

interface ClientUpdateCarrierFormProps {
  data: UserCarrier;
  onOk: (values: UserCarrier) => void;
  onCancel: () => void;
}

const ClientUpdateCarrierForm = ({
  data,
  onOk,
  onCancel
}: ClientUpdateCarrierFormProps): ReactElement => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const carriers = useSelector(selectCarriers);
  const showUpdate = useSelector(selectShowUpdateUserCarrier);
  const loading = useSelector(selectUserCarrierLoading);
  const [selectedCarrier, setSelectedCarrier] = useState<Carrier | undefined>();
  const [dataActive, setDataActive] = useState(data.isActive);
  const [useThirdparty, setUseThirdparty] = useState<boolean>(
    data.thirdpartyPrice
  );

  useEffect(() => {
    setDataActive(data.isActive);
    setUseThirdparty(data.thirdpartyPrice);
    form.setFieldsValue({
      payOffline: data.payOffline
    });

    if (!carriers) {
      dispatch(fetchCarriersHandler());
    }
    if (carriers) {
      const selected = carriers.find(
        (ele) => data.connectedAccount === ele.accountName
      );
      setSelectedCarrier(selected);
    }
  }, [carriers, data, dispatch, form]);

  const cancelClickedHandler = () => {
    form.resetFields();
    setSelectedCarrier(undefined);
    onCancel();
  };

  const okClickedHandler = () => {
    form
      .validateFields()
      .then((values) => {
        // form.resetFields();
        if (selectedCarrier) {
          const service = selectedCarrier.services[values.service];
          const facility =
            values.facilty &&
            selectedCarrier.facilities![values.facility].facility;
          const result: UserCarrier = {
            id: data.id,
            accountId: data.accountId,
            accountName: data.accountName,
            carrier: selectedCarrier.carrierName,
            connectedAccount: selectedCarrier.accountName,
            service,
            facility,
            address: {
              name: values.name,
              company: values.company,
              street1: values.street1,
              street2: values.street2,
              city: values.city,
              state: values.state,
              zip: values.zip,
              country: data.address.country
            },
            rates: values.rates,
            carrierRef: selectedCarrier.id,
            thirdpartyPrice: useThirdparty,
            note: values.note,
            isActive: dataActive,
            userRef: data.userRef,
            payOffline: values.payOffline
          };
          onOk(result);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const carrierSelectedHandler = (index: number) => {
    setSelectedCarrier(carriers[index]);
  };

  const changeActiveHandler = () => {
    setDataActive(!dataActive);
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
      visible={showUpdate}
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
                initialValue={data.accountName}
              >
                <Input placeholder="账号名称" disabled />
              </Form.Item>
              <Form.Item
                label="渠道代码"
                name="accountId"
                rules={[{ required: true, message: '渠道代码必须填！' }]}
                initialValue={data.accountId}
              >
                <Input placeholder="渠道代码" disabled />
              </Form.Item>
            </Space>
            <Form.Item
              label="选择要关联的账号"
              name="connectedAcconut"
              rules={[{ required: true, message: '请选择要关联的账号！' }]}
              initialValue={carriers.findIndex(
                (item: Carrier) => item.accountName === data.connectedAccount
              )}
            >
              <Select
                placeholder="关联账号"
                onChange={carrierSelectedHandler}
                disabled={!dataActive}
              >
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
                initialValue={selectedCarrier.services.findIndex(
                  (ele: Service) =>
                    ele.key === data.service.key &&
                    ele.name === data.service.name
                )}
              >
                <Select
                  placeholder="授权服务"
                  disabled={!dataActive}
                  optionLabelProp="label"
                >
                  {selectedCarrier.services.map(
                    (ser: Service, index: number) => {
                      return (
                        <Option
                          key={ser.key}
                          value={index}
                          label={`${ser.key} - ${ser.id}`}
                        >
                          {`${ser.key} - ${ser.id}`}
                        </Option>
                      );
                    }
                  )}
                </Select>
              </Form.Item>
            )}
            {selectedCarrier &&
              selectedCarrier.facilities &&
              selectedCarrier.facilities.length > 0 &&
              data.facility && (
                <Form.Item
                  label="操作中心"
                  name="facility"
                  rules={[{ required: true, message: '请选择一个操作中心！' }]}
                  initialValue={selectedCarrier.facilities.findIndex(
                    (ele: Facility) => ele.facility === data.facility
                  )}
                >
                  <Select
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
            <Form.Item label="备注" name="note" initialValue={data.note}>
              <Input.TextArea
                autoSize
                placeholder="账号相关备注"
                disabled={!dataActive}
              />
            </Form.Item>
            <Space>
              <Form.Item name="thirdpartyPrice">
                <Checkbox
                  checked={useThirdparty}
                  onClick={() => setUseThirdparty(!useThirdparty)}
                  disabled={!dataActive}
                >
                  三方价格
                </Checkbox>
              </Form.Item>
              <Form.Item name="payOffline" valuePropName="checked">
                <Checkbox>线下支付</Checkbox>
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
                initialValue={data.address.name}
              >
                <Input placeholder="姓名" />
              </Form.Item>
              <Form.Item
                label="公司名"
                name="company"
                rules={[{ required: true, message: '公司名必须填！' }]}
                initialValue={data.address.company}
              >
                <Input placeholder="公司名" />
              </Form.Item>
            </Space>
            <Form.Item
              label="地址1"
              name="street1"
              rules={[{ required: true, message: '地址1必须填！' }]}
              initialValue={data.address.street1}
            >
              <Input placeholder="地址1" />
            </Form.Item>
            <Form.Item
              label="地址2"
              name="street2"
              initialValue={data.address.street2}
            >
              <Input placeholder="地址2" />
            </Form.Item>
            <Space size="large">
              <Form.Item
                label="城市"
                name="city"
                rules={[{ required: true, message: '城市必须填！' }]}
                initialValue={data.address.city}
              >
                <Input placeholder="城市" />
              </Form.Item>
              <Form.Item
                label="州"
                name="state"
                rules={[{ required: true, message: '州必须填！' }]}
                initialValue={data.address.state}
              >
                <Input placeholder="州" />
              </Form.Item>
              <Form.Item
                label="邮编"
                name="zip"
                rules={[{ required: true, message: '邮编必须填！' }]}
                initialValue={data.address.zip}
              >
                <Input placeholder="邮编" />
              </Form.Item>
              <Form.Item
                label="国家代码"
                name="country"
                rules={[{ required: false, message: '国家代码必须填' }]}
                style={{ width: '215px' }}
                initialValue={data.address.country}
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
                  </>
                  );
                </Select>
              </Form.Item>
            </Space>
            <Divider orientation="left" plain>
              费率
            </Divider>
            <Form.List name="rates" initialValue={data.rates}>
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
                            disabled={!dataActive}
                          />
                        </Form.Item>
                        <Form.Item
                          name={[field.name, 'ratetype']}
                          rules={[
                            { required: true, message: '请选择费率模式' }
                          ]}
                        >
                          <Radio.Group disabled={!dataActive}>
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

export default ClientUpdateCarrierForm;
