import { PlusOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, notification, PageHeader, Table } from 'antd';
import React, { ReactElement, useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import axios from '../../../shared/utils/axios-base';

import ClientBillingForm from './ClientBillingForm';

import { SERVER_ROUTES } from '../../../shared/utils/constants';
import errorHandler from '../../../shared/utils/errorHandler';
import { Billing, CreateBillingData } from '../../../shared/types/billing';
import AuthContext from '../../../shared/components/context/auth-context';

interface ClientBillingPanelProps {
  id: string;
  curBalance: number;
  updateBalance: () => void;
}

const ClientBillingPanel = ({
  id,
  curBalance,
  updateBalance
}: ClientBillingPanelProps): ReactElement => {
  const auth = useContext(AuthContext);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [billingData, setBillingData] = useState<Billing[]>([]);
  const [isSpin, setIsSpin] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${SERVER_ROUTES.BILLINGS}/${id}`, {
        headers: {
          Authorization: `${auth.userData?.token_type} ${auth.userData?.token}`
        }
      })
      .then((response) => {
        setBillingData(response.data);
      })
      .catch((error) => {
        errorHandler(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, auth]);

  const refreshRecords = async () => {
    setIsSpin(true);
    try {
      const response = await axios.get(`${SERVER_ROUTES.BILLINGS}/${id}`, {
        headers: {
          Authorization: `${auth.userData?.token_type} ${auth.userData?.token}`
        }
      });
      updateBalance();
      setBillingData(response.data);
    } catch (error) {
      errorHandler(error);
    } finally {
      setIsSpin(false);
    }
  };

  const showBillingForm = () => setShowForm(true);
  const hideBillingForm = () => setShowForm(false);

  const addBillHandler = async (values: CreateBillingData) => {
    if (!values.addFund && curBalance < values.total) {
      notification.error({
        message: '扣款失败',
        description: `扣款金额${values.total}超过用户余额${curBalance}`
      });
      return;
    }
    hideBillingForm();
    try {
      await axios.post(`${SERVER_ROUTES.BILLINGS}/${id}`, values, {
        headers: {
          Authorization: `${auth.userData?.token_type} ${auth.userData?.token}`
        }
      });
      refreshRecords();
    } catch (error) {
      errorHandler(error);
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
        extra={[
          <Button
            key="1"
            icon={<SyncOutlined spin={isSpin} />}
            onClick={refreshRecords}
          />,
          <Button
            key="2"
            type="primary"
            icon={<PlusOutlined />}
            onClick={showBillingForm}
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
