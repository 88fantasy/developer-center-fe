import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, message } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import EditForm from '@/components/EditForm/EditForm';
import { postDataItem, queryDataItem, removeDataItem, } from './service';
import type { DataItem } from './data';
import type { SorterResult } from 'antd/es/table/interface';



const TableList: React.FC = () => {
  const [sorter, setSorter] = useState<string>('');
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [formValues, setFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const columns: ProColumns[] = [
    {
      title: '所属微服务',
      dataIndex: 'appCode',
      copyable: true,
      width: 250,
    },
    {
      title: '数据项Code',
      dataIndex: 'code',
      width: 100,
    },
    {
      title: '数据项名称',
      dataIndex : ' name',
      width: 100,
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 100,
    },
    {
      title: ' 备注',
      dataIndex: 'comment',
    },
    {
      title: '操作',
      render: (_: any , record: any) => (
        <>
          <a
            onClick={() => {
              handleModalVisible(true);
              setFormValues(record);
            }}
          >
            修改
        </a>
        </>
      ),
      width: 80,
    },
  ];


  /**
   * 新增或更新字典
   * @param fields
   */
  const handleOper = async (fields: DataItem) => {
    const hide = message.loading('正在操作');
    try {
      await postDataItem({
        ...fields
      });
      hide();

      message.success('操作成功');
      handleModalVisible(false);
      actionRef.current?.reload();
      return true;
    } catch (error) {
      hide();
      message.error('操作失败请重试！');
      return false;
    }
  };

  /**
   *  删除节点
   * @param selectedRows
   */
  const handleRemove = async (selectedRows: DataItem[]) => {
    const hide = message.loading('正在删除');
    if (!selectedRows) return true;
    try {
      await removeDataItem({
        codes: selectedRows.map(row => row.code),
      });
      hide();
      message.success('删除成功，即将刷新');
      return true;
    } catch (error) {
      hide();
      message.error('删除失败，请重试');
      return false;
    }
  };

  return (
    <PageHeaderWrapper>
      <ProTable<DataItem>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="key"
        onChange={(_, _filter, _sorter) => {
          const sorterResult = _sorter as SorterResult<DataItem>;
          if (sorterResult.field) {
            setSorter(`${sorterResult.field}_${sorterResult.order}`);
          }
        }}
        params={{
          sorter,
        }}
        toolBarRender={(action, { selectedRows }) => [
          <Button type="primary" onClick={() => {
            handleModalVisible(true);
            setFormValues({
              code: "",
              keyword: "",
            });
          }} >
            <PlusOutlined /> 新建
          </Button>,
          selectedRows && selectedRows.length > 0 && (
            <Dropdown
              overlay={
                <Menu
                  onClick={async e => {
                    if (e.key === 'remove') {
                      await handleRemove(selectedRows);
                      action?.reload();
                    }
                  }}
                  selectedKeys={[]}
                >
                  <Menu.Item key="remove">批量删除</Menu.Item>
                </Menu>
              }
            >
              <Button>
                批量操作 <DownOutlined />
              </Button>
            </Dropdown>
          ),
        ]}
        tableAlertRender={({selectedRowKeys}) => (
          <div>
            已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
          </div>
        )}
        request={ async (params = {}) => {
          let list: DataItem[] = [];
          let success = true;
          let total = 0;
          await queryDataItem(params).then((res) => {
            list = res.list;
            total = res.pager.total;
          }).catch(() => {
            success = false;
          });
          return {
            data: list,
            success,
            total,
          };
        }}
        columns={columns}
        rowSelection={{}}
      />
      { createModalVisible && 
        <EditForm
          onSubmit={handleOper}
          onCancel={() => handleModalVisible(false)}
          modalVisible={createModalVisible}
          values={formValues}
          columns={columns}
        />
      }
    </PageHeaderWrapper>
  );
};

export default TableList;
