import React, { ReactElement, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import { PageHeader, Table, Divider, Button, Tag } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchReconciliationRecords,
  selectAccountingLoading,
  selectReconciliationRecords,
  selectShowReconciliationModal,
  setShowReconciliationModal
} from '../../redux/accounting/accountingSlice';
import ReconciliationModal from '../components/ReconciliationModal';
import { ReconciliationRecord } from '../../shared/types/redux-types';

const AccountingPage = (): ReactElement => {
  const dispatch = useDispatch();
  const history = useHistory();
  const loading = useSelector(selectAccountingLoading);
  const showReconciliationModal = useSelector(selectShowReconciliationModal);
  const records = useSelector(selectReconciliationRecords);

  useEffect(() => {
    dispatch(fetchReconciliationRecords());
  }, [dispatch]);

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      render: (_: any, __: any, index: number) => index + 1
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      render: (date: Date) => {
        return (
          <>
            <div>{dayjs(date).format('YYYY/MM/DD')}</div>
            <div>{dayjs(date).format('HH:mm:ss')}</div>
          </>
        );
      }
    },
    {
      title: '对账名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => {
        return status === 0 ? (
          <Tag color="orange">对账中...</Tag>
        ) : (
          <Tag color="green">对账完成</Tag>
        );
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: ReconciliationRecord) =>
        record.status === 1 ? (
          <Button
            type="link"
            onClick={() => history.push(`/accounting/${record.id}`)}
          >
            查看详情
          </Button>
        ) : null
    }
  ];

  const handleReconciliationClicked = () => {
    dispatch(setShowReconciliationModal(true));
  };

  return (
    <div>
      {showReconciliationModal && <ReconciliationModal />}
      <PageHeader
        title="财务对账"
        subTitle="财务对账记录管理"
        extra={[
          <Button
            key="1"
            type="default"
            icon={<SyncOutlined />}
            onClick={() => dispatch(fetchReconciliationRecords())}
            loading={loading}
          />,
          <Button key="2" type="primary" onClick={handleReconciliationClicked}>
            开始对账
          </Button>,
          <Button key="3" type="primary" disabled>
            开始销账
          </Button>
        ]}
      />
      <Divider />
      <Table columns={columns} dataSource={records} loading={loading} />
    </div>
  );
};

export default AccountingPage;
