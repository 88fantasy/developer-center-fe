import React, { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import type { SorterResult } from 'antd/es/table/interface';
import type { FilterCondition } from 'ant-design-exframework';
import { QueryParamBar } from 'ant-design-exframework';
import type { Message } from './data';
import { query } from './service';
import { Button, Dropdown, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { Dispatch } from 'umi';
import { connect } from 'umi';
import type { ConfigStateType } from '@/models/config';
import type { ConnectState } from '@/models/connect';

const Table: React.FC<{ config: ConfigStateType }> = (props) => {
  const [sorter, setSorter] = useState<string>('');
  const [searchParams, setSearchParams] = useState<FilterCondition[]>([]);
  const actionRef = useRef<ActionType>();

  const {
    config: {
      dictionary: { messageType, sendState },
    },
  } = props;

  const getSendStateStatus = (state: string) => {
    switch (state) {
      case 'WAITING':
        return 'Processing';
      case 'SUCCESS':
        return 'Success';
      case 'FAIL':
        return 'Error';
      default:
        return 'Default';
    }
  };

  const sendStateEnum = {};
  if (sendState) {
    Object.keys(sendState).forEach((key) => {
      Object.assign(sendStateEnum, {
        [key]: { text: sendState[key], status: getSendStateStatus(key) },
      });
    });
  }

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
      valueEnum: messageType as any,
    },
    {
      title: '对应途径序号',
      dataIndex: 'sendTargetId',
    },
    {
      title: '已发送',
      dataIndex: 'sendState',
      valueEnum: sendStateEnum,
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
                  options:
                    messageType &&
                    Object.keys(messageType).map((key) => {
                      return { value: key, label: messageType[key] };
                    }),
                },
              },
            ]}
            onChange={(conditions) => {
              setSearchParams(conditions);
              actionRef.current?.reload();
            }}
          />
        ),
        actions: [
          <Dropdown key="overlay" overlay={<Menu></Menu>}>
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

type IndexProps = {
  dispatch: Dispatch;
  config: ConfigStateType;
  loading?: boolean;
};

type IndexState = {
  searchParams: FilterCondition[];
  sorter: string;
};

class Index extends React.Component<IndexProps, IndexState> {
  constructor(props: IndexProps) {
    super(props);

    this.state = {
      searchParams: [],
      sorter: '',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'config/getDictionary',
      payload: ['messageType', 'sendState'],
    });
  }

  actionRef = (actionRef: ActionType) => {
    actionRef.reload();
  };

  render() {
    const { config } = this.props;

    return (
      <PageContainer title={false}>
        <Table config={config} />
      </PageContainer>
    );
  }
}

export default connect(({ config, loading }: ConnectState) => ({
  config,
  loading: loading.models.config,
}))(Index);
