import _ from 'lodash';
import React, { ReactElement, useEffect, useState } from 'react';
import { PageHeader, Table, Divider } from 'antd';

const AuditTrail = (): ReactElement => {
  const [tableLoading, setTableLoading] = useState(false);

  useEffect(() => {
    // TODO: Call back end to get data
    setTableLoading(true);
    setTimeout(() => {
      setTableLoading(false);
    }, 1000);
  }, []);

  const columns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date'
    },
    {
      title: '管理员姓名',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '用户名称',
      dataIndex: 'client',
      key: 'client'
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action'
    }
  ];

  return (
    <div>
      <PageHeader title="操作记录" subTitle="记录所有管理的操作" />
      <Divider />
      <Table columns={columns} dataSource={[]} loading={tableLoading} />
    </div>
  );
};

export default AuditTrail;
