import { UploadOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Modal, Select, Upload } from 'antd';
import React, { ReactElement, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPriceTableAccounts,
  selectPriceTablePriceModal,
  setLoading,
  setPriceModalShow
} from '../../redux/carrier/priceTableSlice';
import { selectCurUser } from '../../redux/user/userSlice';
import { Carrier, PriceTable } from '../../shared/types/carrier';
import {
  Currency,
  DEFAULT_SERVER_HOST,
  SERVER_ROUTES,
  WeightUnit
} from '../../shared/utils/constants';

const { Option } = Select;

interface PriceTablePriceUploadModalProps {
  account: PriceTable;
  carrier: Carrier;
}

const PriceTablePriceUploadModal = ({
  account,
  carrier
}: PriceTablePriceUploadModalProps): ReactElement => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurUser);
  const showModal = useSelector(selectPriceTablePriceModal);
  const [selectedWeight, setSelectedWeight] = useState(WeightUnit.LB);
  const [selectedCurrency, setSelectedCurrency] = useState(Currency.USD);
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
      dispatch(setPriceModalShow(false));
      dispatch(fetchPriceTableAccounts(carrier.id));
    } else if (info.file.status === 'error') {
      dispatch(setLoading(false));
      setShowError(true);
    }
  };

  return (
    <Modal
      title="上传价格"
      visible={showModal}
      footer={
        <Button onClick={() => dispatch(setPriceModalShow(false))}>取消</Button>
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
        <Form.Item label="重量单位">
          <Select
            value={selectedWeight}
            onChange={(selectValue) => setSelectedWeight(selectValue)}
          >
            {Object.values(WeightUnit).map((ele) => {
              return (
                <Option key={ele} value={ele}>
                  {ele}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item label="货币种类">
          <Select
            value={selectedCurrency}
            onChange={(selectValue) => setSelectedCurrency(selectValue)}
          >
            {Object.values(Currency).map((ele) => {
              return (
                <Option key={ele} value={ele}>
                  {ele}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item>
          <Upload
            name="price_csv"
            multiple={false}
            accept=".csv"
            showUploadList={false}
            action={`${DEFAULT_SERVER_HOST}${SERVER_ROUTES.PRICE_TABLES}${SERVER_ROUTES.CSV}`}
            headers={{
              Authorization: `${user?.token_type} ${user?.token}`
            }}
            data={{
              weightUnit: selectedWeight,
              currency: selectedCurrency,
              priceTableId: account.id
            }}
            onChange={uploadHandler}
          >
            <Button icon={<UploadOutlined />} size="large">
              上传价格
            </Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PriceTablePriceUploadModal;
