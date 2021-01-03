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
import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import axios from '../../../shared/utils/axios-base';
import CreateClientForm from '../components/CreateClientForm';
import {
  DEFAULT_SERVER_HOST,
  SERVER_ROUTES,
  USER_ROLES
} from '../../../shared/utils/constants';
import errorHandler from '../../../shared/utils/errorHandler';
import { CreateUserData, User } from '../../../shared/types/user';
import AuthContext from '../../../shared/components/context/auth-context';

type ClientUsersProps = RouteComponentProps;

const ClientUsers = ({ history }: ClientUsersProps): ReactElement => {
  const auth = useContext(AuthContext);
  const [clientsData, setClientsData] = useState<User[]>([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [showCreateClientForm, setShowCreateClientForm] = useState(false);

  useEffect(() => {
    setTableLoading(true);
    axios
      .get(`${SERVER_ROUTES.USERS}/list/${USER_ROLES.API_USER}`, {
        headers: {
          Authorization: `${auth.userData?.token_type} ${auth.userData?.token}`
        }
      })
      .then((response) => {
        setClientsData(response.data);
      })
      .catch((error) => {
        errorHandler(error);
      })
      .finally(() => setTableLoading(false));
  }, [auth]);

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
      const newData = [...clientsData];
      const record = newData.find((item) => item.id === updatedUser.id);
      if (record) {
        record.isActive = !record.isActive;
        setClientsData(newData);
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setTableLoading(false);
    }
  };

  const hideCreateClientFormHandler = () => setShowCreateClientForm(false);
  const showCreateClientFormHandler = () => setShowCreateClientForm(true);

  const createAdminHandler = async (data: CreateUserData) => {
    setTableLoading(true);
    hideCreateClientFormHandler();
    try {
      const response = await axios.post(SERVER_ROUTES.USERS, data, {
        headers: {
          Authorization: `${auth.userData?.token_type} ${auth.userData?.token}`
        }
      });
      const newUser = response.data;
      const newData = [...clientsData, newUser];
      setClientsData(newData);
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
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={clientsData}
        loading={tableLoading}
      />
    </div>
  );
};

export default ClientUsers;
