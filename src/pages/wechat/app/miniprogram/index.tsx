import React, { useState, useRef } from 'react';
import { Button, Drawer, Dropdown, Menu, message } from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { SorterResult } from 'antd/es/table/interface';
import type { FilterCondition } from 'ant-design-exframework';
import { QueryParamBar } from 'ant-design-exframework';
import type { MiniProgram } from './data';
import { query, refresh, post } from './service';
import { DownOutlined } from '@ant-design/icons';
import EditForm from '@/components/EditForm/EditForm';

const Index: React.FC = () => {
  const [sorter, setSorter] = useState<string>('');
  const [searchParams, setSearchParams] = useState<FilterCondition[]>([]);
  const actionRef = useRef<ActionType>();
  const [drawVisible, setDrawVisible] = useState<boolean>(false);
  const [formValues, setFormValues] = useState({});

  const columns: ProColumns[] = [
    {
      title: '应用Id',
      dataIndex: 'appId',
      width: 100,
    },
    {
      title: '应用名称',
      dataIndex: 'name',
      width: 120,
    },
    {
      title: '应用密钥',
      dataIndex: 'appSecret',
      valueType: 'password',
      copyable: true,
    },
    {
      title: '商户号',
      dataIndex: 'payId',
      width: 150,
    },
    {
      title: '商户密钥',
      dataIndex: 'paySecret',
      valueType: 'password',
      copyable: true,
    },
  ];



  const doShow = () => {
    setDrawVisible(true);
  };

  const doClose = () => {
    setDrawVisible(false);
  }

  /**
   * 新增或更新字典
   * @param fields
   */
  const handleOper = async (fields: MiniProgram) => {
    const hide = message.loading('正在操作');
    try {
      await post({
        ...fields,
      });
      hide();

      message.success('操作成功');
      doClose();
      actionRef.current?.reload();
      return true;
    } catch (error) {
      hide();
      message.error('操作失败请重试！');
      return false;
    }
  };

  return (
    <>
      <ProTable<MiniProgram>
        actionRef={actionRef}
        rowKey="appId"
        onChange={(_, _filter, _sorter) => {
          const sorterResult = _sorter as SorterResult<MiniProgram>;
          if (sorterResult.field) {
            setSorter(`${sorterResult.field}_${sorterResult.order}`);
          }
        }}
        params={{
          sorter,
        }}
        toolbar={{
          search: (
            <QueryParamBar
              params={[
                {
                  key: 'name',
                  title: '应用名称',
                  type: 'Input',
                },
                {
                  key: 'appId',
                  title: '应用Id',
                  type: 'Input',
                },
              ]}
              onChange={(conditions) => {
                setSearchParams(conditions);
                actionRef.current?.reload();
              }}
            />
          ),
          actions: [
            <Dropdown
              key="overlay"
              overlay={
                <Menu>
                  <Menu.Item
                    key="refresh"
                    onClick={async () => {
                      await refresh()
                        .then(() => {
                          message.success('刷新成功');
                        })
                        .catch((reason) => {
                          message.error(`刷新失败${reason}`);
                        });
                    }}
                  >
                    刷新缓存
                  </Menu.Item>
                </Menu>
              }
            >
              <Button type="primary" onClick={doShow}>
                新增
                <DownOutlined
                  style={{
                    marginLeft: 8,
                  }}
                />
              </Button>
            </Dropdown>,
          ],
        }}
        request={async (params = {}) => {
          let list: MiniProgram[] = [];
          let success = true;
          let total = 0;
          await query({
            page: { current: params.current, pageSize: params.pageSize },
            conditions: searchParams,
          })
            .then((res) => {
              list = res.data.list;
              total = res.data.pager.total;
            })
            .catch(() => {
              success = false;
            });
          return {
            data: list,
            success,
            total,
          };
        }}
        columns={columns}
        search={false}
      />
      { drawVisible && 
        <EditForm
          onSubmit={handleOper}
          onCancel={doClose}
          modalVisible={drawVisible}
          values={formValues}
          columns={columns}
        />
      }
    </>
  );
};

export default Index;
