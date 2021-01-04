import React, { ReactElement, useContext, useEffect, useState } from 'react';
import {
  PageHeader,
  Table,
  Divider,
  Button,
  Switch,
  Space,
  Popconfirm
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  FEE_CALCULATE_BASE,
  FEE_TYPE_KEYS,
  SERVER_ROUTES
} from '../../../shared/utils/constants';

import ClientConnectCarrierForm from './ClientConnectCarrierForm';
import ClientUpdateCarrierForm from './ClientUpdateCarrierForm';
import axios from '../../../shared/utils/axios-base';
import errorHandler from '../../../shared/utils/errorHandler';
import { CreateUserCarrierData, UserCarrier } from '../../../shared/types/user';
import AuthContext from '../../../shared/components/context/auth-context';

interface ClientCarrierPanelProps {
  id: string;
}

const ClientCarrierPanel = ({ id }: ClientCarrierPanelProps): ReactElement => {
  const auth = useContext(AuthContext);
  const [data, setData] = useState<UserCarrier[]>([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [updateForm, setUpdateForm] = useState<ReactElement | null>(null);

  useEffect(() => {
    setTableLoading(true);
    axios
      .get(`${SERVER_ROUTES.ACCOUNT}/${id}`, {
        headers: {
          Authorization: `${auth.userData?.token_type} ${auth.userData?.token}`
        }
      })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        errorHandler(error);
      })
      .finally(() => {
        setTableLoading(false);
      });
  }, [id, auth]);

  const deleteHandler = async (accountId: number) => {
    setTableLoading(true);
    try {
      await axios.delete(`${SERVER_ROUTES.ACCOUNT}/${accountId}`, {
        headers: {
          Authorization: `${auth.userData?.token_type} ${auth.userData?.token}`
        }
      });
      const newData = data.filter((item) => item.id !== accountId);
      setData(newData);
    } catch (error) {
      errorHandler(error);
    } finally {
      setTableLoading(false);
    }
  };

  const statusChangeHandler = async (active: boolean, values: UserCarrier) => {
    setTableLoading(true);
    try {
      const updateData = { id: values.id, isActive: active };
      const response = await axios.put(`${SERVER_ROUTES.ACCOUNT}`, updateData, {
        headers: {
          Authorization: `${auth.userData?.token_type} ${auth.userData?.token}`
        }
      });
      const updatedAccount = response.data;
      const newData = [...data];
      const record = newData.find((item) => item.id === updatedAccount.id);
      if (record) {
        record.isActive = updatedAccount.isActive;
      }
      setData(newData);
    } catch (error) {
      errorHandler(error);
    } finally {
      setTableLoading(false);
    }
  };

  const hideCreateFormHandler = () => setShowCreateForm(false);
  const showCreateFormHandler = () => setShowCreateForm(true);
  const createHandler = async (values: CreateUserCarrierData) => {
    setTableLoading(true);
    hideCreateFormHandler();
    try {
      const account: CreateUserCarrierData = {
        ...values,
        userRef: id
      };
      const response = await axios.post(SERVER_ROUTES.ACCOUNT, account, {
        headers: {
          Authorization: `${auth.userData?.token_type} ${auth.userData?.token}`
        }
      });
      const newData = [...data, response.data];
      setData(newData);
    } catch (error) {
      errorHandler(error);
    } finally {
      setTableLoading(false);
    }
  };

  const hideUpdateForm = () => setUpdateForm(null);

  const updateHandler = async (values: any) => {
    hideUpdateForm();
    setTableLoading(true);
    try {
      const response = await axios.put(`${SERVER_ROUTES.ACCOUNT}`, values, {
        headers: {
          Authorization: `${auth.userData?.token_type} ${auth.userData?.token}`
        }
      });
      const updatedRecord = response.data;
      const newData = [...data];
      const record = newData.find(
        (item: UserCarrier) => item.id === updatedRecord.id
      );
      Object.keys(updatedRecord).forEach((key: string) => {
        // @ts-expect-error: ignore
        record[key] = updatedRecord[key];
      });
      setData(newData);
    } catch (error) {
      errorHandler(error);
    } finally {
      setTableLoading(false);
    }
  };

  const showUpdateForm = (record: UserCarrier) => {
    setUpdateForm(
      <ClientUpdateCarrierForm
        data={record}
        onCancel={hideUpdateForm}
        onOk={updateHandler}
        visible
      />
    );
  };

  const columns = [
    {
      title: '账号名称',
      key: 'accountName',
      dataIndex: 'accountName'
    },
    {
      title: '账号',
      key: 'accountId',
      dataIndex: 'accountId'
    },
    {
      title: '物流公司',
      key: 'carrier',
      dataIndex: 'carrier'
    },
    {
      title: '关联账号',
      key: 'connectedAccount',
      dataIndex: 'connectedAccount'
    },
    {
      title: '物流服务',
      key: 'services',
      dataIndex: 'services',
      render: (services: string[] | undefined) => {
        if (!services) return '-';
        const result = services.length !== 0 ? services.join(', ') : '-';
        return result;
      }
    },
    {
      title: '操作中心',
      key: 'facilities',
      dataIndex: 'facilities',
      render: (facilities: string[] | undefined) => {
        if (!facilities) return '-';
        const result = facilities.length !== 0 ? facilities.join(', ') : '-';
        return result;
      }
    },
    {
      title: '费率',
      key: 'fee',
      dataIndex: 'fee',
      render: (text: number, record: UserCarrier) => {
        let prefix = '';
        let surfix = '';
        if (record.billingType === FEE_TYPE_KEYS.AMOUNT) {
          prefix = '$';
        } else {
          surfix = '%';
        }
        surfix += ` / ${FEE_CALCULATE_BASE[record.feeBase].name}`;
        return `${prefix}${text}${surfix}`;
      }
    },
    {
      title: '备注',
      key: 'note',
      dataIndex: 'note'
    },
    {
      title: '更新日期',
      key: 'updatedAt',
      dataIndex: 'updatedAt',
      render: (date: string) => {
        return dayjs(date).format('YYYY/MM/DD');
      }
    },
    {
      title: '状态',
      key: 'isActive',
      dataIndex: 'isActive',
      render: (active: boolean, record: UserCarrier) => (
        <Switch
          checkedChildren="启用"
          unCheckedChildren="停用"
          defaultChecked
          checked={active}
          onClick={() => statusChangeHandler(!active, record)}
        />
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (text: string, record: UserCarrier) => (
        <Space size={0} split={<Divider type="vertical" />}>
          <Button
            size="small"
            type="link"
            onClick={() => showUpdateForm(record)}
          >
            修改
          </Button>
          <Popconfirm
            title="确认删除该账号?"
            placement="topRight"
            onConfirm={() => deleteHandler(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button size="small" type="link">
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div>
      <ClientConnectCarrierForm
        visible={showCreateForm}
        onCancel={hideCreateFormHandler}
        onOk={createHandler}
      />
      {updateForm}
      <PageHeader
        title=""
        subTitle=""
        extra={
          <Button
            key="1"
            type="primary"
            icon={<PlusOutlined />}
            onClick={showCreateFormHandler}
          >
            关联物流账号
          </Button>
        }
      />
      <Table
        rowKey={(record: UserCarrier) => record.id}
        columns={columns}
        dataSource={data}
        pagination={false}
        loading={tableLoading}
        scroll={{ x: true }}
      />
    </div>
  );
};

export default ClientCarrierPanel;
