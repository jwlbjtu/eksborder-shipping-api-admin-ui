import React, { ReactElement, useEffect, useState } from 'react';
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
import _ from 'lodash';
import { CLIENT_CARRIERS_DATA } from '../../../shared/utils/constants';

import ClientConnectCarrierForm from './ClientConnectCarrierForm';
import ClientUpdateCarrierForm from './ClientUpdateCarrierForm';

interface ClientCarrierPanelProps {
  id: string;
}

const ClientCarrierPanel = ({ id }: ClientCarrierPanelProps): ReactElement => {
  const [data, setData] = useState<any[]>([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [updateForm, setUpdateForm] = useState<ReactElement | null>(null);

  useEffect(() => {
    // TODO: Call back end to get data
    setTableLoading(true);
    setTimeout(() => {
      // @ts-expect-error: fix later
      setData(CLIENT_CARRIERS_DATA[id]);
      setTableLoading(false);
    }, 1000);
  }, [id]);

  const deleteHandler = (key: number) => {
    // TODO: connect to backend
    setTableLoading(true);
    setTimeout(() => {
      const newData = data.filter((item) => item.key !== key);
      setData(newData);
      setTableLoading(false);
    }, 2000);
  };

  const statusChangeHandler = (key: number) => {
    // TODO: connect to backend
    setTableLoading(true);
    setTimeout(() => {
      const newData = [...data];
      const record = newData.find((item) => item.key === key);
      if (record) {
        record.active = !record.active;
      }
      setData(newData);
      setTableLoading(false);
    }, 2000);
  };

  const hideCreateFormHandler = () => setShowCreateForm(false);
  const showCreateFormHandler = () => setShowCreateForm(true);
  const createHandler = (values: any) => {
    // TODO: connect to backend
    setTableLoading(true);
    hideCreateFormHandler();
    setTimeout(() => {
      const account = {
        key: 5,
        name: values.name,
        accountId: '4n5pxq24kpiob12oz2',
        carrier: values.carrier,
        connectedAccount: values.connectedAccount,
        services: values.services,
        facilities: values.facilities,
        fee: values.fee,
        feeType: values.feeType,
        feeCalBase: values.feeCalBase,
        remark: values.remark,
        active: true,
        date: '2020/12/27'
      };
      const newData = [...data, account];
      setData(newData);
      setTableLoading(false);
    }, 2000);
  };

  const hideUpdateForm = () => setUpdateForm(null);

  const updateHandler = (values: any) => {
    // TODO: connect to backend
    hideUpdateForm();
    setTableLoading(true);
    setTimeout(() => {
      const newData = [...data];
      const newRecord = newData.find((item: any) => item.key === values.key);
      Object.keys(values).forEach((key: string) => {
        newRecord[key] = values[key];
      });
      newRecord.date = '2020/12/28';
      setData(newData);
      setTableLoading(false);
    }, 2000);
  };

  const showUpdateForm = (record: any) => {
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
      key: 'name',
      dataIndex: 'name'
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
      render: (text: any[]) => {
        const result = text ? text.map((item) => item.id).join(', ') : '-';
        return result;
      }
    },
    {
      title: '操作中心',
      key: 'facilities',
      dataIndex: 'facilities',
      render: (text: any[]) => {
        const result = text ? text.join(', ') : '-';
        return result;
      }
    },
    {
      title: '费率',
      key: 'fee',
      dataIndex: 'fee',
      render: (text: number, record: any) => {
        let prefix = '';
        let surfix = '';
        if (record.feeType === 'amount') {
          prefix = '$ ';
        } else {
          surfix = '%';
        }

        if (record.feeCalBase === 'price') surfix += ' 价格';
        if (record.feeCalBase === 'order') surfix += ' 每票';
        if (record.feeCalBase === 'weight') surfix += ' 每公斤';

        return `${prefix}${text}${surfix}`;
      }
    },
    {
      title: '备注',
      key: 'remark',
      dataIndex: 'remark'
    },
    {
      title: '更新日期',
      key: 'date',
      dataIndex: 'date'
    },
    {
      title: '状态',
      key: 'active',
      dataIndex: 'active',
      render: (text: boolean, record: any) => (
        <Switch
          checkedChildren="启用"
          unCheckedChildren="停用"
          defaultChecked
          checked={record.active}
          onClick={() => statusChangeHandler(record.key)}
        />
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (text: string, record: any) => (
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
            onConfirm={() => deleteHandler(record.key)}
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
