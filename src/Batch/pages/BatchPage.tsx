import {
  BarcodeOutlined,
  CheckCircleTwoTone,
  DeleteFilled,
  PrinterOutlined,
  SearchOutlined
} from '@ant-design/icons';
import {
  Button,
  Divider,
  Form,
  notification,
  PageHeader,
  Popconfirm,
  Space,
  Table,
  TableProps,
  Tag
} from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import TextArea from 'antd/lib/input/TextArea';
import { useDispatch, useSelector } from 'react-redux';
import { Label, ShipmentRate, ShippingRecord } from '../../shared/types/record';
import {
  downloadLabelsHandler,
  downloadShipmentForms,
  opentLabelUrlHandler
} from '../../shared/utils/helpers';
import {
  CARRIERS,
  GET_CARRIER_LOGO,
  ShipmentStatus
} from '../../shared/utils/constants';
import { IAddress } from '../../shared/types/carrier';
import {
  batchCancelShippingRecords,
  batchRevertSingleShippingRecord,
  BatchSearchQuery,
  searchBatchShippingRecords,
  selectBatchLoading,
  selectBatchShippingRecords
} from '../../redux/batch/batchSlice';

const BatchPage = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const records = useSelector(selectBatchShippingRecords);
  const loading = useSelector(selectBatchLoading);
  const [selectedShippingRecords, setSelectedShippingRecords] = React.useState<
    ShippingRecord[]
  >([]);

  const searchLabelsHandler = async () => {
    form
      .validateFields()
      .then((values: any) => {
        const searchValues: BatchSearchQuery = {
          trackingNumbers: values.trackingNumbers.split(',')
        };
        console.log(searchValues);
        dispatch(searchBatchShippingRecords(searchValues));
      })
      .catch((error) => {
        notification.error({
          message: `格式错误：${(error as Error).message}`
        });
      });
  };

  const batchCancelLabelHandler = () => {
    form
      .validateFields()
      .then((values: any) => {
        const searchValues: BatchSearchQuery = {
          trackingNumbers: values.trackingNumbers.split(',')
        };
        dispatch(
          batchCancelShippingRecords(searchValues, selectedShippingRecords)
        );
      })
      .catch((error) => {
        notification.error({
          message: `格式错误：${(error as Error).message}`
        });
      });
  };

  const cancelLabelHandler = (record: ShippingRecord) => {
    form
      .validateFields()
      .then((values: any) => {
        const searchValues: BatchSearchQuery = {
          trackingNumbers: values.trackingNumbers.split(',')
        };
        dispatch(batchCancelShippingRecords(searchValues, [record]));
      })
      .catch((error) => {
        notification.error({
          message: `格式错误：${(error as Error).message}`
        });
      });
  };

  const revertLabelHandler = (record: ShippingRecord) => {
    form
      .validateFields()
      .then((values: any) => {
        const searchValues: BatchSearchQuery = {
          trackingNumbers: values.trackingNumbers.split(',')
        };
        console.log(searchValues);
        dispatch(batchRevertSingleShippingRecord(searchValues, record));
      })
      .catch((error) => {
        notification.error({
          message: `格式错误：${(error as Error).message}`
        });
      });
  };

  // rowSelection object indicates the need for row selection
  const rowSelection: TableProps<ShippingRecord>['rowSelection'] = {
    onChange: (
      selectedRowKeys: React.Key[],
      selectedRows: ShippingRecord[]
    ) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows: ',
        selectedRows
      );
      setSelectedShippingRecords([...selectedRows]);
    }
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
                record.carrier === CARRIERS.USPS3 ||
                record.carrier === CARRIERS.MAO_YUAN
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

  return (
    <div>
      <PageHeader
        title="财务对账"
        subTitle="财务对账记录管理"
        extra={[
          <Button
            key="create"
            type="primary"
            icon={<SearchOutlined />}
            onClick={searchLabelsHandler}
          >
            查询
          </Button>
        ]}
      >
        <Form form={form} layout="horizontal">
          <Form.Item label="订单号" name="trackingNumbers">
            <TextArea
              rows={4}
              placeholder="请输入订单号，多个订单号请用逗号隔开"
            />
          </Form.Item>
        </Form>
      </PageHeader>
      <Divider />
      <Button
        type="primary"
        onClick={() => {
          batchCancelLabelHandler();
        }}
        disabled={selectedShippingRecords.length === 0}
      >
        批量取消订单
      </Button>
      <Table<ShippingRecord>
        rowSelection={{ type: 'checkbox', ...rowSelection }}
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={records}
        loading={loading}
        scroll={{ x: true }}
      />
    </div>
  );
};

export default BatchPage;
