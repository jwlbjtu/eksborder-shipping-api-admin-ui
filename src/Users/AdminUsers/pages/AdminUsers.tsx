import React, { ReactElement, useContext, useEffect, useState } from 'react';
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
import {
  DEFAULT_SERVER_HOST,
  ROLES_TO_DISPLAY,
  SERVER_ROUTES
} from '../../../shared/utils/constants';
import CreateAdminForm from '../components/CreateAdminForm';
import axios from '../../../shared/utils/axios-base';
import errorHandler from '../../../shared/utils/errorHandler';
import { CreateUserData, User } from '../../../shared/types/user';
import AuthContext from '../../../shared/components/context/auth-context';

type AdminUsersProps = RouteComponentProps;

const AdminUsers = ({ history }: AdminUsersProps): ReactElement => {
  const auth = useContext(AuthContext);
  const [adminData, setAdminData] = useState<User[]>([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [showCreateAdminForm, setShowCreateAdminForm] = useState(false);

  useEffect(() => {
    setTableLoading(true);
    axios
      .get(`${SERVER_ROUTES.USERS}/list/admins`, {
        headers: {
          Authorization: `${auth.userData?.token_type} ${auth.userData?.token}`
        }
      })
      .then((response) => {
        setAdminData(response.data);
      })
      .catch((error) => {
        // TODO: 401 log out user
        errorHandler(error);
      })
      .finally(() => setTableLoading(false));
  }, [auth]);

  const deleteAdminUserHandler = async (id: string) => {
    setTableLoading(true);
    try {
      await axios.delete(`${SERVER_ROUTES.USERS}/${id}`, {
        headers: {
          Authorization: `${auth.userData?.token_type} ${auth.userData?.token}`
        }
      });
      const newData = adminData.filter((item) => item.id !== id);
      setAdminData(newData);
    } catch (error) {
      errorHandler(error);
    } finally {
      setTableLoading(false);
    }
  };

  const statusChangeHandler = async (active: boolean, value: User) => {
    setTableLoading(true);
    try {
      const data = { ...value, isActive: active };
      const response = await axios.put(SERVER_ROUTES.USERS, data, {
        headers: {
          Authorization: `${auth.userData?.token_type} ${auth.userData?.token}`
        }
      });
      const updatedUser = response.data;
      const newData = [...adminData];
      const record = newData.find((item) => item.id === updatedUser.id);
      if (record) {
        record.isActive = updatedUser.isActive;
        setAdminData(newData);
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setTableLoading(false);
    }
  };

  const hideCreateAdminFormHandler = () => setShowCreateAdminForm(false);
  const showCreateAdminFormHandler = () => setShowCreateAdminForm(true);

  const createAdminHandler = async (data: CreateUserData) => {
    setTableLoading(true);
    hideCreateAdminFormHandler();
    try {
      const response = await axios.post(SERVER_ROUTES.USERS, data, {
        headers: {
          Authorization: `${auth.userData?.token_type} ${auth.userData?.token}`
        }
      });
      const newUser = response.data;
      const newData = [...adminData, newUser];
      setAdminData(newData);
    } catch (error) {
      errorHandler(error);
    } finally {
      setTableLoading(false);
    }
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
            onConfirm={() => deleteAdminUserHandler(record.id)}
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
        rowKey={(record: User) => record.id}
        columns={columns}
        dataSource={adminData}
        pagination={false}
        loading={tableLoading}
      />
    </div>
  );
};

export default AdminUsers;
