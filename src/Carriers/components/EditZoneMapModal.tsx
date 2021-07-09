/* eslint-disable react/prop-types */
import { Button, Form, Input, Modal, Table } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { ReactElement, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectAccounts,
  selectZoneModal,
  setZoneModalShow,
  updateThirdPartyAccountHandler
} from '../../redux/carrier/thirdpartySlice';
import {
  ThirdPartyAccount,
  ThirdPartyZoneMap
} from '../../shared/types/carrier';

interface EditZoneMapModalProps {
  account: ThirdPartyAccount;
}

const EditZoneMapModal = ({ account }: EditZoneMapModalProps): ReactElement => {
  const dispatch = useDispatch();
  const [form] = useForm();
  const showModal = useSelector(selectZoneModal);
  const thirdpartyAccounts = useSelector(selectAccounts);
  const [tabelData, setTableData] = useState<ThirdPartyZoneMap[]>([]);
  const [editingKey, setEditingKey] = useState('');

  useEffect(() => {
    const accountData = thirdpartyAccounts.find((ele) => ele.id === account.id);
    if (accountData) {
      setTableData(accountData.zoneMap || []);
    } else {
      setTableData([]);
    }
  }, [account, thirdpartyAccounts]);

  const isEditing = (record: ThirdPartyZoneMap) => record.zone === editingKey;

  const edit = (record: ThirdPartyZoneMap) => {
    form.setFieldsValue({ maps: record.maps });
    setEditingKey(record.zone);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (zone: string) => {
    try {
      const row = (await form.validateFields()) as Record<string, string>;
      let cc = account.zoneMap ? [...account.zoneMap] : [];
      if (account.zoneMap) {
        const index = account.zoneMap.findIndex((ele) => ele.zone === zone);
        cc[index] = { zone, maps: row.maps };
      } else {
        cc = [{ zone, maps: row.maps }];
      }
      const data: ThirdPartyAccount = { ...account, zoneMap: cc };
      dispatch(updateThirdPartyAccountHandler(data));
      setEditingKey('');
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: string;
    record: Record<string, string>;
    index: number;
    children: React.ReactNode;
  }

  const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    record,
    index,
    children,
    ...restProps
  }: EditableCellProps) => {
    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `分区表不能为空`
              }
            ]}
          >
            <Input />
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const columns = [
    {
      title: '分区',
      dataIndex: 'zone',
      width: '25%'
    },
    {
      title: '分区表',
      dataIndex: 'maps',
      width: '50%',
      editable: true
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_: any, record: ThirdPartyZoneMap) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button
              type="link"
              onClick={() => save(record.zone)}
              style={{ marginRight: 8 }}
            >
              保存
            </Button>
            <Button
              type="link"
              onClick={() => cancel()}
              style={{ marginRight: 8 }}
            >
              取消
            </Button>
          </span>
        ) : (
          <Button
            type="link"
            disabled={editingKey !== ''}
            onClick={() => edit(record)}
          >
            编辑
          </Button>
        );
      }
    }
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: ThirdPartyZoneMap) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    };
  });

  return (
    <Modal
      width="300"
      visible={showModal}
      closable={false}
      title="编辑分区"
      footer={
        <Button onClick={() => dispatch(setZoneModalShow(false))}>取消</Button>
      }
    >
      <Form form={form} component={false}>
        <Table<ThirdPartyZoneMap>
          components={{ body: { cell: EditableCell } }}
          bordered
          dataSource={tabelData}
          columns={mergedColumns}
          rowKey={(record) => record.zone}
        />
      </Form>
    </Modal>
  );
};

export default EditZoneMapModal;
