import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'antd/lib/form/Form';
import { useParams, Link } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  Button,
  Form,
  Input,
  PageHeader,
  Select,
  Space,
  Table,
  Tag
} from 'antd';
import { Route } from 'antd/lib/breadcrumb/Breadcrumb';
import {
  fetchAccountingItems,
  searchAccountingItemsHandler,
  selectAccountingItems,
  selectAccountingLoading
} from '../../redux/accounting/accountingSlice';
import {
  AccountingItem,
  AccountingItemSearchQuery
} from '../../shared/types/redux-types';
import DownloadCSVButton from '../../Users/ClientUsers/components/DownloadCSVButton';

const AccountingManagePage = () => {
  const dispatch = useDispatch();
  const [form] = useForm();
  const loading = useSelector(selectAccountingLoading);
  const { id } = useParams<{ id: string }>();
  const items = useSelector(selectAccountingItems);

  useEffect(() => {
    dispatch(fetchAccountingItems(id));
  }, [dispatch, id]);

  const breadcrumbEles = [
    { key: '1', path: '', breadcrumbName: '对账记录' },
    {
      key: '2',
      path: '',
      breadcrumbName: `账目清单`
    }
  ];

  const itemRender = (
    route: Route,
    params: any[],
    routes: Route[],
    paths: string[]
  ) => {
    console.log(paths);
    const last = routes.indexOf(route) === routes.length - 1;
    return last ? (
      <span key={route.breadcrumbName}>{route.breadcrumbName}</span>
    ) : (
      <Link key={route.breadcrumbName} to="/accounting">
        {route.breadcrumbName}
      </Link>
    );
  };

  const searchRecords = async () => {
    form.validateFields().then((values: any) => {
      const searchValues: AccountingItemSearchQuery = {
        ...values
      };
      console.log('search values:', searchValues);
      dispatch(searchAccountingItemsHandler(id, searchValues));
    });
  };

  const colums = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      render: (_: any, __: any, index: number) => index + 1
    },
    {
      title: '订单日期',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (date: Date | string) => {
        if (!date || date === '-') return '-';
        return (
          <>
            <div>{dayjs(date).format('YYYY/MM/DD')}</div>
            <div>{dayjs(date).format('HH:mm:ss')}</div>
          </>
        );
      }
    },
    {
      title: '物流渠道',
      dataIndex: 'channel',
      key: 'channel'
    },
    {
      title: '客户名称',
      dataIndex: 'userName',
      key: 'userName'
    },
    {
      title: '订单号',
      dataIndex: 'orderId',
      key: 'orderId'
    },
    {
      title: '物流单号',
      dataIndex: 'trackingNumber',
      key: 'trackingNumber'
    },
    {
      title: '官方序号',
      dataIndex: 'pieceId',
      key: 'pieceId'
    },
    {
      title: '邮寄州',
      dataIndex: 'uspsState',
      key: 'uspsState'
    },
    {
      title: '重量',
      dataIndex: 'weight',
      key: 'weight',
      render: (weight: number, record: AccountingItem) => {
        return `${weight} ${record.weightType}`;
      }
    },
    {
      title: '分区',
      dataIndex: 'zone',
      key: 'zone'
    },
    {
      title: '底价',
      dataIndex: 'baseAmount',
      key: 'baseAmount',
      render: (baseAmount: number) =>
        baseAmount ? `$ ${baseAmount.toFixed(2)}` : '-'
    },
    {
      title: '应收金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `$ ${amount.toFixed(2)}`
    },
    {
      title: '付款金额',
      dataIndex: 'servicePayment',
      key: 'servicePayment',
      render: (servicePayment: number) =>
        servicePayment !== undefined ? `$ ${servicePayment.toFixed(2)}` : '-'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => {
        return status === 0 ? (
          <Tag color="green">对账完成</Tag>
        ) : (
          <Tag color="error">对账失败</Tag>
        );
      }
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark'
    },
    {
      title: '账单编号',
      dataIndex: 'docName',
      key: 'docName'
    }
  ];

  const generateCSVData = (data: AccountingItem[]) => {
    const output: any[] = [];
    output.push([
      '序号',
      '账单归属',
      '订单日期',
      '重量',
      '重量单位',
      '邮寄州',
      '分区',
      '官方序号',
      '订单号',
      '面单号',
      '底价',
      '应收金额',
      '付款金额',
      '账单编号'
    ]);
    data.forEach((record, index) => {
      output.push([
        index + 1,
        record.userName,
        dayjs(record.orderDate).format('YYYY/MM/DD HH:mm:ss'),
        record.weight.toFixed(2),
        record.weightType,
        record.uspsState,
        record.zone ? record.zone : '-',
        record.pieceId,
        record.orderId,
        record.trackingNumber,
        record.baseAmount ? `$ ${record.baseAmount.toFixed(2)}` : '-',
        `$ ${record.amount.toFixed(2)}`,
        record.servicePayment ? `$ ${record.servicePayment.toFixed(2)}` : '-',
        record.docName ? record.docName : '-'
      ]);
    });
    return output;
  };

  return (
    <>
      <PageHeader
        title="账目清单"
        breadcrumb={{ itemRender, routes: breadcrumbEles }}
        extra={[
          <Button
            key="create"
            type="primary"
            icon={<SearchOutlined />}
            onClick={searchRecords}
          >
            查询
          </Button>,
          <DownloadCSVButton
            label="导出账单"
            data={generateCSVData(items)}
            fileName="对账单"
          />
        ]}
      >
        <Form form={form} layout="horizontal">
          <Space direction="horizontal" size="middle">
            <Form.Item label="用户" name="userName">
              <Input type="text" placeholder="用户" />
            </Form.Item>
            <Form.Item label="订单号" name="orderId">
              <Input type="text" placeholder="订单号" style={{ width: 300 }} />
            </Form.Item>
            <Form.Item label="面单号" name="trackingNumber">
              <Input type="text" placeholder="面单号" style={{ width: 300 }} />
            </Form.Item>
            <Form.Item label="状态" name="status">
              <Select style={{ width: '200px' }}>
                <Select.Option value="">所有状态</Select.Option>
                <Select.Option value="0">对账完成</Select.Option>
                <Select.Option value="1">对账失败</Select.Option>
              </Select>
            </Form.Item>
          </Space>
          <Space direction="horizontal" size="middle">
            <Form.Item label="账单编号" name="docName" style={{ width: 600 }}>
              <Input type="text" />
            </Form.Item>
          </Space>
        </Form>
      </PageHeader>
      <Table<AccountingItem>
        columns={colums}
        dataSource={items}
        loading={loading}
      />
    </>
  );
};

export default AccountingManagePage;
