import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { Spin, Divider, Tabs, message } from 'antd';
import { useParams } from 'react-router-dom';

import _ from 'lodash';
import axios from '../../../shared/utils/axios-base';
import {
  CLIENT_MANAGE_OPERATIONS,
  SERVER_ROUTES
} from '../../../shared/utils/constants';

import ClientPageHeader from '../components/ClientPageHeader';
import ProfilePage from '../../ProfilePage';
import ClientInfoPanel from '../components/ClientInfoPanel';
import PasswordPanel from '../../PasswordPanel';
import ClientBillingPanel from '../components/ClientBillingPanel';
import ClientAPITokenPanel from '../components/ClientAPITokenPanel';
import ClientCarrierPanel from '../components/ClientCarrierPanel';
import ClientShippingPanel from '../components/ClientShippingPanel';
import {
  PasswordFormValue,
  UpdateClientData,
  User
} from '../../../shared/types/user';
import errorHandler from '../../../shared/utils/errorHandler';
import LoadError from '../../../shared/components/ErrorPages';
import AuthContext from '../../../shared/components/context/auth-context';

const { TabPane } = Tabs;

const ClientManagePage = (): ReactElement => {
  const auth = useContext(AuthContext);
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [subloading, setSubloading] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setLoading(true);
    setFailed(false);
    axios
      .get(`${SERVER_ROUTES.USERS}/${id}`, {
        headers: {
          Authorization: `${auth.userData?.token_type} ${auth.userData?.token}`
        }
      })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        errorHandler(error);
        setFailed(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, auth]);

  const getUserData = async () => {
    setLoading(true);
    setFailed(false);
    try {
      const response = await axios.get(`${SERVER_ROUTES.USERS}/${id}`, {
        headers: {
          Authorization: `${auth.userData?.token_type} ${auth.userData?.token}`
        }
      });
      setData(response.data);
    } catch (error) {
      errorHandler(error);
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };

  const infoUpdatedHandler = async (updateData: UpdateClientData) => {
    setSubloading(true);
    try {
      if (data) {
        const response = await axios.put(
          SERVER_ROUTES.USERS,
          {
            id: data.id,
            ...updateData
          },
          {
            headers: {
              Authorization: `${auth.userData?.token_type} ${auth.userData?.token}`
            }
          }
        );
        const updatedUser = response.data;
        setData(updatedUser);
        message.success('用户信息更新成功！');
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setSubloading(false);
    }
  };

  const passwordUpdatedHandler = async (values: PasswordFormValue) => {
    setSubloading(true);
    try {
      if (data) {
        await axios.put(
          `${SERVER_ROUTES.USERS}/password`,
          {
            id: data.id,
            ...values
          },
          {
            headers: {
              Authorization: `${auth.userData?.token_type} ${auth.userData?.token}`
            }
          }
        );
        message.success('密码更新成功！');
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setSubloading(false);
    }
  };

  const logoUploadHandler = (imageUrl: string) => {
    if (data) {
      const newData = { ...data, logoImage: imageUrl };
      setData(newData);
    }
  };

  const updateBalanceHandler = async () => {
    setSubloading(true);
    try {
      const response = await axios.get(`${SERVER_ROUTES.USERS}/${id}`, {
        headers: {
          Authorization: `${auth.userData?.token_type} ${auth.userData?.token}`
        }
      });
      setData(response.data);
    } catch (error) {
      errorHandler(error);
    } finally {
      setSubloading(false);
    }
  };

  const createApiTokenHandler = async () => {
    setSubloading(true);
    try {
      if (data) {
        const response = await axios.get(`${SERVER_ROUTES.API}/refresh/${id}`, {
          headers: {
            Authorization: `${auth.userData?.token_type} ${auth.userData?.token}`
          }
        });
        const newToken = response.data.token;
        const newData = { ...data, apiToken: newToken };
        setData(newData);
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setSubloading(false);
    }
  };

  const deleteApiTokenHandler = async () => {
    setSubloading(true);
    try {
      await axios.get(`${SERVER_ROUTES.API}/revoke/${id}`, {
        headers: {
          Authorization: `${auth.userData?.token_type} ${auth.userData?.token}`
        }
      });
      const newData = _.omit(data, ['apiToken']);
      setData(newData);
    } catch (error) {
      errorHandler(error);
    } finally {
      setSubloading(false);
    }
  };

  const content = failed ? (
    <LoadError
      title="获取用户信息错误，请稍后再试！"
      text="再试一次"
      onButtonClick={getUserData}
    />
  ) : (
    data && (
      <Spin size="large" spinning={subloading}>
        <ClientPageHeader
          data={data}
          footer={
            <>
              <Divider />
              <Tabs defaultActiveKey={CLIENT_MANAGE_OPERATIONS.ACCOUNT}>
                <TabPane
                  tab={CLIENT_MANAGE_OPERATIONS.ACCOUNT}
                  key={CLIENT_MANAGE_OPERATIONS.ACCOUNT}
                >
                  <>
                    <Divider />
                    <ProfilePage
                      panels={[
                        <ClientInfoPanel
                          data={data}
                          onUpload={logoUploadHandler}
                          onSubmit={infoUpdatedHandler}
                        />,
                        <PasswordPanel
                          isSelf={false}
                          onSumbit={passwordUpdatedHandler}
                        />
                      ]}
                    />
                  </>
                </TabPane>
                <TabPane
                  tab={CLIENT_MANAGE_OPERATIONS.BILLING_INFO}
                  key={CLIENT_MANAGE_OPERATIONS.BILLING_INFO}
                >
                  <ClientBillingPanel
                    id={id}
                    curBalance={data.balance}
                    updateBalance={updateBalanceHandler}
                  />
                </TabPane>
                <TabPane
                  tab={CLIENT_MANAGE_OPERATIONS.API_KEYS}
                  key={CLIENT_MANAGE_OPERATIONS.API_KEYS}
                >
                  <ClientAPITokenPanel
                    token={data.apiToken || ''}
                    onCreate={createApiTokenHandler}
                    onDelete={deleteApiTokenHandler}
                  />
                </TabPane>
                <TabPane
                  tab={CLIENT_MANAGE_OPERATIONS.CARRIERS_CONFIG}
                  key={CLIENT_MANAGE_OPERATIONS.CARRIERS_CONFIG}
                >
                  <ClientCarrierPanel id={id} />
                </TabPane>
                <TabPane
                  tab={CLIENT_MANAGE_OPERATIONS.SHIPPING_RECORDS}
                  key={CLIENT_MANAGE_OPERATIONS.SHIPPING_RECORDS}
                >
                  <ClientShippingPanel id={id} />
                </TabPane>
              </Tabs>
            </>
          }
        />
      </Spin>
    )
  );

  return (
    <>
      {loading ? (
        <div style={{ marginTop: '15%', textAlign: 'center' }}>
          <Spin size="large" />
        </div>
      ) : (
        content
      )}
    </>
  );
};

export default ClientManagePage;
