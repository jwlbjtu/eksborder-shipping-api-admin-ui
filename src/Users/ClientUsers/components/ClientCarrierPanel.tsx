import React, { ReactElement, useEffect, useState } from 'react';
import {
  PageHeader,
  Table,
  Divider,
  Button,
  Switch,
  Space,
  Popconfirm,
  Tag
} from 'antd';
import { CheckCircleTwoTone, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import ClientConnectCarrierForm from './ClientConnectCarrierForm';
import ClientUpdateCarrierForm from './ClientUpdateCarrierForm';
import { CreateUserCarrierData, UserCarrier } from '../../../shared/types/user';
import {
  selectUserCarreirs,
  selectUserCarrierLoading,
  fetchUserCarriersHandler,
  deleteUserCarrierHandler,
  updateUserCarrierHandler,
  createUserCarrierHandler,
  setShowUpdateUserCarrer,
  setShowUserCarrer
} from '../../../redux/user/userCarrierSlice';
import { FeeRate, Service } from '../../../shared/types/carrier';
import { displayRate } from '../../../shared/utils/helpers';
import { CARRIERS } from '../../../shared/utils/constants';

interface ClientCarrierPanelProps {
  id: string;
}

const ClientCarrierPanel = ({ id }: ClientCarrierPanelProps): ReactElement => {
  const dispatch = useDispatch();
  const data = useSelector(selectUserCarreirs);
  const loading = useSelector(selectUserCarrierLoading);
  const [selectedCarrier, setSelectedCarrier] = useState<
    UserCarrier | undefined
  >();

  useEffect(() => {
    setSelectedCarrier(undefined);
    dispatch(fetchUserCarriersHandler(id));
  }, [id, dispatch]);

  const statusChangeHandler = async (active: boolean, values: UserCarrier) => {
    const updateData = { id: values.id, isActive: active };
    dispatch(updateUserCarrierHandler(id, updateData));
  };

  const createHandler = async (values: CreateUserCarrierData) => {
    const account: CreateUserCarrierData = {
      ...values,
      userRef: id
    };
    dispatch(createUserCarrierHandler(id, account));
  };

  const updateHandler = async (values: UserCarrier) => {
    setSelectedCarrier(undefined);
    dispatch(updateUserCarrierHandler(id, values));
  };

  const updateCanceled = () => {
    setSelectedCarrier(undefined);
    dispatch(setShowUpdateUserCarrer(false));
  };

  const showUpdateForm = (record: UserCarrier) => {
    setSelectedCarrier(record);
    dispatch(setShowUpdateUserCarrer(true));
  };

  const columns = [
    {
      title: '账号名称',
      key: 'accountName',
      dataIndex: 'accountName'
    },
    {
      title: '渠道号',
      key: 'accountId',
      dataIndex: 'accountId'
    },
    {
      title: '物流公司',
      key: 'carrier',
      dataIndex: 'carrier'
    },
    {
      title: '关联账号',
      key: 'connectedAccount',
      dataIndex: 'connectedAccount'
    },
    {
      title: '物流服务',
      key: 'service',
      dataIndex: 'service',
      render: (service: Service, record: UserCarrier) => {
        if (record.carrier === CARRIERS.RUI_YUN) {
          return `${service.name}-${service.id}`;
        }
        return `${service.key}-${service.id}`;
      }
    },
    {
      title: '操作中心',
      key: 'facility',
      dataIndex: 'facility',
      render: (facility: string[] | undefined) => {
        if (!facility) return '-';
        return facility;
      }
    },
    {
      title: '三方价格',
      dataIndex: 'thirdpartyPrice',
      key: 'thirdpartyPrice',
      render: (thirdpartyPrice: boolean) => {
        return thirdpartyPrice ? (
          <CheckCircleTwoTone twoToneColor="#52c41a" />
        ) : null;
      }
    },
    {
      title: '支付方式',
      dataIndex: 'payOffline',
      render: (payOffline: boolean) => {
        return payOffline ? (
          <Tag color="yellow">线下支付</Tag>
        ) : (
          <Tag color="green">线上支付</Tag>
        );
      }
    },
    {
      title: '费率',
      key: 'rates',
      dataIndex: 'rates',
      render: (rates: FeeRate[], record: UserCarrier) => {
        if (record.rates && record.rates.length > 0) {
          const result = record.rates.map((rate) => (
            <div>{displayRate(rate)}</div>
          ));
          return result;
        }
        return '-';
      }
    },
    {
      title: '备注',
      key: 'note',
      dataIndex: 'note'
    },
    {
      title: '更新日期',
      key: 'updatedAt',
      dataIndex: 'updatedAt',
      render: (date: string) => {
        return (
          <Space direction="vertical" size="small">
            <div>{dayjs(date).format('YYYY/MM/DD')}</div>
            <div>{dayjs(date).format('HH:mm:ss')}</div>
          </Space>
        );
      }
    },
    {
      title: '状态',
      key: 'isActive',
      dataIndex: 'isActive',
      render: (active: boolean, record: UserCarrier) => (
        <Switch
          checkedChildren="启用"
          unCheckedChildren="停用"
          defaultChecked
          checked={active}
          onClick={() => statusChangeHandler(!active, record)}
        />
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (text: string, record: UserCarrier) => (
        <Space size={0} split={<Divider type="vertical" />}>
          <Button
            size="small"
            type="link"
            onClick={() => showUpdateForm(record)}
          >
            修改
          </Button>
          <Popconfirm
            title="确认删除该账号?"
            placement="topRight"
            onConfirm={() => dispatch(deleteUserCarrierHandler(id, record.id))}
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
      <ClientConnectCarrierForm onOk={createHandler} />
      {selectedCarrier && (
        <ClientUpdateCarrierForm
          data={selectedCarrier}
          onOk={updateHandler}
          onCancel={updateCanceled}
        />
      )}
      <PageHeader
        title=""
        subTitle=""
        extra={
          <Button
            key="1"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => dispatch(setShowUserCarrer(true))}
          >
            关联物流账号
          </Button>
        }
      />
      <Table<UserCarrier>
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={data}
        pagination={false}
        loading={loading}
        scroll={{ x: true }}
      />
    </div>
  );
};

export default ClientCarrierPanel;
