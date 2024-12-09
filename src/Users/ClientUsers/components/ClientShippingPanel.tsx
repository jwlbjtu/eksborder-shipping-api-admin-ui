import React, { ReactElement, useEffect, useState } from 'react';
import {
  PageHeader,
  Table,
  Button,
  Space,
  Form,
  Input,
  DatePicker,
  Tabs,
  Popconfirm,
  Tag
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import dayjs from 'dayjs';
import moment from 'moment';
import {
  BarcodeOutlined,
  CheckCircleTwoTone,
  DeleteFilled,
  PrinterOutlined,
  SearchOutlined,
  SyncOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  ShippingRecord,
  Label,
  ShipmentRate
} from '../../../shared/types/record';
import {
  cancelShippingRecord,
  revertShippingRecord,
  searchUserShippingRecords,
  selectShippingLoading,
  selectShippingRecords
} from '../../../redux/user/userShippingSlice';
import {
  downloadLabelsHandler,
  downloadShipmentForms,
  opentLabelUrlHandler
} from '../../../shared/utils/helpers';
import {
  CARRIERS,
  GET_CARRIER_LOGO,
  ShipmentStatus
} from '../../../shared/utils/constants';
import { IAddress } from '../../../shared/types/carrier';
import { UserShippingRecordsSearchQuery } from '../../../shared/types/redux-types';
import DownloadCSVButton from './DownloadCSVButton';

interface ClientShippingPanelProps {
  id: string;
}

const ClientShippingPanel = ({
  id
}: ClientShippingPanelProps): ReactElement => {
  const dispatch = useDispatch();
  const [form] = useForm();
  const recordsData = useSelector(selectShippingRecords);
  const loading = useSelector(selectShippingLoading);
  const [startDate, setStartDate] = React.useState<string>(
    dayjs().subtract(1, 'day').format('YYYY-MM-DD')
  );
  const [endDate, setEndDate] = React.useState<string>(
    dayjs().format('YYYY-MM-DD')
  );
  const [searchStatus, setSearchStatus] = useState<string>(
    ShipmentStatus.FULFILLED
  );

  useEffect(() => {
    // form.resetFields();
    form.validateFields().then((values: any) => {
      const searchValues: UserShippingRecordsSearchQuery = {
        ...values,
        startDate,
        endDate,
        status: searchStatus
      };
      console.log('search values:', searchValues);
      dispatch(searchUserShippingRecords(id, searchValues));
    });
  }, [id, dispatch, startDate, endDate, form, searchStatus]);

  const refreshRecords = async () => {
    form.resetFields();
    setStartDate(dayjs().subtract(1, 'day').format('YYYY-MM-DD'));
    setEndDate(dayjs().format('YYYY-MM-DD'));
    dispatch(
      searchUserShippingRecords(id, {
        startDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
        endDate: dayjs().format('YYYY-MM-DD'),
        status: searchStatus
      })
    );
  };

  const searchRecords = async () => {
    form.validateFields().then((values: any) => {
      const searchValues: UserShippingRecordsSearchQuery = {
        ...values,
        startDate,
        endDate,
        status: searchStatus
      };
      console.log('search values:', searchValues);
      dispatch(searchUserShippingRecords(id, searchValues));
    });
  };

  const tabChangeHandler = async (key: string) => {
    setSearchStatus(key);
  };

  const cancelLabelHandler = (record: ShippingRecord) => {
    form.validateFields().then((values: any) => {
      const searchValues: UserShippingRecordsSearchQuery = {
        ...values,
        startDate,
        endDate,
        status: searchStatus
      };
      dispatch(cancelShippingRecord(id, searchValues, record));
    });
  };

  const revertLabelHandler = (record: ShippingRecord) => {
    form.validateFields().then((values: any) => {
      const searchValues: UserShippingRecordsSearchQuery = {
        ...values,
        startDate,
        endDate,
        status: searchStatus
      };
      dispatch(revertShippingRecord(id, searchValues, record));
    });
  };

  const columns = [
    {
      title: '序号',
      key: 'index',
      render: (text: string, record: ShippingRecord, index: number) => {
        return <div>{index + 1}</div>;
      }
    },
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
        if (record.accountingWeight && record.accountingWeightUnit) {
          return (
            <div>
              <div>{`${record.accountingWeight.toFixed(2)} ${
                record.accountingWeightUnit
              }`}</div>
            </div>
          );
        }
        const weight = record.packageList[0].weight;
        // console.log(`${record.orderId}-${record.packageList[0].weight.value}`);
        return (
          <div>
            <div>{`${
              typeof weight.value === 'string'
                ? weight.value
                : weight.value.toFixed(2)
            } ${weight.unitOfMeasure.toLowerCase()}`}</div>
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
      render: (address: IAddress) => {
        return (
          <div>
            <div>
              <strong>{`${address.name}`}</strong>
            </div>
            {address.phone && <div>{address.phone}</div>}
            {address.email && <div>{address.email}</div>}
            <div>{`${address.city}, ${address.state} ${address.zip}`}</div>
          </div>
        );
      }
    },
    {
      title: '日期',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
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
      title: 'Manifested',
      dataIndex: 'manifested',
      key: 'manifested',
      align: 'center',
      render: (manifested: boolean) => {
        return manifested ? <CheckCircleTwoTone /> : '-';
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        if (status === ShipmentStatus.FULFILLED) {
          return <Tag color="green">已邮寄</Tag>;
        }
        if (status === ShipmentStatus.DEL_PENDING) {
          return <Tag color="yellow">待删除</Tag>;
        }
        return <Tag color="red">已删除</Tag>;
      }
    },
    {
      title: '财务状态',
      dataIndex: 'accountingStatus',
      key: 'accountingStatus',
      render: (accountingStatus: string, record: ShippingRecord) => {
        if (!accountingStatus) return '-';
        return (
          <div>{`${accountingStatus} (${record.accountingDiff?.toFixed(
            2
          )})`}</div>
        );
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
            {record.status === ShipmentStatus.DEL_PENDING && (
              <Button
                type="primary"
                icon={<BarcodeOutlined />}
                onClick={() => revertLabelHandler(record)}
              >
                恢复面单
              </Button>
            )}
            {(record.status === ShipmentStatus.FULFILLED ||
              record.status === ShipmentStatus.DEL_PENDING) && (
              <Popconfirm
                key="确认删除"
                title="确认删除?"
                placement="topRight"
                onConfirm={() => cancelLabelHandler(record)}
                okText="确定"
                cancelText="取消"
              >
                <Button type="primary" icon={<DeleteFilled />} ghost>
                  取消面单
                </Button>
              </Popconfirm>
            )}
          </Space>
        );
      }
    }
  ];

  const generateCSVData = (data: ShippingRecord[]) => {
    const output: any[] = [];
    output.push([
      '序号',
      '日期',
      '订单号',
      '面单号',
      '收件人',
      '邮编',
      '邮寄费'
    ]);
    data.forEach((record, index) => {
      output.push([
        index + 1,
        dayjs(record.updatedAt).format('YYYY/MM/DD HH:mm:ss'),
        record.orderId,
        record.trackingId,
        record.toAddress.name,
        record.toAddress.zip,
        record.rate!.amount.toFixed(2)
      ]);
    });
    return output;
  };

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
          <Button
            key="create"
            type="primary"
            icon={<SearchOutlined />}
            onClick={searchRecords}
          >
            查询
          </Button>,
          <DownloadCSVButton
            label="导出订单"
            data={generateCSVData(recordsData)}
            fileName="订单记录"
          />,
          <Button key="create" type="primary" disabled>
            生成 Manifest
          </Button>,
          <Button key="view" type="primary" disabled>
            查看 Manifest
          </Button>
        ]}
      >
        <Form form={form} layout="horizontal">
          <Space direction="horizontal" size="middle">
            <Form.Item label="开始日期" name="startDate">
              <DatePicker
                defaultValue={moment(startDate)}
                onChange={(_, dateString) => {
                  // console.log('start date:', dateString);
                  setStartDate(dateString);
                }}
              />
            </Form.Item>
            <Form.Item label="结束日期" name="endDate">
              <DatePicker
                defaultValue={moment(endDate)}
                onChange={(_, dateString) => {
                  // console.log('start date:', dateString);
                  setEndDate(dateString);
                }}
              />
            </Form.Item>
            <Form.Item label="订单号" name="orderId">
              <Input type="text" placeholder="订单号" />
            </Form.Item>
            <Form.Item label="面单号" name="trackingId">
              <Input type="text" placeholder="面单号" />
            </Form.Item>
            <Form.Item label="收件人" name="name">
              <Input type="text" placeholder="收件人" />
            </Form.Item>
            <Form.Item label="电话" name="phone">
              <Input type="text" placeholder="电话" />
            </Form.Item>
            <Form.Item label="邮编" name="zip">
              <Input type="text" placeholder="邮编" />
            </Form.Item>
          </Space>
        </Form>
      </PageHeader>
      <Tabs defaultActiveKey="1" onChange={tabChangeHandler}>
        <Tabs.TabPane tab="已邮寄" key={ShipmentStatus.FULFILLED} />
        <Tabs.TabPane tab="待取消" key={ShipmentStatus.DEL_PENDING} />
        <Tabs.TabPane tab="已取消" key={ShipmentStatus.DELETED} />
      </Tabs>
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
