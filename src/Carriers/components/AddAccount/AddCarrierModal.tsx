import React, { ReactElement, useEffect } from 'react';
import { Form, Modal, Button, Image, Divider } from 'antd';
import { LeftOutlined } from '@ant-design/icons';

interface AddCarrierModalProps {
  carrier: string;
  logo: string;
  visible: boolean;
  children: ReactElement | null;
  backClicked: () => void;
  cancelCliecked: () => void;
  okClicked: () => void;
}

const AddCarrierModal = ({
  carrier,
  logo,
  visible,
  children,
  backClicked,
  cancelCliecked,
  okClicked
}: AddCarrierModalProps): ReactElement => {
  const [form] = Form.useForm();

  useEffect(() => {
    console.log(carrier);
  }, [carrier]);

  return (
    <Modal
      width={600}
      bodyStyle={{
        minHeight: '300px',
        maxHeight: '1000px',
        overflowY: 'auto'
      }}
      centered
      closable={false}
      visible={visible}
      okText="添加"
      cancelText="取消"
      title={
        <Button
          style={{ fontWeight: 700 }}
          size="small"
          type="text"
          onClick={backClicked}
          icon={<LeftOutlined />}
        >
          返回
        </Button>
      }
      onCancel={cancelCliecked}
      onOk={okClicked}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Image width={100} height={81.53} src={logo} alt={carrier} />
        <span style={{ marginTop: '12px' }}>
          <strong>{`添加 ${carrier} 账号`}</strong>
        </span>
      </div>
      <Divider />
      {children}
    </Modal>
  );
};

export default AddCarrierModal;
