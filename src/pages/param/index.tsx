import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, message } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import type { ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { SorterResult } from 'antd/es/table/interface';

import type { RuleProColumns } from '@/typings.d';
import EditForm from '@/components/EditForm/EditForm';
import type { Param } from './data';
import { postParam, queryParam, removeParam, } from './service';



const TableList: React.FC = () => {
  const [sorter, setSorter] = useState<string>('');
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [formValues, setFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const columns: RuleProColumns[] = [
    {
      title: '所属微服务',
      dataIndex: 'appCode',
      rules: [
        {
          required: true,
          message: '产品Code为必填项',
        },
      ],
      copyable: true,
      width: 250,
    },
    {
      title: '参数类型',
      dataIndex: 'type',
      rules: [
        {
          required: true,
          message: '参数类型为必填项',
        },
      ],
      width: 50,
    },
    {
      title: '参数key',
      dataIndex: 'key',
      rules: [
        {
          required: true,
          message: '参数key为必填项',
        },
      ],
      width: 100,
    },
    {
      title: '参数名称',
      dataIndex: 'name',
      rules: [
        {
          required: true,
          message: '参数名称为必填项',
        },
      ],
    },
    {
      title: '参数值',
      dataIndex: 'value',
      rules: [
        {
          required: true,
          message: '参数值为必填项',
        },
      ],
      hideInTable: true,
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
  const handleOper = async (fields: Param) => {
    const hide = message.loading('正在操作');
    try {
      await postParam({
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
  const handleRemove = async (selectedRows: Param[]) => {
    const hide = message.loading('正在删除');
    if (!selectedRows) return true;
    try {
      await removeParam({
        keys: selectedRows.map(row => row.key),
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
      <ProTable<Param>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="key"
        onChange={(_, _filter, _sorter) => {
          const sorterResult = _sorter as SorterResult<Param>;
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
        tableAlertRender={({selectedRowKeys, }) => (
          <div>
            已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
          </div>
        )}
        request={ async (params = {}) => {
          let list: Param[] = [];
          let success = true;
          let total = 0;
          await queryParam(params).then((res) => {
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
