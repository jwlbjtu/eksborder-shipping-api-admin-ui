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
import DHLeComCreationForm from '../components/DHLeCommerce/DHLeComCreationForm';
import {
  CARRIERS,
  GET_CARRIER_LOGO,
  DEFAULT_ADDRESS_FORM_DATA,
  CARRIERS_SAMPLE_DATA
} from '../../shared/utils/constants';

const Carriers = (): ReactElement => {
  const [carriersData, setCarriersData] = useState<any[]>([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [showCarriersList, setShowCarriersList] = useState(false);
  const [addCarrierModalInfo, setAddCarrierModalInfo] = useState({
    carrier: '',
    logo: '',
    visible: false
  });
  const [addCarrierForm, setAddCarrierForm] = useState<ReactElement | null>(
    null
  );

  useEffect(() => {
    // Call back end to get data
    setCarriersData(CARRIERS_SAMPLE_DATA);
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
        record.status = record.status === 'active' ? 'inactive' : 'active';
      }
      setCarriersData(newData);
      setTableLoading(false);
    }, 2000);
  };

  const showCarriersListHandler = () => setShowCarriersList(true);
  const hideCarriersListHandler = () => setShowCarriersList(false);

  const showAddCarrierModalHandler = (carrier: string) => {
    if (carrier === CARRIERS.DHL_ECOMMERCE) {
      setAddCarrierForm(
        <DHLeComCreationForm data={DEFAULT_ADDRESS_FORM_DATA} />
      );
    }
    const info = {
      carrier,
      logo: GET_CARRIER_LOGO(carrier),
      visible: true
    };
    setAddCarrierModalInfo(info);
    setShowCarriersList(false);
  };
  const addCarrierModalBackHandler = () => {
    setAddCarrierModalInfo({ ...addCarrierModalInfo, visible: false });
    setShowCarriersList(true);
    setAddCarrierForm(null);
  };
  const addCarrierModalCancelHandler = () => {
    setAddCarrierModalInfo({ ...addCarrierModalInfo, visible: false });
    setAddCarrierForm(null);
  };
  const addCarrierModalOkHandler = () => {
    alert('OK Clicked');
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
      dataIndex: 'status',
      key: 'status',
      render: (text: string, record: any) => (
        <Switch
          checkedChildren="启用"
          unCheckedChildren="停用"
          defaultChecked
          checked={text === 'active'}
          onClick={() => statusChangeHandler(record.key)}
        />
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (text: string, record: any) => (
        <Space size="small">
          <Button size="small" type="link">
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
      <AddCarrierModal
        carrier={addCarrierModalInfo.carrier}
        logo={addCarrierModalInfo.logo}
        visible={addCarrierModalInfo.visible}
        backClicked={addCarrierModalBackHandler}
        cancelCliecked={addCarrierModalCancelHandler}
        okClicked={addCarrierModalOkHandler}
      >
        {addCarrierForm}
      </AddCarrierModal>
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
