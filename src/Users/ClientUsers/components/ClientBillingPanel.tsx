import { PlusOutlined } from '@ant-design/icons';
import { Button, PageHeader, Table } from 'antd';
import React, { ReactElement, useEffect, useState } from 'react';

import ClientBillingForm from './ClientBillingForm';

import { CLIETN_BILLING_DATA } from '../../../shared/utils/constants';

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
  const [billingData, setBillingData] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      // TODO: call back end
      // @ts-expect-error: 123
      setBillingData(CLIETN_BILLING_DATA[id]);
      setLoading(false);
    }, 1000);
  }, [id]);

  const showBillingForm = () => setShowForm(true);
  const hideBillingForm = () => setShowForm(false);

  const addBillHandler = (values: any) => {
    hideBillingForm();
    setLoading(true);
    // TODO: call back end
    setTimeout(() => {
      const newData = [...billingData];
      const newB =
        values.isPayment === 1 ? 986.78 - values.total : 986.78 + values.total;
      newData.push({
        ...values,
        date: '2020-12-26',
        balance: newB
      });
      setBillingData(newData);
      updateBalance(newB);
      setLoading(false);
    }, 1000);
  };

  const renderCell = (text: string, record: any) => {
    return text ? (
      <span style={{ color: record.isPayment ? '#cf1322' : '#3f8600' }}>
        {text}
      </span>
    ) : (
      '-'
    );
  };

  const columns = [
    {
      title: '生成日期',
      key: 'date',
      dataIndex: 'date'
    },
    {
      title: '物流账号',
      key: 'carrierAccount',
      dataIndex: 'carrierAccount'
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
      align: 'right',
      render: renderCell
    },
    {
      title: '手续费',
      key: 'fee',
      dataIndex: 'fee',
      align: 'right',
      render: renderCell
    },
    {
      title: '总计',
      key: 'total',
      dataIndex: 'total',
      align: 'right',
      render: renderCell
    },
    {
      title: '余额',
      key: 'balance',
      dataIndex: 'balance',
      align: 'right'
    }
  ];

  const table = (
    // @ts-expect-error: type check failed
    <Table columns={columns} dataSource={billingData} loading={loading} />
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
