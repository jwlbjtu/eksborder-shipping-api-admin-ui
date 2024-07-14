import { PlusOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, notification, PageHeader, Table } from 'antd';
import React, { ReactElement, useEffect } from 'react';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import ClientBillingForm from './ClientBillingForm';
import { Billing, CreateBillingData } from '../../../shared/types/billing';
import {
  createUserBillingHandler,
  fetchUserBillingHandler,
  selectUserBillings,
  selectUserBillingsLoading,
  setShowBillingForm
} from '../../../redux/user/userBillingSlice';
import { USER_ROLES } from '../../../shared/utils/constants';
import { fetchUsersByRoleHandler } from '../../../redux/user/userDataSlice';

interface ClientBillingPanelProps {
  id: string;
  curBalance: number;
}

const ClientBillingPanel = ({
  id,
  curBalance
}: ClientBillingPanelProps): ReactElement => {
  const dispatch = useDispatch();
  const billingData = useSelector(selectUserBillings);
  const loading = useSelector(selectUserBillingsLoading);

  useEffect(() => {
    dispatch(fetchUserBillingHandler(id));
  }, [dispatch, id]);

  const refreshRecords = async () => {
    dispatch(fetchUserBillingHandler(id));
    dispatch(fetchUsersByRoleHandler(USER_ROLES.API_USER));
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

  const columns = [
    {
      title: '生成日期',
      key: 'createdAt',
      dataIndex: 'createdAt',
      render: (date: string) => {
        return dayjs(date).format('YYYY/MM/DD');
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
      title: '押金变化',
      key: 'deposit',
      dataIndex: 'deposit',
      render: renderCell
    },
    {
      title: '余额',
      key: 'balance',
      dataIndex: 'balance',
      render: (value: number) => value.toFixed(2)
    },
    {
      title: '押金',
      key: 'clientDeposit',
      dataIndex: 'clientDeposit',
      render: (value: number) => (value !== undefined ? value.toFixed(2) : '-')
    }
  ];

  const table = (
    <Table
      rowKey={(record: Billing) => record.id}
      columns={columns}
      dataSource={billingData}
      loading={loading}
    />
  );

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
            key="2"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => dispatch(setShowBillingForm(true))}
          >
            添加账单信息
          </Button>
        ]}
      />
      {table}
    </div>
  );
};

export default ClientBillingPanel;
