import React, { useState, useRef } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { SorterResult } from 'antd/es/table/interface';
import type { FilterCondition} from 'ant-design-exframework';
import { QueryParamBar} from 'ant-design-exframework';
import type { Message, } from './data';
import { query,  } from './service';
import { Button, Dropdown, Menu,  } from 'antd';
import { DownOutlined, } from '@ant-design/icons';
import type { Dispatch } from 'umi';
import { connect } from 'umi';
import type { ConnectState } from '@/models/connect';
import type { ConfigStateType } from '@/models/config';


type IndexProps = {
  dispatch: Dispatch;
  config: ConfigStateType;
  submitting?: boolean;
}

const Index: React.FC<IndexProps> = (props) => {
  const [sorter, setSorter] = useState<string>('');
  const [searchParams, setSearchParams] = useState<FilterCondition[]>([]);
  const actionRef = useRef<ActionType>();

  const { config : { dictionary }, dispatch } = props;

  dispatch({
    type: 'config/getDictionary',
    payload: ['messageType','sendedEnum']
  });

  const columns: ProColumns<Message>[] = [
    {
      title: '消息Id',
      dataIndex: 'id',
      hideInTable: true,
    },
    {
      title: '标题',
      dataIndex: 'subject',
      width: 200,
    },
    {
      title: '内容',
      dataIndex: 'content',
      copyable: true,
      ellipsis: true,
    },
    {
      title: '目标对象',
      dataIndex: 'target',
    },
    {
      title: '类型',
      dataIndex: 'messageType',
      valueType: 'select',
      fieldProps: {
        options: dictionary.MessageType
      }
    },
    {
      title: '对应途径序号',
      dataIndex: 'sendTargetId',
    },
    {
      title: '已发送',
      dataIndex: 'sended',
      valueEnum: {
        true: { text: '已发送', status: 'Success' },
        false: { text: '发送失败', status: 'Error' },
      },
    },
    {
      title: '发送时间',
      dataIndex: 'sendTime',
    },
    {
      title: '来源',
      dataIndex: 'ip',
      width: 135,
    },
  ];

  return (
      <ProTable<Message>
        actionRef={actionRef}
        rowKey="id"
        onChange={(_, _filter, _sorter) => {
          const sorterResult = _sorter as SorterResult<Message>;
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
                  key: 'subject',
                  title: '标题',
                  type: 'Input',
                },
                {
                  key: 'content',
                  title: '内容',
                  type: 'Input',
                },
                {
                  key: 'messageType',
                  title: '类型',
                  type: 'Group',
                  fieldProps: {
                    options: dictionary.MessageType
                  }
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
          let list: Message[] = [];
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

export default connect(({ config, loading }: ConnectState) => ({
  config,
  loading: loading.models.config,
}))(Index);
