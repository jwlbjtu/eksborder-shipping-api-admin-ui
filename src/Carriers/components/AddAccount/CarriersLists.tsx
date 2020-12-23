import React, { ReactElement } from 'react';
import { Modal, Button, Row, Image, Space } from 'antd';
import { CARRIERS } from '../../../shared/utils/constants';
import dhleCommerceLogo from '../../../assets/images/carriers/dhl-ecommerce-logo.svg';
import fedexLogo from '../../../assets/images/carriers/fedex-logo.svg';
import upsLogo from '../../../assets/images/carriers/ups-logo.svg';
import uspsLogo from '../../../assets/images/carriers/usps-logo.svg';

interface CarriersListProps {
  visible: boolean;
  handleCancel: () => void;
  imageClicked: (carrier: string) => void;
}

const CarriersList = ({
  visible,
  handleCancel,
  imageClicked
}: CarriersListProps): ReactElement => {
  return (
    <Modal
      width={575}
      bodyStyle={{ minHeight: '300px', maxHeight: '480px' }}
      centered
      title="添加物流账号"
      visible={visible}
      closable={false}
      footer={<Button onClick={handleCancel}>取消</Button>}
    >
      <Row>
        <Space size="middle">
          <Image
            onClick={() => imageClicked(CARRIERS.DHL_ECOMMERCE)}
            style={{ cursor: 'pointer' }}
            width={120}
            height={73.84}
            preview={false}
            src={dhleCommerceLogo}
            alt={CARRIERS.DHL_ECOMMERCE}
          />
          <Image
            onClick={() => imageClicked(CARRIERS.FEDEX)}
            style={{ cursor: 'pointer' }}
            width={120}
            height={73.84}
            preview={false}
            src={fedexLogo}
            alt={CARRIERS.FEDEX}
          />
          <Image
            onClick={() => imageClicked(CARRIERS.UPS)}
            style={{ cursor: 'pointer' }}
            width={120}
            height={73.84}
            preview={false}
            src={upsLogo}
            alt={CARRIERS.UPS}
          />
          <Image
            onClick={() => imageClicked(CARRIERS.USPS)}
            style={{ cursor: 'pointer' }}
            width={120}
            height={73.84}
            preview={false}
            src={uspsLogo}
            alt={CARRIERS.USPS}
          />
        </Space>
      </Row>
    </Modal>
  );
};

export default CarriersList;
