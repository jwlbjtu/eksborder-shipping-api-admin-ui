import { UploadOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Modal, Select, Upload } from 'antd';
import React, { ReactElement, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchThirdPartyAccounts,
  selectZoneUploadModal,
  setLoading,
  setZoneUploadModalShow
} from '../../redux/carrier/thirdpartySlice';
import { selectCurUser } from '../../redux/user/userSlice';
import { Carrier, ThirdPartyAccount } from '../../shared/types/carrier';
import {
  Currency,
  DEFAULT_SERVER_HOST,
  SERVER_ROUTES,
  WeightUnit
} from '../../shared/utils/constants';

const { Option } = Select;

interface ThirdPartyZoneUploadModalProps {
  account: ThirdPartyAccount;
  carrier: Carrier;
}

const ThirdPartyZoneUploadModal = ({
  account,
  carrier
}: ThirdPartyZoneUploadModalProps): ReactElement => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurUser);
  const showModal = useSelector(selectZoneUploadModal);
  const [showError, setShowError] = useState(false);

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
      dispatch(setZoneUploadModalShow(false));
      dispatch(fetchThirdPartyAccounts(carrier.id));
    } else if (info.file.status === 'error') {
      dispatch(setLoading(false));
      setShowError(true);
    }
  };

  return (
    <Modal
      title="上传分区"
      visible={showModal}
      footer={
        <Button onClick={() => dispatch(setZoneUploadModalShow(false))}>
          取消
        </Button>
      }
    >
      {showError && (
        <Alert
          style={{ padding: '3px 15px', marginBottom: '10px' }}
          type="error"
          showIcon
          message="Failed to upload. Please try another file or contact us for support."
        />
      )}
      <Form>
        <Form.Item>
          <Upload
            name="zone_csv"
            multiple={false}
            accept=".csv"
            showUploadList={false}
            action={`${DEFAULT_SERVER_HOST}${SERVER_ROUTES.THIRDPARTY_ACCOUNTS}${SERVER_ROUTES.ZONE}`}
            headers={{
              Authorization: `${user?.token_type} ${user?.token}`
            }}
            data={{
              thirdpartyId: account.id
            }}
            onChange={uploadHandler}
          >
            <Button icon={<UploadOutlined />} size="large">
              上传分区
            </Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ThirdPartyZoneUploadModal;
