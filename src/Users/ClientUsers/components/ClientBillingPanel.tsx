import { PlusOutlined } from '@ant-design/icons';
import { Button, PageHeader, Table } from 'antd';
import React, { ReactElement, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import axios from '../../../shared/utils/axios-base';

import ClientBillingForm from './ClientBillingForm';

import { SERVER_ROUTES } from '../../../shared/utils/constants';
import errorHandler from '../../../shared/utils/errorHandler';
import { Billing, CreateBillingData } from '../../../shared/types/billing';

interface ClientBillingPanelProps {
  id: string;
  updateBalance: (value: number) => void;
}

const ClientBillingPanel = ({
  id,
  updateBalance
}: ClientBillingPanelProps): ReactElement => {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [billingData, setBillingData] = useState<Billing[]>([]);

  useEffect(() => {
    setLoading(true);
    // TODO: add authentication
    axios
      .get(`${SERVER_ROUTES.BILLINGS}/${id}`)
      .then((response) => {
        setBillingData(response.data);
      })
      .catch((error) => {
        errorHandler(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const showBillingForm = () => setShowForm(true);
  const hideBillingForm = () => setShowForm(false);

  const addBillHandler = async (values: CreateBillingData) => {
    hideBillingForm();
    setLoading(true);
    // TODO: add auth
    try {
      const response = await axios.post(
        `${SERVER_ROUTES.BILLINGS}/${id}`,
        values
      );
      const newBill: Billing = response.data;
      const newData = [newBill, ...billingData];
      setBillingData(newData);
      updateBalance(newBill.balance);
    } catch (error) {
      errorHandler(error);
    } finally {
      setLoading(false);
    }
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
      title: '余额',
      key: 'balance',
      dataIndex: 'balance',
      render: (value: number) => value.toFixed(2)
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
      <ClientBillingForm
        visible={showForm}
        onCancel={hideBillingForm}
        onOk={addBillHandler}
      />
      <PageHeader
        title=""
        extra={
          <Button
            key="1"
            type="primary"
            icon={<PlusOutlined />}
            onClick={showBillingForm}
          >
            添加账单信息
          </Button>
        }
      />
      {table}
    </div>
  );
};

export default ClientBillingPanel;
