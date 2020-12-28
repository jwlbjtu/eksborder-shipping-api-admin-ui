import React, { ReactElement, useEffect, useState } from 'react';
import { Spin, Divider, Tabs } from 'antd';
import { useParams } from 'react-router-dom';

import _ from 'lodash';
import {
  CLIENT_MANAGE_OPERATIONS,
  CLIENT_SAMPLE_DATA
} from '../../../shared/utils/constants';

import ClientPageHeader from '../components/ClientPageHeader';
import ProfilePage from '../../ProfilePage';
import ClientInfoPanel from '../components/ClientInfoPanel';
import PasswordPanel from '../../PasswordPanel';
import ClientBillingPanel from '../components/ClientBillingPanel';
import ClientAPITokenPanel from '../components/ClientAPITokenPanel';
import ClientCarrierPanel from '../components/ClientCarrierPanel';
import ClientShippingPanel from '../components/ClientShippingPanel';

const { TabPane } = Tabs;

const ClientManagePage = (): ReactElement => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [subloading, setSubloading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setData(CLIENT_SAMPLE_DATA[+id - 1]);
      setLoading(false);
    }, 1000);
  }, [id]);

  const infoUpdatedHandler = (values: any) => {
    // TODO: connect to back end
    setSubloading(true);
    setTimeout(() => {
      console.log(`Info updated from client management`);
      console.log(values);
      const newData = { ...data, ...values, date: '2020/12/26' };
      setData(newData);
      console.log(newData);
      setSubloading(false);
    }, 1000);
  };

  const passwordUpdatedHandler = (values: any) => {
    // TODO: connect to back end
    setSubloading(true);
    setTimeout(() => {
      console.log(`Password updated from client management`);
      console.log(values);
      setSubloading(false);
    }, 1000);
  };

  const updateBalanceHandler = (value: number) => {
    setData({ ...data, balance: value });
  };

  const createApiTokenHandler = () => {
    setSubloading(true);
    setTimeout(() => {
      // TODO: call back end
      const newData = { ...data };
      newData.apiToken = 'TestSartTextEndTestText';
      setData(newData);
      setSubloading(false);
    }, 1000);
  };

  const deleteApiTokenHandler = () => {
    setSubloading(true);
    setTimeout(() => {
      // TODO: call back end
      const newData = _.omit(data, ['apiToken']);
      setData(newData);
      setSubloading(false);
    }, 1000);
  };

  return (
    <>
      {loading ? (
        <div style={{ marginTop: '15%', textAlign: 'center' }}>
          <Spin size="large" />
        </div>
      ) : (
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
                            onSubmit={infoUpdatedHandler}
                          />,
                          <PasswordPanel onSumbit={passwordUpdatedHandler} />
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
                      updateBalance={updateBalanceHandler}
                    />
                  </TabPane>
                  <TabPane
                    tab={CLIENT_MANAGE_OPERATIONS.API_KEYS}
                    key={CLIENT_MANAGE_OPERATIONS.API_KEYS}
                  >
                    <ClientAPITokenPanel
                      token={data.apiToken}
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
                    <ClientShippingPanel />
                  </TabPane>
                </Tabs>
              </>
            }
          />
        </Spin>
      )}
    </>
  );
};

export default ClientManagePage;
