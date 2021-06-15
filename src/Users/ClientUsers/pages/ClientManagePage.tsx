import React, { ReactElement, useEffect, useState } from 'react';
import { Divider, Tabs } from 'antd';
import { useHistory, useParams } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { CLIENT_MANAGE_OPERATIONS } from '../../../shared/utils/constants';

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
import {
  createAPITokenHandler,
  deleteAPITokenHandler,
  getUserByIdHandler,
  selectClientUsers,
  updateUserHandler,
  updateUserPasswordHandler
} from '../../../redux/user/userDataSlice';

const { TabPane } = Tabs;

const ClientManagePage = (): ReactElement => {
  const dispatch = useDispatch();
  const history = useHistory();
  const clientUsers = useSelector(selectClientUsers);
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<User | undefined>();

  useEffect(() => {
    const client = clientUsers.find((ele) => ele.id === id);
    if (!client) history.push('/clients');
    setData(client);
  }, [clientUsers, history, id]);

  const infoUpdatedHandler = async (updateData: UpdateClientData) => {
    if (data) {
      dispatch(updateUserHandler({ ...data, ...updateData }));
    }
  };

  const passwordUpdatedHandler = async (values: PasswordFormValue) => {
    if (data) {
      dispatch(updateUserPasswordHandler(data.id, values));
    }
  };

  const logoUploadHandler = () => {
    if (data) {
      dispatch(getUserByIdHandler(data.id));
    }
  };

  const createApiToken = async () => {
    dispatch(createAPITokenHandler(id));
  };

  const deleteApiToken = async () => {
    dispatch(deleteAPITokenHandler(id));
  };

  return (
    <>
      {data && (
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
                  <ClientBillingPanel id={id} curBalance={data.balance} />
                </TabPane>
                <TabPane
                  tab={CLIENT_MANAGE_OPERATIONS.API_KEYS}
                  key={CLIENT_MANAGE_OPERATIONS.API_KEYS}
                >
                  <ClientAPITokenPanel
                    token={data.apiToken || ''}
                    onCreate={createApiToken}
                    onDelete={deleteApiToken}
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
      )}
    </>
  );
};

export default ClientManagePage;
