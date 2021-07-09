import { Button, Modal, Table } from 'antd';
import React, { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectThirdpartyPriceTableModal,
  setPriceTableModalShow
} from '../../redux/carrier/thirdpartySlice';
import { ThirdPartyPrice } from '../../shared/types/carrier';
import { CURRENCY_SIGNS } from '../../shared/utils/constants';

interface ViewPriceModalProps {
  price: ThirdPartyPrice;
  zones: string[];
}

const ViewPriceModal = ({
  price,
  zones
}: ViewPriceModalProps): ReactElement => {
  const dispatch = useDispatch();
  const showModal = useSelector(selectThirdpartyPriceTableModal);

  const columns = zones.map((ele) => {
    return {
      title: `${ele} (${CURRENCY_SIGNS[price.currency]})`,
      key: ele,
      dataIndex: ele
    };
  });

  return (
    <Modal
      width="500"
      title="三方价格表"
      footer={
        <Button onClick={() => dispatch(setPriceTableModalShow(false))}>
          取消
        </Button>
      }
      visible={showModal}
      closable={false}
    >
      <Table<Record<string, string>>
        rowKey={(record) => record.weight}
        scroll={{ x: 500 }}
        columns={[
          {
            title: `Weight (${price.weightUnit})`,
            key: 'weight',
            dataIndex: 'weight',
            fixed: 'left',
            render: (weight: string, record) => {
              return record[Object.keys(record)[0]];
            }
          },
          ...columns
        ]}
        dataSource={price.data}
      />
    </Modal>
  );
};

export default ViewPriceModal;
