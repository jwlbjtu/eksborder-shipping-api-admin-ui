import _ from 'lodash';
import React, { ReactElement, useEffect, useState } from 'react';
import { PageHeader, Table, Divider, Button } from 'antd';

const ClientShippingPanel = (): ReactElement => {
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
      title: '',
      dataIndex: 'logo',
      key: 'logo'
    },
    {
      title: '物流公司',
      dataIndex: 'carrier',
      key: 'carrier'
    },
    {
      title: '服务',
      dataIndex: 'service',
      key: 'service'
    },
    {
      title: '邮寄费',
      dataIndex: 'rate',
      key: 'rate'
    },
    {
      title: '收件地址',
      dataIndex: 'receipent',
      key: 'receipent'
    },
    {
      title: 'Tracking',
      dataIndex: 'tracking',
      key: 'tracking'
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date'
    },
    {
      title: 'Manifested',
      dataIndex: 'manifested',
      key: 'manifested'
    },
    {
      title: 'Label',
      dataIndex: 'label',
      key: 'label'
    }
  ];

  return (
    <div>
      <PageHeader
        title=""
        extra={[
          <Button type="primary" disabled>
            生成 Manifest
          </Button>,
          <Button type="primary" disabled>
            查看 Manifest
          </Button>
        ]}
      />
      <Table columns={columns} dataSource={[]} loading={tableLoading} />
    </div>
  );
};

export default ClientShippingPanel;
