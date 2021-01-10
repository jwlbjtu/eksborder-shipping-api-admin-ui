import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { PageHeader, Table, Button } from 'antd';
import dayjs from 'dayjs';
import {
  CheckCircleTwoTone,
  PrinterOutlined,
  SyncOutlined
} from '@ant-design/icons';
import axios from '../../../shared/utils/axios-base';
import {
  GET_CARRIER_LOGO,
  SERVER_ROUTES
} from '../../../shared/utils/constants';
import errorHandler from '../../../shared/utils/errorHandler';
import { Address } from '../../../shared/types/carrier';
import { ShippingRecord, Label } from '../../../shared/types/record';
import ImageModal from '../../../shared/components/ImageModal';
import AuthContext from '../../../shared/components/context/auth-context';

interface ClientShippingPanelProps {
  id: string;
}

const ClientShippingPanel = ({
  id
}: ClientShippingPanelProps): ReactElement => {
  const auth = useContext(AuthContext);
  const [tableLoading, setTableLoading] = useState(false);
  const [recordsData, setRecordsData] = useState<any[]>([]);
  const [labelImage, setLabelImage] = useState<ReactElement | null>(null);
  const [isSpin, setIsSpin] = useState(false);

  useEffect(() => {
    setTableLoading(true);
    axios
      .get(`${SERVER_ROUTES.RECORDS}/${id}`, {
        headers: {
          Authorization: `${auth.userData?.token_type} ${auth.userData?.token}`
        }
      })
      .then((response) => {
        setRecordsData(response.data);
      })
      .catch((error) => errorHandler(error))
      .finally(() => setTableLoading(false));
  }, [id, auth]);

  const refreshRecords = async () => {
    setIsSpin(true);
    try {
      const response = await axios.get(`${SERVER_ROUTES.RECORDS}/${id}`, {
        headers: {
          Authorization: `${auth.userData?.token_type} ${auth.userData?.token}`
        }
      });
      setRecordsData(response.data);
    } catch (error) {
      errorHandler(error);
    } finally {
      setIsSpin(false);
    }
  };

  const hideLabelHandler = () => setLabelImage(null);
  const showLabelHandler = (type: string, format: string, data: string) => {
    setLabelImage(
      <ImageModal
        type={type}
        format={format}
        data={data}
        onCancel={hideLabelHandler}
        visible
      />
    );
  };

  const columns = [
    {
      title: '',
      dataIndex: 'logo',
      key: 'logo',
      render: (text: string, record: ShippingRecord) => {
        const logo = GET_CARRIER_LOGO(record.carrier);
        return <img className="logo" src={logo} alt={record.carrier} />;
      }
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
            <div>{`${record.carrier} ${record.service}`}</div>
            <div>{`${record.trackingId}`}</div>
            {record.facility && <div>{`${record.facility}`}</div>}
          </div>
        );
      }
    },
    {
      title: '包裹尺寸',
      key: 'packageInfo',
      render: (text: string, record: ShippingRecord) => {
        const { weight } = record.packageInfo;
        const { dimension } = record.packageInfo;
        return (
          <div>
            <div>{`${weight.value} ${weight.unitOfMeasure.toLowerCase()}`}</div>
            {dimension && (
              <div>{`${dimension.length} x ${dimension.width} x ${
                dimension.height
              } ${dimension.unitOfMeasure.toLowerCase()}`}</div>
            )}
          </div>
        );
      }
    },
    {
      title: '邮寄费',
      dataIndex: 'rate',
      key: 'rate',
      align: 'center',
      render: (rate: number) => {
        if (!rate && rate !== 0) return '-';
        return `$ ${rate.toFixed(2)}`;
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
      title: 'Labels',
      dataIndex: 'labels',
      key: 'labels',
      render: (labels: Label[]) => {
        const label = labels[0];
        return (
          <Button
            type="primary"
            icon={<PrinterOutlined />}
            onClick={() =>
              showLabelHandler(label.encodeType, label.format, label.labelData)
            }
            ghost
          >
            打印面单
          </Button>
        );
      }
    }
  ];

  return (
    <div>
      {labelImage}
      <PageHeader
        title=""
        extra={[
          <Button
            key="1"
            icon={<SyncOutlined spin={isSpin} />}
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
      <Table
        rowKey={(record: ShippingRecord) => record.id}
        // @ts-expect-error: ignore
        columns={columns}
        dataSource={recordsData}
        loading={tableLoading}
        scroll={{ x: true }}
      />
    </div>
  );
};

export default ClientShippingPanel;
