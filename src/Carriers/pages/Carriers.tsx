import React, { ReactElement, useContext, useEffect, useState } from 'react';
import {
  PageHeader,
  Button,
  Table,
  Space,
  Divider,
  Switch,
  Popconfirm
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import CarriersList from '../components/AddAccount/CarriersLists';
import AddCarrierModal from '../components/AddAccount/AddCarrierModal';
import UpdateCarrierModal from '../components/UpdateAccount/UpdateCarrierModal';
import axios from '../../shared/utils/axios-base';

import { GET_CARRIER_LOGO, SERVER_ROUTES } from '../../shared/utils/constants';
import errorHandler from '../../shared/utils/errorHandler';
import {
  Carrier,
  CarrierCreateData,
  CarrierUpdateData
} from '../../shared/types/carrier';
import AuthContext from '../../shared/components/context/auth-context';

const Carriers = (): ReactElement => {
  const auth = useContext(AuthContext);
  const [carriersData, setCarriersData] = useState<Carrier[]>([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [showCarriersList, setShowCarriersList] = useState(false);
  const [addCarrierModal, setAddCarrierModal] = useState<ReactElement | null>(
    null
  );
  const [
    updateCarrierModal,
    setUpdateCarrierModal
  ] = useState<ReactElement | null>(null);

  useEffect(() => {
    setTableLoading(true);
    axios
      .get(SERVER_ROUTES.CARRIER, {
        headers: {
          Authorization: `${auth.userData?.token_type} ${auth.userData?.token}`
        }
      })
      .then((response) => {
        setCarriersData(response.data);
      })
      .catch((error) => {
        errorHandler(error);
        // TODO: if 401 Unauthorized logout user
      })
      .finally(() => setTableLoading(false));
  }, [auth]);

  const deleteAccountHandler = async (id: string) => {
    setTableLoading(true);
    try {
      await axios.delete(`${SERVER_ROUTES.CARRIER}/${id}`, {
        headers: {
          Authorization: `${auth.userData?.token_type} ${auth.userData?.token}`
        }
      });
      const newData = carriersData.filter((item) => item.id !== id);
      setCarriersData(newData);
    } catch (error) {
      // TODO: if 401 Unauthorized logout user
      errorHandler(error);
    } finally {
      setTableLoading(false);
    }
  };

  const statusChangeHandler = async (active: boolean, value: Carrier) => {
    setTableLoading(true);
    try {
      const data = { ...value, isActive: active };
      const response = await axios.put(SERVER_ROUTES.CARRIER, data, {
        headers: {
          Authorization: `${auth.userData?.token_type} ${auth.userData?.token}`
        }
      });
      const updatedCarrier = response.data;
      const newData = [...carriersData];
      const record = newData.find((item) => item.id === updatedCarrier.id);
      if (record) {
        record.isActive = updatedCarrier.isActive;
        setCarriersData(newData);
      }
    } catch (error) {
      // TODO: if 401 Unauthorized logout user
      errorHandler(error);
    } finally {
      setTableLoading(false);
    }
  };

  const showCarriersListHandler = () => setShowCarriersList(true);
  const hideCarriersListHandler = () => setShowCarriersList(false);

  const addCarrierModalBackHandler = () => {
    setAddCarrierModal(null);
    setShowCarriersList(true);
  };
  const addCarrierModalCancelHandler = () => {
    setAddCarrierModal(null);
  };
  const addCarrierModalOkHandler = async (values: CarrierCreateData) => {
    setAddCarrierModal(null);
    setTableLoading(true);
    try {
      const response = await axios.post(SERVER_ROUTES.CARRIER, values, {
        headers: {
          Authorization: `${auth.userData?.token_type} ${auth.userData?.token}`
        }
      });
      const newCarrier = response.data;
      const newData = [...carriersData, newCarrier];
      setCarriersData(newData);
    } catch (error) {
      // TODO: if 401 Unauthorized logout user
      errorHandler(error);
    } finally {
      setTableLoading(false);
    }
  };

  const showAddCarrierModalHandler = (carrier: string) => {
    setShowCarriersList(false);
    setAddCarrierModal(
      <AddCarrierModal
        carrier={carrier}
        logo={GET_CARRIER_LOGO(carrier)}
        visible
        backClicked={addCarrierModalBackHandler}
        cancelCliecked={addCarrierModalCancelHandler}
        okClicked={addCarrierModalOkHandler}
      />
    );
  };

  const hideUpdateCarrierModal = () => {
    setUpdateCarrierModal(null);
  };
  const updateCarrierModalOkHandler = async (
    id: string,
    values: CarrierUpdateData
  ) => {
    setUpdateCarrierModal(null);
    setTableLoading(true);
    try {
      const response = await axios.put(
        SERVER_ROUTES.CARRIER,
        {
          id,
          ...values
        },
        {
          headers: {
            Authorization: `${auth.userData?.token_type} ${auth.userData?.token}`
          }
        }
      );
      const updatedCarrier = response.data;

      const newData = [...carriersData];
      const carrier = newData.find((item) => item.id === id);
      if (carrier) {
        Object.keys(updatedCarrier).forEach((keyId) => {
          // @ts-expect-error: igore
          carrier[keyId] = updatedCarrier[keyId];
        });
        setCarriersData(newData);
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setTableLoading(false);
    }
  };

  const showUpdateCarrierModal = (record: Carrier) => {
    setUpdateCarrierModal(
      <UpdateCarrierModal
        data={record}
        visible
        cancelClicked={hideUpdateCarrierModal}
        okClicked={updateCarrierModalOkHandler}
      />
    );
  };

  const columns = [
    {
      title: '',
      key: 'logo',
      render: (text: string, record: Carrier) => {
        const logo = GET_CARRIER_LOGO(record.carrierName);
        return <img className="logo" src={logo} alt={record.carrierName} />;
      }
    },
    {
      title: '物流公司',
      dataIndex: 'carrierName',
      key: 'carrierName'
    },
    {
      title: '账号名称',
      dataIndex: 'accountName',
      key: 'accountName'
    },
    {
      title: '账号说明',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (value: boolean, record: Carrier) => (
        <Switch
          checkedChildren="启用"
          unCheckedChildren="停用"
          defaultChecked
          checked={value}
          onClick={() => statusChangeHandler(!value, record)}
        />
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (text: string, record: Carrier) => (
        <Space size={0} split={<Divider type="vertical" />}>
          <Button
            size="small"
            type="link"
            onClick={() => showUpdateCarrierModal(record)}
          >
            修改
          </Button>
          <Popconfirm
            title="确认删除该账号?"
            placement="topRight"
            onConfirm={() => deleteAccountHandler(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button size="small" type="link">
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div>
      <CarriersList
        visible={showCarriersList}
        handleCancel={hideCarriersListHandler}
        imageClicked={showAddCarrierModalHandler}
      />
      {addCarrierModal}
      {updateCarrierModal}
      <PageHeader
        title="物流账号"
        subTitle="管理EksShipping的物流账号"
        extra={[
          <Button
            key="1"
            type="primary"
            icon={<PlusOutlined />}
            onClick={showCarriersListHandler}
          >
            添加账号
          </Button>
        ]}
      />
      <Divider />
      <Table
        rowKey={(record: Carrier) => record.id}
        columns={columns}
        dataSource={carriersData}
        pagination={false}
        loading={tableLoading}
      />
    </div>
  );
};

export default Carriers;
