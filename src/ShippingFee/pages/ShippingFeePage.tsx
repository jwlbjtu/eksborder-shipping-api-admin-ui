import {
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Form,
  Input,
  InputNumber,
  PageHeader,
  Row,
  Select,
  Space,
  Statistic
} from 'antd';
import React, { useEffect } from 'react';
import {
  DollarOutlined,
  MinusCircleOutlined,
  PlusOutlined
} from '@ant-design/icons';
import DescriptionsItem from 'antd/lib/descriptions/Item';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'antd/lib/form/Form';
import {
  fetchUsersByRoleHandler,
  selectClientUsers
} from '../../redux/user/userDataSlice';
import {
  checkRateHanlder,
  selectLoading,
  selectRates
} from '../../redux/shippingRate/shippingRateSlice';
import { UserShippingRateRequest } from '../../shared/types/redux-types';
import {
  Country,
  COUNTRY_NAMES,
  USER_ROLES
} from '../../shared/utils/constants';
import {
  fetchUserCarriersHandler,
  selectUserCarreirs
} from '../../redux/user/userCarrierSlice';

const ShippingFeePage = () => {
  const dispatch = useDispatch();
  const [form] = useForm();
  const clientUsers = useSelector(selectClientUsers);
  const carriers = useSelector(selectUserCarreirs);
  const loading = useSelector(selectLoading);
  const rates = useSelector(selectRates);

  useEffect(() => {
    dispatch(fetchUsersByRoleHandler(USER_ROLES.API_USER));
  }, [dispatch]);

  const clientUserSelectedHandler = (value: string) => {
    // console.log(value);
    dispatch(fetchUserCarriersHandler(value));
  };

  const searchRateHandler = () => {
    form.validateFields().then((values) => {
      console.log(values);
      const req: UserShippingRateRequest = {
        channel: values.channel,
        toAddress: {
          name: '',
          company: '',
          email: '',
          phone: '',
          street1: values.street1,
          street2: values.street2,
          city: values.city,
          state: values.state,
          zip: values.zip,
          country: values.country
        },
        packageList: values.packages.map((p: any) => ({
          weight: p.weight,
          length: p.length,
          width: p.width,
          height: p.height
        }))
      };
      dispatch(checkRateHanlder(req, values.userId));
    });
  };

  return (
    <div>
      <PageHeader title="费用查询" />
      <Row>
        <Col span={11}>
          <Form form={form} layout="vertical">
            <Space direction="vertical" style={{ width: 600 }}>
              <Row gutter={10}>
                <Col span={12}>
                  <Form.Item
                    label="选择客户"
                    name="userId"
                    rules={[{ required: true, message: '需要客户' }]}
                  >
                    <Select onChange={clientUserSelectedHandler}>
                      {clientUsers.map((user) => (
                        <Select.Option key={user.id} value={user.id}>
                          {user.userName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="地址1"
                    name="street1"
                    rules={[{ required: true, message: '需要地址1' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="城市"
                    name="city"
                    rules={[{ required: true, message: '需要城市' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="邮编"
                    name="zip"
                    rules={[{ required: true, message: '需要邮编' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="选择渠道"
                    name="channel"
                    rules={[{ required: true, message: '需要渠道' }]}
                  >
                    <Select>
                      {carriers.map((account) => (
                        <Select.Option
                          key={account.id}
                          value={account.accountId}
                        >
                          {account.accountId}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item label="地址2" name="street2">
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="州"
                    name="state"
                    rules={[{ required: true, message: '需要州' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="国家"
                    name="country"
                    initialValue={Country.USA}
                    rules={[{ required: true, message: '需要国家' }]}
                  >
                    <Select>
                      <Select.Option value={Country.USA}>
                        {COUNTRY_NAMES[Country.USA]}
                      </Select.Option>
                      <Select.Option value={Country.CHINA}>
                        {COUNTRY_NAMES[Country.CHINA]}
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <div>
                <Form.List name="packages">
                  {(fields, { add, remove }) => {
                    return (
                      <div>
                        {fields.map((field) => (
                          <div key={`${field.name}_${field.key}`}>
                            <Space>
                              <Form.Item
                                label="重量(LB)"
                                name={[field.name, 'weight']}
                                initialValue={1}
                                rules={[
                                  { required: true, message: '需要重量' }
                                ]}
                              >
                                <InputNumber min={0} step={0.1} />
                              </Form.Item>
                              <Form.Item
                                label="长(IN)"
                                name={[field.name, 'length']}
                                initialValue={1}
                              >
                                <InputNumber min={0} step={0.1} />
                              </Form.Item>
                              <Form.Item
                                label="宽(IN)"
                                name={[field.name, 'width']}
                                initialValue={1}
                              >
                                <InputNumber min={0} step={0.1} />
                              </Form.Item>
                              <Form.Item
                                label="高(IN)"
                                name={[field.name, 'height']}
                                initialValue={1}
                              >
                                <InputNumber min={0} step={0.1} />
                              </Form.Item>
                              <MinusCircleOutlined
                                style={{ fontSize: '14px' }}
                                className="dynamic-delete-button"
                                onClick={() => {
                                  remove(field.name);
                                }}
                              />
                            </Space>
                          </div>
                        ))}

                        <Row style={{ marginBottom: '24px' }}>
                          <Col push={4} xl={16}>
                            <Form.Item>
                              <Button
                                type="dashed"
                                onClick={() => {
                                  add();
                                }}
                                style={{ width: '100%' }}
                              >
                                <PlusOutlined /> 添加包裹
                              </Button>
                            </Form.Item>
                          </Col>
                        </Row>
                      </div>
                    );
                  }}
                </Form.List>
              </div>
              <Button
                key="submit"
                type="primary"
                onClick={searchRateHandler}
                loading={loading}
              >
                查询价格
              </Button>
            </Space>
          </Form>
        </Col>
        <Col span={11}>
          <Card bordered={false} title="物流收费">
            <Statistic
              title="总费用"
              value={(rates.baseRate + rates.fee).toFixed(2)}
              precision={2}
              prefix={<DollarOutlined />}
            />
            <Divider />
            <div>
              {rates.details && (
                <Space direction="vertical">
                  <Descriptions title="费用详情" column={1}>
                    <DescriptionsItem label="计费重量">
                      {`${rates.details.billingWeight} LB`}
                    </DescriptionsItem>
                    <DescriptionsItem label="报价区域">
                      {rates.details.rateZone}
                    </DescriptionsItem>
                    <DescriptionsItem label="总运费">
                      {rates.details.baseCharge}
                    </DescriptionsItem>
                    <DescriptionsItem label="折扣费">
                      {rates.details.totalFreightDiscount}
                    </DescriptionsItem>
                    <DescriptionsItem label="净运费">
                      {rates.details.netFreight}
                    </DescriptionsItem>
                    <DescriptionsItem label="附加费">
                      {rates.details.totalSurcharges}
                    </DescriptionsItem>
                    <DescriptionsItem label="底价费用">
                      {rates.details.netFedExCharge}
                    </DescriptionsItem>
                    <DescriptionsItem label="渠道商收费">
                      {rates.details.actualAmount}
                    </DescriptionsItem>
                    <DescriptionsItem label="美联发佣金">
                      {rates.fee.toFixed(2)}
                    </DescriptionsItem>
                  </Descriptions>
                  <Descriptions title="附加费清单" column={1}>
                    {rates.details.surCharges.map((charge: any) => (
                      <DescriptionsItem label={charge.description}>
                        ${charge.amount}
                      </DescriptionsItem>
                    ))}
                  </Descriptions>
                </Space>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ShippingFeePage;
