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
  deleteThirdPartyAccountHandler,
  fetchThirdPartyAccounts,
  selectAccounts,
  selectThirdpartyLoading,
  setPriceModalShow,
  setPriceTableModalShow,
  setShowModal,
  setZoneModalShow
} from '../../redux/carrier/thirdpartySlice';
import {
  Carrier,
  FeeRate,
  Service,
  ThirdPartyAccount,
  ThirdPartyCondition
} from '../../shared/types/carrier';
import {
  CARRIER_REGIONS_TEXTS,
  CARRIER_ZONE_MODE_TEXTS,
  GET_CARRIER_LOGO
} from '../../shared/utils/constants';
import { displayRate } from '../../shared/utils/helpers';
import EditThirdPartyModal from './EditThridPartyModal';
import EditZoneMapModal from './EditZoneMapModal';
import ThirdPartyPriceUploadModal from './ThirdPartyPriceUploadModal';
import ViewPriceModal from './ViewPriceModal';

interface ThirdPartyPanelProps {
  carrier: Carrier;
}

const ThirdPartyPanel = ({ carrier }: ThirdPartyPanelProps): ReactElement => {
  const dispatch = useDispatch();
  const accounts = useSelector(selectAccounts);
  const loading = useSelector(selectThirdpartyLoading);
  const [curAccount, setCurAccount] = useState<ThirdPartyAccount | undefined>();

  useEffect(() => {
    dispatch(fetchThirdPartyAccounts(carrier.id));
    setCurAccount(undefined);
  }, [dispatch, carrier]);

  const addClickedHandler = () => {
    setCurAccount(undefined);
    dispatch(setShowModal(true));
  };

  const editClickedHandler = (record: ThirdPartyAccount) => {
    setCurAccount(record);
    dispatch(setShowModal(true));
  };

  const showPriceUploadHandler = (record: ThirdPartyAccount) => {
    setCurAccount(record);
    dispatch(setPriceModalShow(true));
  };

  const showPriceTableHandler = (record: ThirdPartyAccount) => {
    setCurAccount(record);
    dispatch(setPriceTableModalShow(true));
  };

  const showZoneMapModalHandler = (record: ThirdPartyAccount) => {
    setCurAccount(record);
    dispatch(setZoneModalShow(true));
  };

  const menu = (record: ThirdPartyAccount) => (
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
      render: (text: string, record: ThirdPartyAccount) => {
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
      title: '账号',
      key: 'accountNum',
      dataIndex: 'accountNum',
      render: (accountNum: string, record: ThirdPartyAccount) => {
        return (
          <Space direction="vertical">
            <div>{accountNum}</div>
            <div>{`${record.countryCode || ''} ${record.zipCode || ''}`}</div>
          </Space>
        );
      }
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
      title: '分区模式',
      key: 'zoneMode',
      dataIndex: 'zoneMode',
      render: (zoneMode: string) => {
        return CARRIER_ZONE_MODE_TEXTS[zoneMode];
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
      render: (rates: FeeRate[] | undefined, record: ThirdPartyAccount) => {
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
      render: (text: string, record: ThirdPartyAccount) => {
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
            onConfirm={() => dispatch(deleteThirdPartyAccountHandler(record))}
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
        <EditThirdPartyModal
          carrier={carrier}
          account={curAccount}
          onCancel={() => setCurAccount(undefined)}
        />
      )}
      {carrier.isActive && curAccount && (
        <ThirdPartyPriceUploadModal carrier={carrier} account={curAccount} />
      )}
      {curAccount && curAccount.price && curAccount.zones && (
        <>
          <ViewPriceModal price={curAccount.price} zones={curAccount.zones} />
          <EditZoneMapModal account={curAccount} />
        </>
      )}
      <PageHeader
        title=""
        subTitle=""
        extra={[
          <Button
            key="0"
            icon={<SyncOutlined />}
            onClick={() => dispatch(fetchThirdPartyAccounts(carrier.id))}
          />,
          <Button
            key="1"
            type="primary"
            icon={<PlusOutlined />}
            onClick={addClickedHandler}
            disabled={!carrier.isActive}
          >
            添加三方账号
          </Button>
        ]}
      />
      <Table<ThirdPartyAccount>
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={accounts}
        loading={loading}
      />
    </div>
  );
};

export default ThirdPartyPanel;
