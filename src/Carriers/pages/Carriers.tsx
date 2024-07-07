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
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import CarriersList from '../components/CarriersLists';
import {
  CARRIERS,
  GET_CARRIER_LOGO,
  UI_ROUTES
} from '../../shared/utils/constants';
import { Carrier } from '../../shared/types/carrier';
import {
  deleteCarrierHandler,
  fetchCarriersHandler,
  selectCarrierLoading,
  selectCarriers,
  setRedirectToCarriers,
  setShowCarrierList,
  updateCarrierhandler
} from '../../redux/carrier/carrierSlice';

const Carriers = (): ReactElement => {
  const dispatch = useDispatch();
  const history = useHistory();
  const carriers = useSelector(selectCarriers);
  const loading = useSelector(selectCarrierLoading);

  useEffect(() => {
    dispatch(fetchCarriersHandler());
    dispatch(setRedirectToCarriers(false));
  }, [dispatch]);

  const deleteAccountHandler = async (id: string) => {
    dispatch(deleteCarrierHandler(id));
  };

  const statusChangeHandler = async (active: boolean, value: Carrier) => {
    const data: Carrier = { ...value, isActive: active };
    dispatch(updateCarrierhandler(data));
  };

  const showAddCarrierModalHandler = (carrier: string) => {
    dispatch(setShowCarrierList(false));
    // setSelectedCarrier(carrier);
    // dispatch(setShowAddModal(true));
    history.push(`/carriers/${carrier}`);
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
      title: '物流服务',
      dataIndex: 'servies',
      key: 'services',
      render: (text: string, record: Carrier): string => {
        if (record.carrierName === CARRIERS.RUI_YUN) {
          return record.services.map((ele) => ele.name).join(', ');
        }
        return record.services.map((ele) => ele.key).join(', ');
      }
    },
    {
      title: '服务范围',
      dataIndex: 'regions',
      key: 'regions',
      render: (text: string, record: Carrier): string => {
        return record.regions.join(', ');
      }
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
            onClick={() => history.push(`${UI_ROUTES.CARRIERS}/${record.id}`)}
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
      <CarriersList imageClicked={showAddCarrierModalHandler} />
      <PageHeader
        title="物流账号"
        subTitle="管理EksShipping的物流账号"
        extra={[
          <Button
            key="1"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => dispatch(setShowCarrierList(true))}
          >
            添加账号
          </Button>
        ]}
      />
      <Divider />
      <Table<Carrier>
        rowKey={(record: Carrier) => record.id}
        columns={columns}
        dataSource={carriers}
        pagination={false}
        loading={loading}
      />
    </div>
  );
};

export default Carriers;
