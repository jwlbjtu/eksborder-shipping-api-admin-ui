import React, { ReactElement, useEffect, useState } from 'react';
import {
  PageHeader,
  Table,
  Divider,
  Button,
  Avatar,
  Switch,
  Space,
  Popconfirm
} from 'antd';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import _ from 'lodash';
import { RouteComponentProps } from 'react-router-dom';
import { ADMIN_SAMPLE_DATA } from '../../../shared/utils/constants';
import CreateAdminForm from '../components/CreateAdminForm';

type AdminUsersProps = RouteComponentProps;

const AdminUsers = ({ history }: AdminUsersProps): ReactElement => {
  const [adminData, setAdminData] = useState<any[]>([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [showCreateAdminForm, setShowCreateAdminForm] = useState(false);

  useEffect(() => {
    // TODO: Call back end to get data
    setTableLoading(true);
    setTimeout(() => {
      setAdminData(ADMIN_SAMPLE_DATA);
      setTableLoading(false);
    }, 1000);
  }, []);

  const deleteAdminUserHandler = (key: number) => {
    // TODO: connect to backend
    setTableLoading(true);
    setTimeout(() => {
      const newData = adminData.filter((item) => item.key !== key);
      setAdminData(newData);
      setTableLoading(false);
    }, 2000);
  };

  const statusChangeHandler = (key: number) => {
    // TODO: connect to backend
    setTableLoading(true);
    setTimeout(() => {
      const newData = [...adminData];
      const record = newData.find((item) => item.key === key);
      if (record) {
        record.active = !record.active;
      }
      setAdminData(newData);
      setTableLoading(false);
    }, 2000);
  };

  const hideCreateAdminFormHandler = () => setShowCreateAdminForm(false);
  const showCreateAdminFormHandler = () => setShowCreateAdminForm(true);

  const createAdminHandler = (values: any) => {
    // TODO: connect to backend
    setTableLoading(true);
    hideCreateAdminFormHandler();
    setTimeout(() => {
      const account = {
        ..._.omit(values, ['confirm-password']),
        key: 5,
        date: '2020/12/18',
        role: values.superAdmin ? 'Super' : 'Admin'
      };
      const newData = [...adminData, account];
      setAdminData(newData);
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
      title: '姓名',
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
      title: '权限',
      key: 'role',
      dataIndex: 'role'
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
            onClick={() => history.push(`/admins/${record.key}`)}
          >
            查看
          </Button>
          <Popconfirm
            title="确认删除该账号?"
            placement="topRight"
            onConfirm={() => deleteAdminUserHandler(record.key)}
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
      <CreateAdminForm
        visible={showCreateAdminForm}
        onCancel={hideCreateAdminFormHandler}
        onOk={createAdminHandler}
      />
      <PageHeader
        title="管理员账号"
        subTitle="系统内部用户账号管理"
        extra={
          <Button
            key="1"
            type="primary"
            icon={<PlusOutlined />}
            onClick={showCreateAdminFormHandler}
          >
            创建账号
          </Button>
        }
      />
      <Divider />
      <Table
        columns={columns}
        dataSource={adminData}
        pagination={false}
        loading={tableLoading}
      />
    </div>
  );
};

export default AdminUsers;
