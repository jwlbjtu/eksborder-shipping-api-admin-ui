import _ from 'lodash';
import React, { ReactElement, useEffect, useState } from 'react';
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

import {
  GET_CARRIER_LOGO,
  CARRIERS_SAMPLE_DATA
} from '../../shared/utils/constants';

const Carriers = (): ReactElement => {
  const [carriersData, setCarriersData] = useState<any[]>([]);
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
    // TODO: Call back end to get data
    setTableLoading(true);
    setTimeout(() => {
      setCarriersData(CARRIERS_SAMPLE_DATA);
      setTableLoading(false);
    }, 1000);
  }, []);

  const deleteAccountHandler = (key: number) => {
    // TODO: connect to backend
    setTableLoading(true);
    setTimeout(() => {
      const newData = carriersData.filter((item) => item.key !== key);
      setCarriersData(newData);
      setTableLoading(false);
    }, 2000);
  };

  const statusChangeHandler = (key: number) => {
    // TODO: connect to backend
    setTableLoading(true);
    setTimeout(() => {
      const newData = [...carriersData];
      const record = newData.find((item) => item.key === key);
      if (record) {
        record.active = !record.active;
      }
      setCarriersData(newData);
      setTableLoading(false);
    }, 2000);
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
  const addCarrierModalOkHandler = (values: any) => {
    setAddCarrierModal(null);
    setTableLoading(true);
    const account = {
      ...values,
      key: 99,
      active: true
    };
    // TODO: connect to backend
    setTimeout(() => {
      const newData = [...carriersData, account];
      setCarriersData(newData);
      setTableLoading(false);
    }, 2000);
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
  const updateCarrierModalOkHandler = (values: any) => {
    setUpdateCarrierModal(null);
    setTableLoading(true);
    const omitList = ['clientId'];
    if (!values.password) omitList.push('clientSecret');
    const account = _.omit(values, omitList);
    // TODO: connect to backend
    setTimeout(() => {
      const newData = [...carriersData];
      // @ts-expect-error: not a type issue
      const carrier = newData.find((item) => item.key === account.key);
      Object.keys(account).forEach((keyId) => {
        // @ts-expect-error: not a type issue
        carrier[keyId] = account[keyId];
      });
      setCarriersData(newData);
      setTableLoading(false);
    }, 2000);
  };

  const showUpdateCarrierModal = (record: any) => {
    setUpdateCarrierModal(
      <UpdateCarrierModal
        data={_.omit(record, ['clientId', 'clientSecret'])}
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
      render: (text: string, record: any) => {
        const logo = GET_CARRIER_LOGO(record.carrier);
        return <img className="logo" src={logo} alt={record.carrier} />;
      }
    },
    {
      title: '物流公司',
      dataIndex: 'carrier',
      key: 'carrier'
    },
    {
      title: '账号名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '账号说明',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: '状态',
      dataIndex: 'active',
      key: 'active',
      render: (text: string, record: any) => (
        <Switch
          checkedChildren="启用"
          unCheckedChildren="停用"
          defaultChecked
          checked={record.active}
          onClick={() => statusChangeHandler(record.key)}
        />
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (text: string, record: any) => (
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
            onConfirm={() => deleteAccountHandler(record.key)}
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
        columns={columns}
        dataSource={carriersData}
        pagination={false}
        loading={tableLoading}
      />
    </div>
  );
};

export default Carriers;
