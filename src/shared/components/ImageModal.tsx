import { Image, message, Modal } from 'antd';
import React, { ReactElement } from 'react';
import JSPDF from 'jspdf';

interface ImageModalProps {
  visible: boolean;
  type: string;
  format: string;
  data: string;
  onCancel: () => void;
}

const ImageModal = ({
  visible = false,
  type,
  format,
  data,
  onCancel
}: ImageModalProps): ReactElement => {
  let imageSrc = data;
  if (type.toLowerCase() === 'base64') {
    imageSrc = `data:image/${format.toLowerCase()};base64,${data}`;
  }

  const createPDF = () => {
    const doc = new JSPDF({ unit: 'in', format: [4, 6] });
    doc.addImage(imageSrc, format, 0, 0, 4, 6);
    const link = doc.output('blob');
    window.open(URL.createObjectURL(link));
  };

  return (
    <Modal
      width={600}
      closable={false}
      bodyStyle={{
        minHeight: '300px',
        maxHeight: '1000px',
        padding: 0
      }}
      visible={visible}
      cancelText="取消"
      okText="打印"
      onCancel={onCancel}
      onOk={createPDF}
    >
      <Image src={imageSrc} />
    </Modal>
  );
};

export default ImageModal;
