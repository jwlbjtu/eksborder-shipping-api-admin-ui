import React, { ReactElement, useEffect } from 'react';
import { PageHeader, Table, Button, Space } from 'antd';
import dayjs from 'dayjs';
import {
  CheckCircleTwoTone,
  PrinterOutlined,
  SyncOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { CARRIERS, GET_CARRIER_LOGO } from '../../../shared/utils/constants';
import { Address } from '../../../shared/types/carrier';
import {
  ShippingRecord,
  Label,
  ShipmentRate
} from '../../../shared/types/record';
import {
  fetchUserShippingRecords,
  selectShippingLoading,
  selectShippingRecords
} from '../../../redux/user/userShippingSlice';
import {
  downloadLabelsHandler,
  downloadShipmentForms,
  opentLabelUrlHandler
} from '../../../shared/utils/helpers';

interface ClientShippingPanelProps {
  id: string;
}

const ClientShippingPanel = ({
  id
}: ClientShippingPanelProps): ReactElement => {
  const dispatch = useDispatch();
  const recordsData = useSelector(selectShippingRecords);
  const loading = useSelector(selectShippingLoading);

  useEffect(() => {
    dispatch(fetchUserShippingRecords(id));
  }, [id, dispatch]);

  const refreshRecords = async () => {
    dispatch(fetchUserShippingRecords(id));
  };

  const columns = [
    {
      title: '',
      dataIndex: 'logo',
      key: 'logo',
      render: (text: string, record: ShippingRecord) => {
        const logo = GET_CARRIER_LOGO(record.carrier!);
        return <img className="logo" src={logo} alt={record.carrier} />;
      }
    },
    {
      title: '订单号',
      dataIndex: 'orderId',
      key: 'orderId'
    },
    {
      title: '账号',
      dataIndex: 'accountName',
      key: 'accountName',
      render: (accountName: string, record: ShippingRecord) => {
        return (
          <div>
            <div>{accountName}</div>
            <div>{`${record.carrierAccount}`}</div>
          </div>
        );
      }
    },
    {
      title: '物流信息',
      dataIndex: 'info',
      key: 'info',
      render: (text: string, record: ShippingRecord) => {
        return (
          <div>
            <div>{record.carrier}</div>
            <div>{record.service.name}</div>
            <div>{`${record.trackingId}`}</div>
            {record.facility && <div>{`${record.facility}`}</div>}
          </div>
        );
      }
    },
    {
      title: '包裹信息',
      key: 'packageInfo',
      render: (text: string, record: ShippingRecord) => {
        const weight = record.packageList[0].weight;
        return (
          <div>
            <div>{`${weight.value.toFixed(
              2
            )} ${weight.unitOfMeasure.toLowerCase()}`}</div>
          </div>
        );
      }
    },
    {
      title: '邮寄费',
      dataIndex: 'rate',
      key: 'rate',
      align: 'center',
      render: (rate: ShipmentRate) => {
        if (!rate && rate !== 0) return '-';
        return `$ ${rate.amount.toFixed(2)}`;
      }
    },
    {
      title: '收件地址',
      dataIndex: 'toAddress',
      key: 'toAddress',
      render: (address: Address) => {
        return (
          <div>
            <div>
              <strong>{`${address.name}`}</strong>
            </div>
            <div>{`${address.city}, ${address.state} ${address.postalCode}`}</div>
          </div>
        );
      }
    },
    {
      title: '日期',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => {
        return dayjs(date).format('YYYY/MM/DD');
      }
    },
    {
      title: 'Manifested',
      dataIndex: 'manifested',
      key: 'manifested',
      align: 'center',
      render: (manifested: boolean) => {
        return manifested ? <CheckCircleTwoTone /> : '-';
      }
    },
    {
      title: '操作',
      dataIndex: 'labels',
      key: 'labels',
      render: (labels: Label[], record: ShippingRecord) => {
        return (
          <Space direction="vertical">
            <Button
              type="primary"
              icon={<PrinterOutlined />}
              onClick={() =>
                record.carrier === CARRIERS.RUI_YUN ||
                record.carrier === CARRIERS.USPS3
                  ? opentLabelUrlHandler(record)
                  : downloadLabelsHandler(record)
              }
              ghost
            >
              打印面单
            </Button>
            {record.forms && record.forms.length > 0 && (
              <Button
                type="primary"
                icon={<PrinterOutlined />}
                onClick={() => downloadShipmentForms(record)}
                ghost
              >
                打印发票
              </Button>
            )}
          </Space>
        );
      }
    }
  ];

  return (
    <div>
      <PageHeader
        title=""
        extra={[
          <Button
            key="1"
            icon={<SyncOutlined spin={loading} />}
            onClick={refreshRecords}
          />,
          <Button key="create" type="primary" disabled>
            生成 Manifest
          </Button>,
          <Button key="view" type="primary" disabled>
            查看 Manifest
          </Button>
        ]}
      />
      <Table<ShippingRecord>
        rowKey={(record: ShippingRecord) => record.id}
        // @ts-expect-error: ignore
        columns={columns}
        dataSource={recordsData}
        loading={loading}
        scroll={{ x: true }}
      />
    </div>
  );
};

export default ClientShippingPanel;
