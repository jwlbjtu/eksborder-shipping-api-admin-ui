/* eslint-disable react/require-default-props */
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Space,
  Switch
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createCustomService,
  selectModalLoading,
  selectShowModal,
  setShowModal,
  updateCustomService
} from '../../redux/carrier/costumServiceTableSlice';
import {
  Carrier,
  CustomService,
  CustomServiceParams,
  SubService
} from '../../shared/types/carrier';
import { WeightUnit } from '../../shared/utils/constants';

interface Props {
  carrier: Carrier;
  curService?: CustomService;
}

const Option = Select.Option;

const EditCustomServiceModal: React.FC<Props> = ({
  carrier,
  curService
}: Props) => {
  const dispatch = useDispatch();
  const [form] = useForm();
  const showModal = useSelector(selectShowModal);
  const modalLoading = useSelector(selectModalLoading);
  const [active, setActive] = React.useState<boolean>(false);

  useEffect(() => {
    if (curService) {
      form.setFieldsValue({
        name: curService.name,
        description: curService.description,
        services: curService.services.map((item) => {
          const serviceIndex = carrier.services.findIndex(
            (service) => service.key === item.code
          );
          const data: any = {
            service: serviceIndex,
            zipCode: '',
            condition_minWeight: '',
            condition_maxWeight: '',
            condition_weightUnit: WeightUnit.KG,
            isBackup: item.isBackup,
            active: false
          };
          item.conditions.forEach((condition) => {
            if (condition.type === 'zipCode') {
              data.zipCode = condition.fields.value;
            } else if (condition.type === 'weight') {
              data.condition_minWeight = condition.fields.min;
              data.condition_maxWeight = condition.fields.max;
              data.condition_weightUnit = condition.fields.unit;
            }
          });
          return data;
        })
      });
      setActive(curService.active);
    }
  }, [curService, carrier, form]);

  const handleCancelClicked = () => {
    form.resetFields();
    dispatch(setShowModal(false));
  };

  const buildServiceItems = (services: any) => {
    const serviceItems = services.map((item: any) => {
      const serviceIndex = item.service;
      const service = carrier.services[serviceIndex];
      const data: SubService = {
        name: service.name,
        code: service.key,
        conditions: [],
        isBackup: item.isBackup
      };
      if (!item.isBackup) {
        if (item.zipCode) {
          data.conditions.push({
            type: 'zipCode',
            fields: { value: item.zipCode }
          });
        }
        if (item.condition_minWeight || item.condition_maxWeight) {
          data.conditions.push({
            type: 'weight',
            fields: {
              min: item.condition_minWeight,
              max: item.condition_maxWeight,
              unit: item.condition_weightUnit
            }
          });
        }
      }
      return data;
    });
    return serviceItems;
  };

  const handleOkClicked = () => {
    form
      .validateFields()
      .then((values) => {
        console.log(values);
        const services = values.services;
        if (services && services.length > 0) {
          const serviceItems = buildServiceItems(services);
          const customService: CustomServiceParams = {
            name: values.name,
            description: values.description,
            carrierId: carrier.id,
            services: serviceItems,
            active: true
          };
          dispatch(createCustomService(customService));
          form.resetFields();
        } else {
          message.error('请至少添加一个服务');
        }
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const handleUpdateClicked = () => {
    form
      .validateFields()
      .then((values) => {
        console.log(values);
        const services = values.services;
        if (services && services.length > 0) {
          const serviceItems = buildServiceItems(services);
          const customService: CustomServiceParams = {
            _id: curService?._id,
            description: values.description,
            services: serviceItems,
            active
          };
          dispatch(updateCustomService(customService));
          form.resetFields();
        } else {
          message.error('请至少添加一个服务');
        }
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const renderCarrierServiceOptions = () => {
    return carrier.services.map((item, index) => {
      return (
        <Option key={item.key} value={index} label={item.key}>
          {`${item.key} - ${item.name}`}
        </Option>
      );
    });
  };

  return (
    <Modal
      title="定制服务"
      closable={false}
      cancelText="取消"
      onCancel={handleCancelClicked}
      okText="确定"
      onOk={curService ? handleUpdateClicked : handleOkClicked}
      okButtonProps={{ loading: modalLoading }}
      visible={showModal}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="服务名称"
          name="name"
          rules={[{ required: true, message: '服务名称必须填' }]}
        >
          <Input
            placeholder="账号服务名称名称"
            type="text"
            disabled={!!curService}
          />
        </Form.Item>
        <Form.Item label="服务说明" name="description">
          <Input placeholder="账号服务名称名称" type="text" />
        </Form.Item>
        <Divider orientation="left" plain>
          服务及条件
        </Divider>
        <Form.List name="services">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }) => (
                <div key={key}>
                  <Form.Item name={[name, 'service']}>
                    <Select placeholder="请选择服务">
                      {renderCarrierServiceOptions()}
                    </Select>
                  </Form.Item>
                  <Form.Item name={[name, 'isBackup']} valuePropName="checked">
                    <Checkbox>备用服务</Checkbox>
                  </Form.Item>
                  <Space size="large">
                    <Form.Item name={[name, 'condition_minWeight']}>
                      <InputNumber
                        min={0}
                        step="0.01"
                        placeholder="最小重量"
                        precision={2}
                      />
                    </Form.Item>
                    <Form.Item>
                      <div>-</div>
                    </Form.Item>
                    <Form.Item name={[name, 'condition_maxWeight']}>
                      <InputNumber
                        min={0}
                        step="0.01"
                        placeholder="最大重量"
                        precision={2}
                      />
                    </Form.Item>
                    <Form.Item
                      name={[name, 'condition_weightUnit']}
                      initialValue={WeightUnit.LB}
                    >
                      <Select>
                        {Object.values(WeightUnit).map((ele) => {
                          return (
                            <Option key={ele} value={ele}>
                              {ele}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                    <MinusCircleOutlined
                      onClick={() => {
                        remove(name);
                      }}
                    />
                  </Space>
                  <Form.Item name={[name, 'zipCode']} label="邮编条件">
                    <Input placeholder="输入邮编收尾数字" />
                  </Form.Item>
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
                  添加服务
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        {curService && (
          <Switch
            checkedChildren="启用"
            unCheckedChildren="禁用"
            checked={active}
            onChange={(checked) => {
              setActive(checked);
            }}
          />
        )}
      </Form>
    </Modal>
  );
};

export default EditCustomServiceModal;
