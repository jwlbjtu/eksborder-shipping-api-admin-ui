import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Divider,
  PageHeader,
  Popconfirm,
  Space,
  Switch,
  Table
} from 'antd';
import React, { ReactElement, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CreateClientForm from '../components/CreateClientForm';
import {
  DEFAULT_SERVER_HOST,
  USER_ROLES
} from '../../../shared/utils/constants';
import { User } from '../../../shared/types/user';
import {
  deleteUserByIdHandler,
  fetchUsersByRoleHandler,
  selectClientUsers,
  selectLoading,
  setShowCreateClient,
  updateUserHandler
} from '../../../redux/user/userDataSlice';

type ClientUsersProps = RouteComponentProps;

const ClientUsers = ({ history }: ClientUsersProps): ReactElement => {
  const dispatch = useDispatch();
  const clientUsers = useSelector(selectClientUsers);
  const loading = useSelector(selectLoading);

  useEffect(() => {
    dispatch(fetchUsersByRoleHandler(USER_ROLES.API_USER));
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
      title: '公司名称',
      key: 'companyName',
      dataIndex: 'companyName'
    },
    {
      title: '联系人',
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
      title: '推荐人',
      key: 'referalName',
      dataIndex: 'referalName'
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
            onClick={() => history.push(`/clients/${record.id}`)}
          >
            管理
          </Button>
          <Popconfirm
            title="确认删除该用户吗?"
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
      <CreateClientForm />
      <PageHeader
        title="货代账号"
        subTitle="货代账号和和业务管理"
        extra={
          <Button
            key="1"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => dispatch(setShowCreateClient(true))}
          >
            添加用户
          </Button>
        }
      />
      <Divider />
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={clientUsers}
        loading={loading}
      />
    </div>
  );
};

export default ClientUsers;
