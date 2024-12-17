import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Divider,
  Form,
  Image,
  Input,
  PageHeader,
  Select,
  Space,
  Switch,
  Tabs
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { ReactElement, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import {
  createCarrierHandler,
  updateCarrierhandler,
  selectCarrierLoading,
  selectCarriers,
  selectRedirectToCarriersPage
} from '../../redux/carrier/carrierSlice';
import {
  fetchCustomServices,
  selectCustomServices
} from '../../redux/carrier/costumServiceTableSlice';
import {
  Carrier,
  CarrierUpdateData,
  Facility,
  Service
} from '../../shared/types/carrier';
import {
  CARRIERS,
  DHL_ECOMMERCE_SERVICES,
  GET_CARRIER_LOGO,
  UI_ROUTES,
  UPS_SERVICES,
  USPS_SERVICES,
  CARRIER_REGIONS,
  FEDEX_SERVICES,
  RUI_YUN_SERVICES,
  USPS3_SERVICES,
  MAO_YUAN_SERVICES
} from '../../shared/utils/constants';
import CustomServicePanel from '../components/CustomServicePanel';
import PriceTablePanel from '../components/PriceTablePanel';
import ThirdPartyPanel from '../components/ThirdPartyPanel';

const { Option } = Select;
const { TabPane } = Tabs;

const EditCarrierPage = (): ReactElement => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [form] = useForm();
  const { carrierId } = useParams<{ carrierId: string }>();
  const carriers = useSelector(selectCarriers);
  const loading = useSelector(selectCarrierLoading);
  const redirectToCarrierPage = useSelector(selectRedirectToCarriersPage);
  const [isNew, setIsNew] = useState<boolean>(false);
  const [carrierType, setCarrierType] = useState<string>('');
  const [curCarrier, setCurCarrier] = useState<Carrier | undefined>(undefined);
  const [activeSwitch, setActiveSwitch] = useState<boolean>(true);
  const [newAPISwitch, setNewAPISwitch] = useState<boolean>(false);
  const customServices = useSelector(selectCustomServices);

  const renderCarrierServicesIndex = (carrier: Carrier) => {
    let CARRIER_SERVICES: any[] = [];
    switch (carrier.carrierName) {
      case CARRIERS.DHL_ECOMMERCE:
        CARRIER_SERVICES = DHL_ECOMMERCE_SERVICES;
        break;
      case CARRIERS.UPS:
        CARRIER_SERVICES = UPS_SERVICES;
        break;
      case CARRIERS.USPS:
        CARRIER_SERVICES = USPS_SERVICES;
        break;
      case CARRIERS.FEDEX:
        CARRIER_SERVICES = FEDEX_SERVICES;
        break;
      case CARRIERS.RUI_YUN:
        CARRIER_SERVICES = RUI_YUN_SERVICES;
        break;
      case CARRIERS.USPS3:
        CARRIER_SERVICES = USPS3_SERVICES;
        break;
      case CARRIERS.MAO_YUAN:
        CARRIER_SERVICES = MAO_YUAN_SERVICES;
        break;
      default:
        CARRIER_SERVICES = [];
    }
    const serviceIndex = [];
    for (let i = 0; i < carrier.services.length; i += 1) {
      const service = carrier.services[i];
      if (service.key === 'CUSTOM') {
        serviceIndex.push(service.name);
      } else if (
        carrier.carrierName === CARRIERS.RUI_YUN ||
        carrier.carrierName === CARRIERS.USPS3
      ) {
        const index = CARRIER_SERVICES.findIndex(
          (ele) => ele.id === service.id
        );
        serviceIndex.push(index);
      } else {
        const index = CARRIER_SERVICES.findIndex(
          (ele) => ele.key === service.key
        );
        serviceIndex.push(index);
      }
    }
    console.log(serviceIndex);
    return serviceIndex;
  };

  useEffect(() => {
    let newFlag = false;
    const carrierValues = Object.values(CARRIERS);
    for (let i = 0; i < carrierValues.length; i += 1) {
      newFlag = carrierValues[i] === carrierId;
      if (newFlag) break;
    }
    setIsNew(newFlag);
    if (!newFlag) {
      const carrier = carriers.find((ele) => ele.id === carrierId);
      if (carrier) {
        setCurCarrier(carrier);
        setCarrierType(carrier.carrierName);
        setActiveSwitch(carrier.isActive);
        setNewAPISwitch(carrier.isNewAPI);
        dispatch(fetchCustomServices(carrier.id));
        form.setFieldsValue({
          accountName: carrier.accountName,
          description: carrier.description,
          clientId: carrier.clientId,
          clientSecret: carrier.clientSecret,
          regions: carrier.regions,
          services: renderCarrierServicesIndex(carrier)
        });

        if (
          carrier.carrierName === CARRIERS.DHL_ECOMMERCE ||
          carrier.carrierName === CARRIERS.UPS
        ) {
          form.setFieldsValue({
            shipper_name: carrier.returnAddress?.name,
            shipper_company: carrier.returnAddress?.company,
            shipper_street1: carrier.returnAddress?.street1,
            shipper_street2: carrier.returnAddress?.street1,
            shipper_city: carrier.returnAddress?.city,
            shipper_state: carrier.returnAddress?.state,
            shipper_country: carrier.returnAddress?.country,
            shipper_postalCode: carrier.returnAddress?.postalCode,
            shipper_email: carrier.returnAddress?.email,
            shipper_phone: carrier.returnAddress?.phone
          });
        }

        if (carrier.carrierName === CARRIERS.DHL_ECOMMERCE) {
          const facilities = [];
          for (let i = 1; i < carrier.facilities!.length; i += 1) {
            facilities.push(carrier.facilities![i]);
          }
          const firstEle = carrier.facilities![0];

          form.setFieldsValue({
            testClientId: carrier.testClientId,
            testClientSecret: carrier.testClientSecret,
            'pickup-main': firstEle?.pickup,
            'facility-main': firstEle?.facility,
            facilities,
            'test-pickup-main': carrier.testFacilities![0].pickup,
            'test-facility-main': carrier.testFacilities![0].facility
          });
        }

        if (
          carrier.carrierName === CARRIERS.UPS ||
          carrier.carrierName === CARRIERS.RUI_YUN
        ) {
          form.setFieldsValue({
            accountNum: carrier.accountNum,
            accessKey: carrier.accessKey
          });
        }

        if (carrier.carrierName === CARRIERS.MAO_YUAN) {
          form.setFieldsValue({
            accessKey: carrier.accessKey
          });
        }

        if (carrier.carrierName === CARRIERS.FEDEX) {
          form.setFieldsValue({
            accountNum: carrier.accountNum,
            accessKey: carrier.accessKey,
            hubId: carrier.hubId,
            testClientId: carrier.testClientId,
            testClientSecret: carrier.testClientSecret,
            testAccountNum: carrier.testAccountNum,
            testAccessKey: carrier.testAccessKey,
            testHubId: carrier.testHubId
          });
        }
      } else {
        history.push(UI_ROUTES.CARRIERS);
      }
    } else {
      setCarrierType(carrierId);
      setActiveSwitch(true);
    }
  }, [carrierId, carriers, history, isNew, form, dispatch]);

  const buildCarrierUpdateData = (values: any): CarrierUpdateData => {
    let carrierServices: Service[] = [];
    let services: Service[] = [];
    if (carrierType === CARRIERS.DHL_ECOMMERCE) {
      carrierServices = DHL_ECOMMERCE_SERVICES;
    } else if (carrierType === CARRIERS.UPS) {
      carrierServices = UPS_SERVICES;
    } else if (carrierType === CARRIERS.USPS) {
      carrierServices = USPS_SERVICES;
    } else if (carrierType === CARRIERS.FEDEX) {
      carrierServices = FEDEX_SERVICES;
    } else if (carrierType === CARRIERS.RUI_YUN) {
      carrierServices = RUI_YUN_SERVICES;
    } else if (carrierType === CARRIERS.USPS3) {
      carrierServices = USPS3_SERVICES;
    } else if (carrierType === CARRIERS.MAO_YUAN) {
      carrierServices = MAO_YUAN_SERVICES;
    }
    if (carrierServices.length > 0) {
      services = values.services.map((inds: number | string) =>
        typeof inds === 'number'
          ? carrierServices[inds]
          : { key: 'CUSTOM', name: inds }
      );
    }

    const facilities: Facility[] = [];
    if (carrierType === CARRIERS.DHL_ECOMMERCE) {
      facilities.push({
        pickup: values['pickup-main'],
        facility: values['facility-main']
      });
    }
    if (values.facilities) {
      values.facilities.forEach((ele: Facility) => {
        facilities.push(ele);
      });
    }

    const testFacilities: Facility[] = [];
    if (carrierType === CARRIERS.DHL_ECOMMERCE) {
      testFacilities.push({
        pickup: values['test-pickup-main'],
        facility: values['test-facility-main']
      });
    }

    const data: CarrierUpdateData = {
      carrierName: carrierType,
      accountName: values.accountName,
      description: values.description,
      clientId: values.clientId,
      clientSecret: values.clientSecret,
      services,
      regions: values.regions,
      isActive: true,
      isNewAPI: newAPISwitch
    };

    if (carrierType === CARRIERS.DHL_ECOMMERCE) {
      data.facilities = facilities;
      data.testClientId = values.testClientId;
      data.testClientSecret = values.testClientSecret;
      data.testFacilities = testFacilities;
    }

    if (carrierType === CARRIERS.UPS || carrierType === CARRIERS.RUI_YUN) {
      data.accessKey = values.accessKey;
      data.accountNum = values.accountNum;
    }

    if (carrierType === CARRIERS.MAO_YUAN) {
      data.accessKey = values.accessKey;
    }

    if (carrierType === CARRIERS.FEDEX) {
      data.accessKey = values.accessKey;
      data.accountNum = values.accountNum;
      data.hubId = values.hubId;
      data.testClientId = values.testClientId;
      data.testClientSecret = values.testClientSecret;
      data.testAccessKey = values.testAccessKey;
      data.testAccountNum = values.testAccountNum;
      data.testHubId = values.testHubId;
    }

    if (
      carrierType === CARRIERS.DHL_ECOMMERCE ||
      carrierType === CARRIERS.UPS
    ) {
      data.returnAddress = {
        name: values.shipper_name,
        company: values.shipper_company,
        street1: values.shipper_street1,
        street2: values.shipper_street2,
        city: values.shipper_city,
        state: values.shipper_state,
        country: values.shipper_country,
        postalCode: values.shipper_postalCode,
        email: values.shipper_email,
        phone: values.shipper_phone
      };
    }

    if (carrierType === CARRIERS.USPS3) {
      data.clientId = values.clientId;
      data.clientSecret = values.clientSecret;
    }

    return data;
  };

  const addCarrierHandler = () => {
    form.validateFields().then((values) => {
      const data = buildCarrierUpdateData(values);
      dispatch(createCarrierHandler(data));
    });
  };

  const updateClickedHandler = () => {
    form.validateFields().then((values) => {
      const data = buildCarrierUpdateData(values);
      if (curCarrier) {
        const carrierData: Carrier = {
          id: curCarrier?.id,
          ...data
        };
        carrierData.isActive = activeSwitch;
        dispatch(updateCarrierhandler(carrierData));
      }
    });
  };

  const renderCarrierSerivcersOptions = () => {
    const options = [];
    let defaultServices: { label: string; value: number }[] = [];
    if (carrierType === CARRIERS.DHL_ECOMMERCE) {
      defaultServices = DHL_ECOMMERCE_SERVICES.map((service, index) => {
        return { label: `${service.key} - ${service.name}`, value: index };
      });
    }
    if (carrierType === CARRIERS.UPS) {
      defaultServices = UPS_SERVICES.map((service, index) => {
        return { label: service.name, value: index };
      });
    }
    if (carrierType === CARRIERS.USPS) {
      defaultServices = USPS_SERVICES.map((service, index) => {
        return { label: service.name, value: index };
      });
    }
    if (carrierType === CARRIERS.FEDEX) {
      defaultServices = FEDEX_SERVICES.map((service, index) => {
        return { label: service.name, value: index };
      });
    }
    if (carrierType === CARRIERS.RUI_YUN) {
      defaultServices = RUI_YUN_SERVICES.map((service, index) => {
        return { label: `${service.name}-${service.id}`, value: index };
      });
    }
    if (carrierType === CARRIERS.MAO_YUAN) {
      defaultServices = MAO_YUAN_SERVICES.map((service, index) => {
        return { label: `${service.name}-${service.id}`, value: index };
      });
    }
    if (carrierType === CARRIERS.USPS3) {
      defaultServices = USPS3_SERVICES.map((service, index) => {
        return {
          label: `${service.key!}-${service.name}-${service.id}`,
          value: index
        };
      });
    }

    const custServices = customServices
      .filter((item) => item.active)
      .map((service) => {
        return { label: service.name, value: service.name };
      });

    options.push({ label: '默认服务', options: defaultServices });
    options.push({ label: '定制服务', options: custServices });

    return options;
  };

  if (redirectToCarrierPage) {
    return <Redirect to={UI_ROUTES.CARRIERS} />;
  }

  return (
    <>
      <PageHeader
        onBack={() => history.push(`${UI_ROUTES.CARRIERS}`)}
        title={isNew ? '添加物流账号' : curCarrier?.accountName}
      />
      <Divider />
      <Tabs defaultActiveKey="1" size="large" type="card">
        <TabPane tab="账号信息" key="1">
          <div style={{ minWidth: '300px', maxWidth: '720px', margin: 'auto' }}>
            <Space size="large">
              <Image
                width={200}
                height={163.06}
                src={GET_CARRIER_LOGO(carrierType)}
                alt={carrierType}
                preview={false}
              />
              {!isNew && (
                <div>
                  启用开关:{' '}
                  <Switch
                    checkedChildren="启用"
                    unCheckedChildren="停用"
                    checked={activeSwitch}
                    onClick={() => setActiveSwitch(!activeSwitch)}
                  />
                </div>
              )}
              {carrierType === CARRIERS.FEDEX && (
                <div>
                  使用新API:{' '}
                  <Switch
                    checkedChildren="是"
                    unCheckedChildren="否"
                    checked={newAPISwitch}
                    onClick={() => setNewAPISwitch(!newAPISwitch)}
                  />
                </div>
              )}
            </Space>
            <Divider orientation="left" plain>
              账号信息
            </Divider>
            <Form layout="vertical" form={form}>
              <Space size={[10, 2]} style={{ width: '100%' }}>
                <Form.Item
                  style={{ width: '350px' }}
                  label="账号名称"
                  name="accountName"
                  rules={[
                    { required: true, message: '请填写账号名称' },
                    { min: 3, message: '账号名称至少3位' }
                  ]}
                >
                  <Input placeholder="账号名称" disabled={!activeSwitch} />
                </Form.Item>
                <Form.Item
                  style={{ width: '350px' }}
                  label="账号说明"
                  name="description"
                >
                  <Input placeholder="账号说明" disabled={!activeSwitch} />
                </Form.Item>
              </Space>
              <Space size={[10, 2]} style={{ width: '100%' }}>
                <Form.Item
                  style={{ width: '350px' }}
                  label="Client ID (Meter Number, userId)"
                  name="clientId"
                  rules={[
                    { required: true, message: 'Client ID 必须填写' },
                    { min: 3, message: 'Client ID至少3位' }
                  ]}
                >
                  <Input placeholder="Client ID" disabled={!activeSwitch} />
                </Form.Item>
                <Form.Item
                  style={{ width: '350px' }}
                  label="Client Secret (Password, bankerId)"
                  name="clientSecret"
                  rules={[
                    { required: true, message: 'Client Secret 必须填写' },
                    { min: 3, message: 'Client Secret至少3位' }
                  ]}
                >
                  <Input.Password
                    placeholder="Client Secret"
                    disabled={!activeSwitch}
                  />
                </Form.Item>
              </Space>
              {carrierType === CARRIERS.MAO_YUAN && (
                <Space size={[10, 2]} style={{ width: '100%' }}>
                  <Form.Item
                    style={{ width: '350px' }}
                    label="Access Key (plantKey)"
                    name="accessKey"
                    rules={[{ required: true, message: 'Access Key必须填写' }]}
                  >
                    <Input
                      placeholder="Access Key (plantKey)"
                      disabled={!activeSwitch}
                    />
                  </Form.Item>
                </Space>
              )}
              {(carrierType === CARRIERS.UPS ||
                carrierType === CARRIERS.FEDEX ||
                carrierType === CARRIERS.RUI_YUN) && (
                <>
                  <Space size={[10, 2]} style={{ width: '100%' }}>
                    <Form.Item
                      style={{ width: '350px' }}
                      label="Access Key (plantKey)"
                      name="accessKey"
                      rules={[
                        { required: true, message: 'Access Key必须填写' }
                      ]}
                    >
                      <Input
                        placeholder="Access Key (plantKey)"
                        disabled={!activeSwitch}
                      />
                    </Form.Item>
                    <Form.Item
                      style={{ width: '350px' }}
                      label="Account Number"
                      name="accountNum"
                      rules={[
                        { required: true, message: 'Account Number必须填写' },
                        { min: 3, message: 'Account Number至少3位' }
                      ]}
                    >
                      <Input
                        placeholder="Account Number"
                        disabled={!activeSwitch}
                      />
                    </Form.Item>
                  </Space>
                  {carrierType === CARRIERS.FEDEX && (
                    <Space size={[10, 2]} style={{ width: '100%' }}>
                      <Form.Item
                        style={{ width: '350px' }}
                        label="Hub ID"
                        name="hubId"
                        rules={[{ required: true, message: 'Hub ID必须填写' }]}
                      >
                        <Input placeholder="Hub ID" disabled={!activeSwitch} />
                      </Form.Item>
                    </Space>
                  )}
                </>
              )}
              <Space size={[10, 2]} style={{ width: '100%' }}>
                <Form.Item
                  style={{ width: '350px' }}
                  label="Services"
                  name="services"
                  rules={[{ required: true, message: '至少要有一个Service' }]}
                >
                  <Select
                    mode="multiple"
                    optionLabelProp="label"
                    disabled={!activeSwitch}
                    allowClear
                    options={renderCarrierSerivcersOptions()}
                  />
                </Form.Item>
                <Form.Item
                  style={{ width: '350px' }}
                  label="Regions"
                  name="regions"
                  rules={[{ required: true, message: '至少要有一个Region' }]}
                >
                  <Select
                    mode="multiple"
                    optionLabelProp="label"
                    disabled={!activeSwitch}
                    allowClear
                  >
                    {Object.values(CARRIER_REGIONS).map((region) => {
                      return (
                        <Option key={region} value={region} label={region}>
                          {region}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Space>
              {carrierType === CARRIERS.DHL_ECOMMERCE && (
                <>
                  <Space>
                    <Form.Item
                      name="pickup-main"
                      rules={[
                        { required: true, message: 'Pickup Code 必须填写' }
                      ]}
                    >
                      <Input
                        placeholder="Pickup Code"
                        disabled={!activeSwitch}
                      />
                    </Form.Item>
                    <Form.Item
                      name="facility-main"
                      rules={[
                        { required: true, message: 'Facility Code 必须填写' }
                      ]}
                    >
                      <Input
                        placeholder="Facility Code"
                        disabled={!activeSwitch}
                      />
                    </Form.Item>
                  </Space>
                  <Form.List name="facilities">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field) => (
                          <Space
                            key={field.key}
                            style={{ display: 'flex', marginBottom: 8 }}
                            align="baseline"
                          >
                            <Form.Item
                              name={[field.name, 'pickup']}
                              rules={[
                                {
                                  required: true,
                                  message: 'Pickup Code 必须填写'
                                }
                              ]}
                            >
                              <Input
                                placeholder="Pickup Code"
                                disabled={!activeSwitch}
                              />
                            </Form.Item>
                            <Form.Item
                              name={[field.name, 'facility']}
                              rules={[
                                {
                                  required: true,
                                  message: 'Facility Code 必须填写'
                                }
                              ]}
                            >
                              <Input
                                placeholder="Facility Code"
                                disabled={!activeSwitch}
                              />
                            </Form.Item>
                            {activeSwitch && (
                              <MinusCircleOutlined
                                onClick={() => {
                                  remove(field.name);
                                }}
                              />
                            )}
                          </Space>
                        ))}
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => add()}
                            block
                            icon={<PlusOutlined />}
                            disabled={!activeSwitch}
                          >
                            Add Pickup Information
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </>
              )}
              {(carrierType === CARRIERS.DHL_ECOMMERCE ||
                carrierType === CARRIERS.UPS) && (
                <>
                  <Divider orientation="left" plain>
                    {carrierType === CARRIERS.DHL_ECOMMERCE && 'Return Address'}
                    {carrierType === CARRIERS.UPS && 'Shipper'}
                  </Divider>
                  <Space size={[10, 2]} style={{ width: '100%' }}>
                    <Form.Item
                      style={{ width: '350px' }}
                      label="姓名"
                      name="shipper_name"
                      rules={[{ required: true, message: '姓名必须填写' }]}
                    >
                      <Input placeholder="姓名" disabled={!activeSwitch} />
                    </Form.Item>
                    <Form.Item
                      style={{ width: '350px' }}
                      label="公司名称"
                      name="shipper_company"
                    >
                      <Input placeholder="公司名称" disabled={!activeSwitch} />
                    </Form.Item>
                  </Space>
                  <Space size={[10, 2]} style={{ width: '100%' }}>
                    <Form.Item
                      style={{ width: '350px' }}
                      label="地址信息1"
                      name="shipper_street1"
                      rules={[{ required: true, message: '地址信息1必须填写' }]}
                    >
                      <Input placeholder="地址信息1" disabled={!activeSwitch} />
                    </Form.Item>
                    <Form.Item
                      style={{ width: '350px' }}
                      label="地址信息2"
                      name="shipper_street2"
                    >
                      <Input placeholder="地址信息2" disabled={!activeSwitch} />
                    </Form.Item>
                  </Space>
                  <Space size={[10, 2]} style={{ width: '100%' }}>
                    <Form.Item
                      style={{ width: '350px' }}
                      label="城市"
                      name="shipper_city"
                      rules={[{ required: true, message: '城市必须填写' }]}
                    >
                      <Input placeholder="城市" disabled={!activeSwitch} />
                    </Form.Item>
                    <Form.Item
                      style={{ width: '350px' }}
                      label="省份"
                      name="shipper_state"
                      rules={[{ required: true, message: '省份必须填写' }]}
                    >
                      <Input placeholder="省份" disabled={!activeSwitch} />
                    </Form.Item>
                  </Space>
                  <Space size={[10, 2]} style={{ width: '100%' }}>
                    <Form.Item
                      style={{ width: '350px' }}
                      label="国家"
                      name="shipper_country"
                      rules={[{ required: true, message: '国家必须填写' }]}
                    >
                      <Input placeholder="国家" disabled={!activeSwitch} />
                    </Form.Item>
                    <Form.Item
                      style={{ width: '350px' }}
                      label="邮政编码"
                      name="shipper_postalCode"
                      rules={[{ required: true, message: '邮政编码必须填写' }]}
                    >
                      <Input placeholder="邮政编码" disabled={!activeSwitch} />
                    </Form.Item>
                  </Space>
                  <Space size={[10, 2]} style={{ width: '100%' }}>
                    <Form.Item
                      style={{ width: '350px' }}
                      label="邮箱地址"
                      name="shipper_email"
                    >
                      <Input placeholder="邮箱地址" disabled={!activeSwitch} />
                    </Form.Item>
                    <Form.Item
                      style={{ width: '350px' }}
                      label="电话手机"
                      name="shipper_phone"
                      rules={[{ required: true, message: '电话手机必须填写' }]}
                    >
                      <Input placeholder="电话手机" disabled={!activeSwitch} />
                    </Form.Item>
                  </Space>
                </>
              )}
              {(carrierType === CARRIERS.DHL_ECOMMERCE ||
                carrierType === CARRIERS.FEDEX) && (
                <>
                  <Divider orientation="left" plain>
                    测试信息
                  </Divider>
                  <Space size={[10, 2]} style={{ width: '100%' }}>
                    <Form.Item
                      style={{ width: '350px' }}
                      label="Test Client ID (Meter Number)"
                      name="testClientId"
                      rules={[
                        {
                          required: true,
                          message: 'Test Client ID 必须填写'
                        },
                        { min: 3, message: 'Test Client ID至少3位' }
                      ]}
                    >
                      <Input
                        placeholder="Test Client ID"
                        disabled={!activeSwitch}
                      />
                    </Form.Item>
                    <Form.Item
                      style={{ width: '350px' }}
                      label="Test Client Secret"
                      name="testClientSecret"
                      rules={[
                        {
                          required: true,
                          message: 'Test Client Secret 必须填写'
                        },
                        { min: 3, message: 'Test Client Secret至少3位' }
                      ]}
                    >
                      <Input.Password
                        placeholder="Test Client Secret (Password)"
                        disabled={!activeSwitch}
                      />
                    </Form.Item>
                  </Space>
                  {carrierType === CARRIERS.FEDEX && (
                    <>
                      <Space size={[10, 2]} style={{ width: '100%' }}>
                        <Form.Item
                          style={{ width: '350px' }}
                          label="Test Access Key"
                          name="testAccessKey"
                          rules={[
                            {
                              required: true,
                              message: 'Test Access Key必须填写'
                            }
                          ]}
                        >
                          <Input
                            placeholder="Test Access Key"
                            disabled={!activeSwitch}
                          />
                        </Form.Item>
                        <Form.Item
                          style={{ width: '350px' }}
                          label="Test Account Number"
                          name="testAccountNum"
                          rules={[
                            {
                              required: true,
                              message: 'Test Account Number必须填写'
                            },
                            { min: 3, message: 'Test Account Number至少3位' }
                          ]}
                        >
                          <Input
                            placeholder="Test Account Number"
                            disabled={!activeSwitch}
                          />
                        </Form.Item>
                      </Space>
                      <Space size={[10, 2]} style={{ width: '100%' }}>
                        <Form.Item
                          style={{ width: '350px' }}
                          label="Test Hub ID"
                          name="testHubId"
                          rules={[
                            {
                              required: true,
                              message: 'Test Hub ID必须填写'
                            }
                          ]}
                        >
                          <Input
                            placeholder="Test Hub ID"
                            disabled={!activeSwitch}
                          />
                        </Form.Item>
                      </Space>
                    </>
                  )}
                  {carrierType === CARRIERS.DHL_ECOMMERCE && (
                    <Space>
                      <Form.Item
                        name="test-pickup-main"
                        rules={[
                          {
                            required: true,
                            message: 'Test Pickup Code 必须填写'
                          }
                        ]}
                      >
                        <Input
                          placeholder="Test Pickup Code"
                          disabled={!activeSwitch}
                        />
                      </Form.Item>
                      <Form.Item
                        name="test-facility-main"
                        rules={[
                          {
                            required: true,
                            message: 'Test Facility Code 必须填写'
                          }
                        ]}
                      >
                        <Input
                          placeholder="Test Facility Code"
                          disabled={!activeSwitch}
                        />
                      </Form.Item>
                    </Space>
                  )}
                </>
              )}
              <Divider />
              <Form.Item>
                {isNew ? (
                  <Button
                    type="primary"
                    onClick={addCarrierHandler}
                    loading={loading}
                  >
                    添加账号
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    onClick={updateClickedHandler}
                    loading={loading}
                  >
                    保存设置
                  </Button>
                )}
              </Form.Item>
            </Form>
          </div>
        </TabPane>
        {!isNew && curCarrier && (
          <>
            <TabPane tab="三方账号" key="2">
              <ThirdPartyPanel carrier={curCarrier} />
            </TabPane>
            <TabPane tab="价格表" key="3">
              <PriceTablePanel carrier={curCarrier} />
            </TabPane>
            <TabPane tab="定制服务" key="4">
              <CustomServicePanel carrier={curCarrier} />
            </TabPane>
          </>
        )}
      </Tabs>
    </>
  );
};

export default EditCarrierPage;
