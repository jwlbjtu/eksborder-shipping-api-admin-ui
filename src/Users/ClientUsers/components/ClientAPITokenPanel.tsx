import React, { ReactElement, useEffect, useState } from 'react';
import { PageHeader, Card, Typography, Button, Space, Popconfirm } from 'antd';
import { ExclamationCircleTwoTone } from '@ant-design/icons';

const { Text, Paragraph } = Typography;

interface ClientAPITokenPanelProps {
  token: string;
  onCreate: () => void;
  onDelete: () => void;
}

const ClientAPITokenPanel = ({
  token,
  onCreate,
  onDelete
}: ClientAPITokenPanelProps): ReactElement => {
  const [displayToken, setDisplayToken] = useState('');
  const [disableDelete, setDisableDelete] = useState(false);

  useEffect(() => {
    const lastChars = token ? token.slice(-10) : '';
    const startChars = token ? token.slice(0, 10) : '';
    const result = token
      ? `${startChars}*********************************************${lastChars}`
      : '秘钥为空！';
    setDisplayToken(result);
    setDisableDelete(!token);
  }, [token]);

  return (
    <PageHeader title="Tokens">
      <Card
        title="当前秘钥"
        extra={
          <Text type="danger">
            <ExclamationCircleTwoTone
              twoToneColor="#ff4d4f"
              style={{ marginRight: '5px' }}
            />
            所有针对秘钥的操作都会使现有秘钥失效
          </Text>
        }
        actions={[
          <Space size="large">
            <Popconfirm
              placement="topLeft"
              title="确定要新生成秘钥？"
              onConfirm={onCreate}
              okText="确定"
              cancelText="取消"
            >
              <Button type="primary" ghost block>
                生成秘钥
              </Button>
            </Popconfirm>
            <Popconfirm
              placement="topRight"
              title="确定要删除该秘钥？"
              onConfirm={onDelete}
              okText="确定"
              cancelText="取消"
              disabled={disableDelete}
            >
              <Button danger block disabled={disableDelete}>
                删除秘钥
              </Button>
            </Popconfirm>
          </Space>
        ]}
      >
        <Paragraph copyable={{ text: token, tooltips: '复制' }}>
          {displayToken}
        </Paragraph>
      </Card>
    </PageHeader>
  );
};

export default ClientAPITokenPanel;
