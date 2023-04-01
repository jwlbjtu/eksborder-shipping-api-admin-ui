import { PlusOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, PageHeader, Popconfirm, Space, Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteCustomService,
  fetchCustomServices,
  selectCustomServices,
  selectTableLoading,
  setShowModal
} from '../../redux/carrier/costumServiceTableSlice';
import { Carrier, CustomService } from '../../shared/types/carrier';
import EditCustomServiceModal from './EditCustomServiceModal';

interface CustomServicePanelProps {
  carrier: Carrier;
}

const CustomServicePanel: React.FC<CustomServicePanelProps> = ({
  carrier
}: CustomServicePanelProps) => {
  const dispatch = useDispatch();
  const customServices = useSelector(selectCustomServices);
  const loading = useSelector(selectTableLoading);
  const [curService, setCurService] = useState<CustomService | undefined>(
    undefined
  );

  useEffect(() => {
    dispatch(fetchCustomServices(carrier.id));
  }, [dispatch, carrier]);

  const addClickedHandler = () => {
    setCurService(undefined);
    dispatch(setShowModal(true));
  };

  const handleEditClicked = (record: CustomService) => {
    setCurService(record);
    dispatch(setShowModal(true));
  };

  const columns = [
    {
      title: '服务名称',
      dataIndex: 'name'
    },
    {
      title: '服务说明',
      dataIndex: 'description'
    },
    {
      titles: '服务及条件',
      dataIndex: 'services',
      render: (_: any, record: CustomService) => {
        const servicesItems = record.services;
        const nodes = servicesItems.map((item) => (
          <div>
            <Space size="middle">
              <div>{item.name}</div>
              <div>
                <ul>
                  {item.isBackup ? (
                    <li>Backup</li>
                  ) : (
                    item.conditions.map((condition) => (
                      <li>
                        <Space>
                          <div>{condition.type}:</div>
                          <div>
                            {condition.type === 'weight'
                              ? `${
                                  condition.fields.min
                                    ? condition.fields.min
                                    : ''
                                } - ${
                                  condition.fields.max
                                    ? condition.fields.max
                                    : ''
                                } ${condition.fields.unit}`
                              : condition.fields.value}
                          </div>
                        </Space>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </Space>
          </div>
        ));
        return <Space direction="vertical">{nodes}</Space>;
      }
    },
    {
      title: '状态',
      dataIndex: 'active',
      render: (_: any, record: CustomService) => {
        return record.active ? (
          <Tag color="green">启用</Tag>
        ) : (
          <Tag color="red">禁用</Tag>
        );
      }
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_: any, record: CustomService) => {
        return (
          <Space>
            <Button type="link" onClick={() => handleEditClicked(record)}>
              编辑
            </Button>
            <Popconfirm
              key="确认删除该服务"
              title="确认删除该服务?"
              placement="topRight"
              onConfirm={() => dispatch(deleteCustomService(record._id))}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link">删除</Button>
            </Popconfirm>
          </Space>
        );
      }
    }
  ];

  return (
    <div>
      <EditCustomServiceModal carrier={carrier} curService={curService} />
      <PageHeader
        title=""
        subTitle=""
        extra={[
          <Button
            key="0"
            icon={<SyncOutlined />}
            onClick={() => dispatch(fetchCustomServices(carrier.id))}
          />,
          <Button
            key="1"
            type="primary"
            icon={<PlusOutlined />}
            onClick={addClickedHandler}
            disabled={!carrier.isActive}
          >
            添加服务
          </Button>
        ]}
      />
      <Table<CustomService>
        bordered
        rowKey={(record) => record._id}
        columns={columns}
        dataSource={customServices}
        loading={loading}
      />
    </div>
  );
};

export default CustomServicePanel;
