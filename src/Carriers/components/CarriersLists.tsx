import React, { ReactElement } from 'react';
import { Modal, Button, Row, Image, Space, Divider } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { CARRIERS } from '../../shared/utils/constants';
import dhleCommerceLogo from '../../assets/images/carriers/dhl-ecommerce-logo.svg';
import fedexLogo from '../../assets/images/carriers/fedex-logo.svg';
import upsLogo from '../../assets/images/carriers/ups-logo.svg';
import uspsLogo from '../../assets/images/carriers/usps-logo.svg';
import pbLogo from '../../assets/images/carriers/pitney-bowes-logo.png';
import ruiYunLogo from '../../assets/images/carriers/ruiyun-logo.png';
import usps3Logo from '../../assets/images/carriers/3usps-logo.png';
import maoYuanLogo from '../../assets/images/carriers/maoyuan-logo.png';
import kuaiDiYiLogo from '../../assets/images/carriers/kuaidiyi-logo.png';
import dpdLogo from '../../assets/images/carriers/dpd-logo.jpg';
import {
  selectShowCarrierList,
  setShowCarrierList
} from '../../redux/carrier/carrierSlice';

interface CarriersListProps {
  imageClicked: (carrier: string) => void;
}

const CarriersList = ({ imageClicked }: CarriersListProps): ReactElement => {
  const dispatch = useDispatch();
  const showModal = useSelector(selectShowCarrierList);

  return (
    <Modal
      width={575}
      bodyStyle={{ minHeight: '300px', maxHeight: '480px' }}
      centered
      title="添加物流账号"
      visible={showModal}
      closable={false}
      footer={
        <Button onClick={() => dispatch(setShowCarrierList(false))}>
          取消
        </Button>
      }
      transitionName=""
      maskTransitionName=""
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
      <Divider />
      <Row>
        <Space size="middle">
          <Image
            onClick={() => imageClicked(CARRIERS.PITNEY_BOWES)}
            style={{ cursor: 'pointer' }}
            width={120}
            height={73.84}
            preview={false}
            src={pbLogo}
            alt={CARRIERS.PITNEY_BOWES}
          />
          <Image
            onClick={() => imageClicked(CARRIERS.RUI_YUN)}
            style={{ cursor: 'pointer' }}
            width={120}
            height={73.84}
            preview={false}
            src={ruiYunLogo}
            alt={CARRIERS.RUI_YUN}
          />
          <Image
            onClick={() => imageClicked(CARRIERS.USPS3)}
            style={{ cursor: 'pointer' }}
            width={120}
            height={73.84}
            preview={false}
            src={usps3Logo}
            alt={CARRIERS.USPS3}
          />
          <Image
            onClick={() => imageClicked(CARRIERS.MAO_YUAN)}
            style={{ cursor: 'pointer' }}
            width={120}
            height={73.84}
            preview={false}
            src={maoYuanLogo}
            alt={CARRIERS.MAO_YUAN}
          />
        </Space>
      </Row>
      <Row>
        <Space size="middle">
          <Image
            onClick={() => imageClicked(CARRIERS.KUAI_DI_YI)}
            style={{ cursor: 'pointer' }}
            width={120}
            height={73.84}
            preview={false}
            src={kuaiDiYiLogo}
            alt={CARRIERS.KUAI_DI_YI}
          />
          <Image
            onClick={() => imageClicked(CARRIERS.DPD)}
            style={{ cursor: 'pointer' }}
            width={120}
            height={73.84}
            preview={false}
            src={dpdLogo}
            alt={CARRIERS.DPD}
          />
        </Space>
      </Row>
    </Modal>
  );
};

export default CarriersList;
