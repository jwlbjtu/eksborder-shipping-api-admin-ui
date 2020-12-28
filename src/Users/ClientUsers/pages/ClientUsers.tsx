import _ from 'lodash';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Divider,
  PageHeader,
  Space,
  Switch,
  Table
} from 'antd';
import React, { ReactElement, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import CreateClientForm from '../components/CreateClientForm';
import { CLIENT_SAMPLE_DATA } from '../../../shared/utils/constants';

type ClientUsersProps = RouteComponentProps;

const ClientUsers = ({ history }: ClientUsersProps): ReactElement => {
  const [clientsData, setClientsData] = useState<any[]>([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [showCreateClientForm, setShowCreateClientForm] = useState(false);

  useEffect(() => {
    // TODO: Call back end to get data
    setTableLoading(true);
    setTimeout(() => {
      setClientsData(CLIENT_SAMPLE_DATA);
      setTableLoading(false);
    }, 1000);
  }, []);

  const statusChangeHandler = (key: number) => {
    // TODO: connect to backend
    setTableLoading(true);
    setTimeout(() => {
      const newData = [...clientsData];
      const record = newData.find((item) => item.key === key);
      if (record) {
        record.active = !record.active;
      }
      setClientsData(newData);
      setTableLoading(false);
    }, 2000);
  };

  const hideCreateClientFormHandler = () => setShowCreateClientForm(false);
  const showCreateClientFormHandler = () => setShowCreateClientForm(true);

  const createAdminHandler = (values: any) => {
    // TODO: connect to backend
    setTableLoading(true);
    hideCreateClientFormHandler();
    setTimeout(() => {
      const account = {
        ..._.omit(values, ['confirm-password']),
        key: 5,
        date: '2020/12/25'
      };
      const newData = [...clientsData, account];
      setClientsData(newData);
      setTableLoading(false);
    }, 2000);
  };

  const columns = [
    {
      title: '',
      key: 'avatar',
      render: (text: string, record: any) => {
        return <Avatar src={record.avatar} icon={<UserOutlined />} />;
      }
    },
    {
      title: '公司名称',
      key: 'company',
      dataIndex: 'company'
    },
    {
      title: '联系人',
      key: 'name',
      render: (text: string, record: any) => {
        return `${record.lastname} ${record.firstname}`;
      }
    },
    {
      title: 'E-mail',
      key: 'email',
      dataIndex: 'email'
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
      render: (text: string, record: any) => (
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
            // eslint-disable-next-line react/prop-types
            onClick={() => history.push(`/clients/${record.key}`)}
          >
            管理
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div>
      <CreateClientForm
        visible={showCreateClientForm}
        onCancel={hideCreateClientFormHandler}
        onOk={createAdminHandler}
      />
      <PageHeader
        title="货代账号"
        subTitle="货代账号和和业务管理"
        extra={
          <Button
            key="1"
            type="primary"
            icon={<PlusOutlined />}
            onClick={showCreateClientFormHandler}
          >
            添加用户
          </Button>
        }
      />
      <Divider />
      <Table
        columns={columns}
        dataSource={clientsData}
        loading={tableLoading}
      />
    </div>
  );
};

export default ClientUsers;
