import React, { ReactElement, useEffect } from 'react';
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
import { RouteComponentProps } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  DEFAULT_SERVER_HOST,
  ROLES_TO_DISPLAY
} from '../../../shared/utils/constants';
import CreateAdminForm from '../components/CreateAdminForm';
import { User } from '../../../shared/types/user';
import {
  deleteUserByIdHandler,
  fetchUsersByRoleHandler,
  selectAdminUsers,
  selectLoading,
  setShowCreateAdmin,
  updateUserHandler
} from '../../../redux/user/userDataSlice';

type AdminUsersProps = RouteComponentProps;

const AdminUsers = ({ history }: AdminUsersProps): ReactElement => {
  const dispatch = useDispatch();
  const adminUsers = useSelector(selectAdminUsers);
  const loading = useSelector(selectLoading);

  useEffect(() => {
    dispatch(fetchUsersByRoleHandler('admins'));
  }, [dispatch]);

  const statusChangeHandler = async (active: boolean, value: User) => {
    const data = { ...value, isActive: active };
    dispatch(updateUserHandler(data));
  };

  const columns = [
    {
      title: '',
      key: 'logoImage',
      render: (text: string, record: User) => {
        return (
          <Avatar
            src={
              record.logoImage && `${DEFAULT_SERVER_HOST}/${record.logoImage}`
            }
            icon={<UserOutlined />}
          />
        );
      }
    },
    {
      title: '姓名',
      key: 'name',
      render: (text: string, record: User) => {
        return `${record.lastName} ${record.firstName}`;
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
      dataIndex: 'role',
      render: (role: string) => {
        return ROLES_TO_DISPLAY[role];
      }
    },
    {
      title: '状态',
      key: 'isActive',
      dataIndex: 'isActive',
      render: (active: boolean, record: User) => (
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
      render: (text: string, record: User) => (
        <Space size={0} split={<Divider type="vertical" />}>
          <Button
            size="small"
            type="link"
            // eslint-disable-next-line react/prop-types
            onClick={() => history.push(`/admins/${record.id}`)}
          >
            查看
          </Button>
          <Popconfirm
            title="确认删除该账号?"
            placement="topRight"
            onConfirm={() => dispatch(deleteUserByIdHandler(record.id))}
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
      <CreateAdminForm />
      <PageHeader
        title="管理员账号"
        subTitle="系统内部用户账号管理"
        extra={
          <Button
            key="1"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => dispatch(setShowCreateAdmin(true))}
          >
            创建账号
          </Button>
        }
      />
      <Divider />
      <Table
        rowKey={(record: User) => record.id}
        columns={columns}
        dataSource={adminUsers}
        pagination={false}
        loading={loading}
      />
    </div>
  );
};

export default AdminUsers;
