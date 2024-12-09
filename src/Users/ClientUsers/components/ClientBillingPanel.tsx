import { PlusOutlined, SearchOutlined, SyncOutlined } from '@ant-design/icons';
import {
  Button,
  DatePicker,
  Form,
  Input,
  notification,
  PageHeader,
  Space,
  Table,
  Tabs
} from 'antd';
import moment from 'moment';
import React, { ReactElement, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useForm } from 'antd/lib/form/Form';
import { useDispatch, useSelector } from 'react-redux';
import ClientBillingForm from './ClientBillingForm';
import { Billing, CreateBillingData } from '../../../shared/types/billing';
import {
  createUserBillingHandler,
  searchUserBillingHandler,
  selectUserBillings,
  selectUserBillingsLoading,
  setShowBillingForm
} from '../../../redux/user/userBillingSlice';
import { ShipmentStatus, USER_ROLES } from '../../../shared/utils/constants';
import { fetchUsersByRoleHandler } from '../../../redux/user/userDataSlice';
import { UserBillingRecordsSearchQuery } from '../../../shared/types/redux-types';
import DownloadCSVButton from './DownloadCSVButton';

interface ClientBillingPanelProps {
  id: string;
  curBalance: number;
}

const ClientBillingPanel = ({
  id,
  curBalance
}: ClientBillingPanelProps): ReactElement => {
  const dispatch = useDispatch();
  const [form] = useForm();
  const billingData = useSelector(selectUserBillings);
  const loading = useSelector(selectUserBillingsLoading);
  const [startDate, setStartDate] = React.useState<string>(
    dayjs().subtract(1, 'day').format('YYYY-MM-DD')
  );
  const [endDate, setEndDate] = React.useState<string>(
    dayjs().format('YYYY-MM-DD')
  );
  const [status, setStatus] = useState<string | undefined>();

  useEffect(() => {
    form.validateFields().then((values: any) => {
      const searchValues: UserBillingRecordsSearchQuery = {
        ...values,
        startDate,
        endDate,
        status
      };
      console.log('search values:', searchValues);
      dispatch(searchUserBillingHandler(id, searchValues));
    });
  }, [dispatch, id, status, startDate, endDate, form]);

  const refreshRecords = async () => {
    form.resetFields();
    setStartDate(dayjs().subtract(1, 'day').format('YYYY-MM-DD'));
    setEndDate(dayjs().format('YYYY-MM-DD'));
    dispatch(
      searchUserBillingHandler(id, {
        startDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
        endDate: dayjs().format('YYYY-MM-DD'),
        status
      })
    );
    dispatch(fetchUsersByRoleHandler(USER_ROLES.API_USER));
  };

  const searchRecords = async () => {
    form.validateFields().then((values: any) => {
      const searchValues: UserBillingRecordsSearchQuery = {
        ...values,
        startDate,
        endDate,
        status
      };
      console.log('search values:', searchValues);
      dispatch(searchUserBillingHandler(id, searchValues));
    });
  };

  const addBillHandler = async (values: CreateBillingData) => {
    if (!values.addFund && curBalance < values.total) {
      notification.error({
        message: '扣款失败',
        description: `扣款金额${values.total}超过用户余额${curBalance}`
      });
      return;
    }
    dispatch(createUserBillingHandler(id, values));
  };

  const renderCell = (text: number, record: Billing) => {
    return text ? (
      <span style={{ color: record.addFund ? '#3f8600' : '#cf1322' }}>
        {text.toFixed(2)}
      </span>
    ) : (
      '-'
    );
  };

  const tabChangeHandler = (key: string) => {
    if (key === ShipmentStatus.DELETED) {
      setStatus(ShipmentStatus.DELETED);
    } else {
      setStatus(undefined);
    }
  };

  const columns = [
    {
      title: '生成日期',
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
      title: '物流账号',
      key: 'account',
      dataIndex: 'account'
    },
    {
      title: '账单说明',
      key: 'description',
      dataIndex: 'description'
    },
    {
      title: '邮寄费用',
      key: 'shippingCost',
      dataIndex: 'shippingCost',
      render: (text: string, record: Billing) => {
        if (record.details && record.details.shippingCost) {
          const { amount } = record.details.shippingCost;
          return renderCell(amount, record);
        }
        return '-';
      }
    },
    {
      title: '手续费',
      key: 'fee',
      dataIndex: 'fee',
      render: (text: string, record: Billing) => {
        if (record.details && record.details.fee) {
          const { amount } = record.details.fee;
          return renderCell(amount, record);
        }
        return '-';
      }
    },
    {
      title: '总计',
      key: 'total',
      dataIndex: 'total',
      render: renderCell
    },
    {
      title: '财务状态',
      dataIndex: 'accountingStatus',
      key: 'accountingStatus',
      render: (accountingStatus: string, record: Billing) => {
        if (!accountingStatus) return '-';
        return (
          <div>{`${accountingStatus} (${record.accountingDiff?.toFixed(
            2
          )})`}</div>
        );
      }
    }
  ];

  const table = (
    <Table<Billing>
      rowKey={(record: Billing) => record.id}
      columns={columns}
      dataSource={billingData}
      loading={loading}
    />
  );

  const generateCSVData = (data: Billing[]) => {
    const output: any[] = [];
    output.push(['序号', '日期', '物流账号', '订单号', '邮寄费用']);
    data.forEach((record, index) => {
      output.push([
        index + 1,
        dayjs(record.updatedAt).format('YYYY/MM/DD HH:mm:ss'),
        record.account,
        record.description,
        record.total
      ]);
    });
    return output;
  };

  return (
    <div>
      <ClientBillingForm onOk={addBillHandler} />
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
          <Button
            key="2"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => dispatch(setShowBillingForm(true))}
          >
            添加账单信息
          </Button>,
          <DownloadCSVButton
            label="导出账单"
            data={generateCSVData(billingData)}
            fileName="账单记录"
          />
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
            <Form.Item label="物流渠道" name="channel">
              <Input type="text" placeholder="物流渠道" />
            </Form.Item>
          </Space>
        </Form>
      </PageHeader>
      <Tabs defaultActiveKey="1" onChange={tabChangeHandler}>
        <Tabs.TabPane tab="已扣款" key={ShipmentStatus.FULFILLED} />
        <Tabs.TabPane tab="已取消" key={ShipmentStatus.DELETED} />
      </Tabs>
      {table}
    </div>
  );
};

export default ClientBillingPanel;
