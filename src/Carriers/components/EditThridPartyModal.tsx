import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Select,
  Space
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { ReactElement, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createThridPartyAccountHandler,
  selectThirdpartyModalLoading,
  selectThirdpartyShowModal,
  setShowModal,
  updateThirdPartyAccountHandler
} from '../../redux/carrier/thirdpartySlice';
import {
  Carrier,
  ThirdPartyAccount,
  ThirdPartyAccountData
} from '../../shared/types/carrier';
import {
  CARRIER_ZONE_MODE,
  CARRIER_ZONE_MODE_TEXTS,
  CarrierRateType,
  Country,
  COUNTRY_NAMES,
  Currency,
  RATE_BASES,
  WeightUnit
} from '../../shared/utils/constants';

const { Option } = Select;

interface EditThirdPartyModalProps {
  carrier: Carrier;
  account: ThirdPartyAccount | undefined;
  onCancel: () => void;
}

const EditThirdPartyModal = ({
  carrier,
  account,
  onCancel
}: EditThirdPartyModalProps): ReactElement => {
  const dispatch = useDispatch();
  const [form] = useForm();
  const showModal = useSelector(selectThirdpartyShowModal);
  const modalLoading = useSelector(selectThirdpartyModalLoading);
  const [noCondition, setNoCondition] = useState<boolean>(false);

  useEffect(() => {
    setNoCondition(false);
    form.resetFields();
    if (account) {
      form.setFieldsValue({
        name: account.name,
        carrier: account.carrier,
        accountNum: account.accountNum,
        countryCode: account.countryCode,
        zipCode: account.zipCode,
        service: carrier.services.findIndex(
          (ele) => ele.key === account.service.key
        ),
        region: account.region,
        zoneMode: account.zoneMode,
        rates: account.rates
      });
      if (account.condition) {
        form.setFieldsValue({
          condition_minWeight: account.condition.minWeight,
          condition_maxWeight: account.condition.maxWeight,
          condition_weightUnit: account.condition.weightUnit
        });
      } else {
        setNoCondition(true);
      }
    }
  }, [account, form, carrier]);

  const updateButtonClickedHandler = () => {
    form.validateFields().then((values: any) => {
      if (account) {
        const serviceObj = carrier.services[values.service];
        const data: ThirdPartyAccount = {
          id: account.id,
          name: values.name,
          carrier: carrier.carrierName,
          accountNum: values.accountNum,
          countryCode: values.countryCode,
          zipCode: values.zipCode,
          service: serviceObj,
          region: values.region,
          zoneMode: values.zoneMode,
          condition: noCondition
            ? {}
            : {
                minWeight: values.condition_minWeight,
                maxWeight: values.condition_maxWeight,
                weightUnit: values.condition_weightUnit
              },
          zoneMap: account.zoneMap,
          rates: values.rates || [],
          carrierRef: carrier.id
        };
        dispatch(updateThirdPartyAccountHandler(data));
        form.resetFields();
        setNoCondition(false);
      }
    });
  };

  const okButtonClickedHandler = () => {
    form.validateFields().then((values: any) => {
      const serviceObject = carrier.services[values.service];
      const data: ThirdPartyAccountData = {
        name: values.name,
        carrier: carrier.carrierName,
        accountNum: values.accountNum,
        countryCode: values.countryCode,
        zipCode: values.zipCode,
        service: serviceObject,
        region: values.region,
        zoneMode: values.zoneMode,
        condition: noCondition
          ? {}
          : {
              minWeight: values.condition_minWeight,
              maxWeight: values.condition_maxWeight,
              weightUnit: values.condition_weightUnit
            },
        rates: values.rates || [],
        carrierRef: carrier.id
      };
      dispatch(createThridPartyAccountHandler(data));
      form.resetFields();
      setNoCondition(false);
    });
  };

  const cancelButtonClickedHandler = () => {
    form.resetFields();
    dispatch(setShowModal(false));
    setNoCondition(false);
    onCancel();
  };

  return (
    <Modal
      title="添加三方账号"
      closable={false}
      cancelText="取消"
      onCancel={cancelButtonClickedHandler}
      okText="保存"
      onOk={account ? updateButtonClickedHandler : okButtonClickedHandler}
      okButtonProps={{ loading: modalLoading }}
      visible={showModal}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="账号名称"
          name="name"
          rules={[{ required: true, message: '账号名称必须填' }]}
        >
          <Input placeholder="账号名称" type="text" />
        </Form.Item>
        <Form.Item
          label="账号"
          name="accountNum"
          rules={[{ required: true, message: '账号必须填' }]}
        >
          <Input placeholder="账号" type="text" />
        </Form.Item>
        <Space size="large">
          <Form.Item
            label="国家代码"
            name="countryCode"
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
          <Form.Item
            style={{ width: '215px' }}
            label="邮政编码"
            name="zipCode"
            rules={[{ required: false, message: '邮政编码' }]}
          >
            <Input placeholder="邮政编码" />
          </Form.Item>
        </Space>
        <Form.Item
          label="服务名称"
          name="service"
          rules={[{ required: true, message: '服务名称必须填' }]}
        >
          <Select>
            {carrier.services.map((ele, index) => {
              return (
                <Option key={ele.key} value={index}>
                  {ele.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          label="服务范围"
          name="region"
          rules={[{ required: true, message: '服务范围必须填' }]}
        >
          <Select>
            {carrier.regions.map((ele) => {
              return (
                <Option key={ele} value={ele}>
                  {ele}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          label="分区模式"
          name="zoneMode"
          rules={[{ required: true, message: '分区模式必须填' }]}
        >
          <Select>
            <Option key={CARRIER_ZONE_MODE.ZIP} value={CARRIER_ZONE_MODE.ZIP}>
              {CARRIER_ZONE_MODE_TEXTS[CARRIER_ZONE_MODE.ZIP]}
            </Option>
            <Option
              key={CARRIER_ZONE_MODE.COUNTRY}
              value={CARRIER_ZONE_MODE.COUNTRY}
            >
              {CARRIER_ZONE_MODE_TEXTS[CARRIER_ZONE_MODE.COUNTRY]}
            </Option>
          </Select>
        </Form.Item>
        <Divider orientation="left" plain>
          使用条件
        </Divider>
        <Space size="large">
          <Form.Item name="condition_minWeight">
            <InputNumber
              min={0}
              step="0.01"
              placeholder="最小重量"
              disabled={noCondition}
              precision={2}
            />
          </Form.Item>
          <Form.Item>
            <div>-</div>
          </Form.Item>
          <Form.Item name="condition_maxWeight">
            <InputNumber
              min={0}
              step="0.01"
              placeholder="最大重量"
              disabled={noCondition}
              precision={2}
            />
          </Form.Item>
          <Form.Item name="condition_weightUnit" initialValue={WeightUnit.LB}>
            <Select disabled={noCondition}>
              {Object.values(WeightUnit).map((ele) => {
                return (
                  <Option key={ele} value={ele}>
                    {ele}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Space>
        <Form.Item>
          <Checkbox
            checked={noCondition}
            onChange={() => setNoCondition(!noCondition)}
          >
            适用于所有包裹
          </Checkbox>
        </Form.Item>
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
                      rules={[{ required: true, message: '收费基准必须选' }]}
                    >
                      <Select placeholder="收费基准" style={{ width: '180px' }}>
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
                        if (currentValues.rates && currentValues.rates[index]) {
                          return (
                            ((prevValues.rates === undefined ||
                              prevValues.rates[index] === undefined) &&
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
                      rules={[{ required: true, message: '货币种类必须填' }]}
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
                      rules={[{ required: true, message: '请选择费率模式' }]}
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
    </Modal>
  );
};

export default EditThirdPartyModal;
