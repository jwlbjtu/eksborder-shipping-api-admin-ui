import { UploadOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Modal, Upload } from 'antd';
import React, { ReactElement, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchReconciliationRecords,
  selectShowReconciliationModal,
  setLoading,
  setShowReconciliationModal
} from '../../redux/accounting/accountingSlice';
import {
  DEFAULT_SERVER_HOST,
  SERVER_ROUTES
} from '../../shared/utils/constants';
import { selectCurUser } from '../../redux/user/userSlice';

const ReconciliationModal = (): ReactElement => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurUser);
  const showReciliationModal = useSelector(selectShowReconciliationModal);
  const [showError, setShowError] = useState(false);
  const [reconciliationName, setReconciliationName] = useState('');

  useEffect(() => {
    setShowError(false);
  }, []);

  const uploadHandler = (info: any) => {
    if (info.file.status === 'uploading') {
      dispatch(setLoading(true));
    }
    if (info.file.status === 'done') {
      dispatch(setLoading(false));
      setShowError(false);
      dispatch(setShowReconciliationModal(false));
      dispatch(fetchReconciliationRecords());
    } else if (info.file.status === 'error') {
      dispatch(setLoading(false));
      setShowError(true);
    }
  };

  const handleCancelClicked = () => {
    setReconciliationName('');
    dispatch(setShowReconciliationModal(false));
  };

  return (
    <Modal
      title="上传对账账单"
      visible={showReciliationModal}
      footer={<Button onClick={handleCancelClicked}>取消</Button>}
    >
      {showError && (
        <Alert
          style={{ padding: '3px 15px', marginBottom: '10px' }}
          type="error"
          showIcon
          message="上传对账账单失败"
        />
      )}
      <Form>
        <Form.Item label="对账名称">
          <input
            type="text"
            onChange={(event) => setReconciliationName(event.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Upload
            name="reconciliation_csv"
            multiple={false}
            accept=".csv"
            showUploadList={false}
            action={`${DEFAULT_SERVER_HOST}${SERVER_ROUTES.ACCOUNTING}${SERVER_ROUTES.RECONCILIATION_CSV}`}
            headers={{
              Authorization: `${user?.token_type} ${user?.token}`
            }}
            data={{
              name: reconciliationName
            }}
            onChange={uploadHandler}
          >
            <Button icon={<UploadOutlined />} size="large">
              上传对账账单
            </Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ReconciliationModal;
