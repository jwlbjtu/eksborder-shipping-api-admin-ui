import { DownOutlined, PlusOutlined, SyncOutlined } from '@ant-design/icons';
import {
  Button,
  Divider,
  Dropdown,
  Menu,
  PageHeader,
  Popconfirm,
  Space,
  Table
} from 'antd';
import React, { ReactElement, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  deletePriceTableAccountHandler,
  fetchPriceTableAccounts,
  selectAccounts,
  selectPriceTableLoading,
  setPriceModalShow,
  setPriceTableModalShow,
  setShowModal,
  setZoneModalShow
} from '../../redux/carrier/priceTableSlice';
import {
  Carrier,
  FeeRate,
  PriceTable,
  Service,
  ThirdPartyCondition
} from '../../shared/types/carrier';
import {
  CARRIER_REGIONS_TEXTS,
  GET_CARRIER_LOGO
} from '../../shared/utils/constants';
import { displayRate } from '../../shared/utils/helpers';
import EditPriceTableModal from './EditPriceTableModal';
import EditPriceTableZoneMapModal from './EditPriceTableZoneMapModal';
import PriceTablePriceUploadModal from './PriceTablePriceUploadModal';
import ViewPriceModal from './ViewPriceModal';
import ViewPriceTableModal from './ViewPriceTableModal';

interface PriceTablePanelProps {
  carrier: Carrier;
}

const PriceTablePanel = ({ carrier }: PriceTablePanelProps): ReactElement => {
  const dispatch = useDispatch();
  const accounts = useSelector(selectAccounts);
  const loading = useSelector(selectPriceTableLoading);
  const [curAccount, setCurAccount] = useState<PriceTable | undefined>();

  useEffect(() => {
    dispatch(fetchPriceTableAccounts(carrier.id));
    setCurAccount(undefined);
  }, [dispatch, carrier]);

  const addClickedHandler = () => {
    setCurAccount(undefined);
    dispatch(setShowModal(true));
  };

  const editClickedHandler = (record: PriceTable) => {
    setCurAccount(record);
    dispatch(setShowModal(true));
  };

  const showPriceUploadHandler = (record: PriceTable) => {
    setCurAccount(record);
    dispatch(setPriceModalShow(true));
  };

  const showPriceTableHandler = (record: PriceTable) => {
    setCurAccount(record);
    dispatch(setPriceTableModalShow(true));
  };

  const showZoneMapModalHandler = (record: PriceTable) => {
    setCurAccount(record);
    dispatch(setZoneModalShow(true));
  };

  const menu = (record: PriceTable) => (
    <Menu>
      <Menu.Item key="0">
        <Button
          type="link"
          size="small"
          onClick={() => showPriceUploadHandler(record)}
        >
          上传价格
        </Button>
      </Menu.Item>
      {record.price && record.price.data.length && (
        <Menu.Item key="1">
          <Button
            type="link"
            size="small"
            onClick={() => showZoneMapModalHandler(record)}
          >
            编辑分区
          </Button>
        </Menu.Item>
      )}
    </Menu>
  );

  const columns: any[] = [
    {
      title: '',
      key: 'logo',
      render: (text: string, record: PriceTable) => {
        const logo = GET_CARRIER_LOGO(record.carrier);
        return (
          <img
            style={{ width: '60px', height: '60px' }}
            src={logo}
            alt={record.carrier}
          />
        );
      }
    },
    {
      title: '账号名称',
      key: 'name',
      dataIndex: 'name'
    },
    {
      title: '服务名称',
      key: 'service',
      dataIndex: 'service',
      render: (service: Service) => {
        return service.name;
      }
    },
    {
      title: '服务范围',
      key: 'region',
      dataIndex: 'region',
      render: (region: string) => {
        return CARRIER_REGIONS_TEXTS[region];
      }
    },
    {
      title: '使用条件',
      key: 'condition',
      dataIndex: 'condition',
      render: (condition: ThirdPartyCondition) => {
        if (condition && condition.weightUnit) {
          return `${condition.minWeight || 0} - ${condition.maxWeight || ''} ${
            condition.weightUnit
          }`;
        }
        return '-';
      }
    },
    {
      title: '费率',
      key: 'rates',
      dataIndex: 'rates',
      render: (rates: FeeRate[] | undefined, record: PriceTable) => {
        if (record.rates && record.rates.length > 0) {
          const result = record.rates.map((rate) => (
            <div>{displayRate(rate)}</div>
          ));
          return result;
        }
        return '-';
      }
    }
  ];

  if (carrier.isActive) {
    columns.push({
      title: '操作',
      key: 'operation',
      fixed: 'right',
      render: (text: string, record: PriceTable) => {
        const buttons = [];
        if (record.price && record.price.data.length) {
          buttons.push(
            <Button
              key="查看价格"
              type="link"
              size="small"
              onClick={() => showPriceTableHandler(record)}
            >
              查看价格
            </Button>
          );
        }
        buttons.push(
          <Button
            key="编辑"
            type="link"
            size="small"
            onClick={() => editClickedHandler(record)}
          >
            编辑
          </Button>
        );
        buttons.push(
          <Popconfirm
            key="确认删除该账号"
            title="确认删除该账号?"
            placement="topRight"
            onConfirm={() => dispatch(deletePriceTableAccountHandler(record))}
            okText="确定"
            cancelText="取消"
          >
            <Button key="删除" size="small" type="link">
              删除
            </Button>
          </Popconfirm>
        );
        buttons.push(
          <Dropdown key="dropdown" overlay={menu(record)} trigger={['click']}>
            <Button icon={<DownOutlined />} />
          </Dropdown>
        );

        return (
          <Space size={0} split={<Divider type="vertical" />}>
            {buttons}
          </Space>
        );
      }
    });
  }

  return (
    <div>
      {carrier.isActive && (
        <EditPriceTableModal
          carrier={carrier}
          account={curAccount}
          onCancel={() => setCurAccount(undefined)}
        />
      )}
      {carrier.isActive && curAccount && (
        <PriceTablePriceUploadModal carrier={carrier} account={curAccount} />
      )}
      {curAccount && curAccount.price && curAccount.zones && (
        <>
          <ViewPriceTableModal
            price={curAccount.price}
            zones={curAccount.zones}
          />
          <EditPriceTableZoneMapModal account={curAccount} />
        </>
      )}
      <PageHeader
        title=""
        subTitle=""
        extra={[
          <Button
            key="0"
            icon={<SyncOutlined />}
            onClick={() => dispatch(fetchPriceTableAccounts(carrier.id))}
          />,
          <Button
            key="1"
            type="primary"
            icon={<PlusOutlined />}
            onClick={addClickedHandler}
            disabled={!carrier.isActive}
          >
            添加价格表
          </Button>
        ]}
      />
      <Table<PriceTable>
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={accounts}
        loading={loading}
      />
    </div>
  );
};

export default PriceTablePanel;
