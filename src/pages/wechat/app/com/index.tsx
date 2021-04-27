import React, { useState, useRef } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { SorterResult } from 'antd/es/table/interface';
import type { FilterCondition} from 'ant-design-exframework';
import { QueryParamBar} from 'ant-design-exframework';
import type { Com, } from './data';
import { query, refresh } from './service';
import { Button, Dropdown, Menu, message } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const Index: React.FC = () => {
  const [sorter, setSorter] = useState<string>('');
  const [searchParams, setSearchParams] = useState<FilterCondition[]>([]);
  const actionRef = useRef<ActionType>();

  const columns: ProColumns[] = [
    {
      title: '应用Id',
      dataIndex: 'agentId',
      width: 200,
    },
    {
      title: '应用名称',
      dataIndex: 'name',
      width: 200,
    },
    {
      title: '应用密钥',
      dataIndex: 'secret',
      valueType: 'password',
      copyable: true,
    },
  ];

  return (
      <ProTable<Com>
        actionRef={actionRef}
        rowKey="agentId"
        onChange={(_, _filter, _sorter) => {
          const sorterResult = _sorter as SorterResult<Com>;
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
                  key: 'agentId',
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
              <Button type="primary">
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
          let list: Com[] = [];
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
  );
};

export default Index;
