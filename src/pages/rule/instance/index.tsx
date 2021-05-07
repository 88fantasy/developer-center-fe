import React, { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import type { SorterResult } from 'antd/es/table/interface';
import type { FilterCondition } from 'ant-design-exframework';
import { QueryParamBar } from 'ant-design-exframework';
import type { RulePackageInstance } from './data';
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
      dictionary: { ruleStatus, },
    },
  } = props;

  const getRuleStatus = (status: string) => {
    switch (status) {
      case 'PROCESSING':
        return 'Processing';
      case 'FINISHED':
        return 'Success';
      case 'FAILED':
        return 'Error';
      default:
        return 'Default';
    }
  };

  const ruleStatusEnum = {};
  if (ruleStatus) {
    Object.keys(ruleStatusEnum).forEach((key) => {
      Object.assign(ruleStatusEnum, {
        [key]: { text: ruleStatus[key], status: getRuleStatus(key) },
      });
    });
  }

  const columns: ProColumns<RulePackageInstance>[] = [
    {
      title: '实例Id',
      dataIndex: 'id',
      hideInTable: true,
    },
    {
      title: '规则集',
      dataIndex: 'name',
      width: 200,
    },
    {
      title: '规则集描述',
      dataIndex: 'description',
      copyable: true,
      ellipsis: true,
    },
    {
      title: '进行状态',
      dataIndex: 'status',
      valueEnum: ruleStatusEnum,
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
    },
    {
      title: '来源',
      dataIndex: 'ip',
      width: 135,
    },
  ];

  return (
    <ProTable<RulePackageInstance>
      actionRef={actionRef}
      rowKey="id"
      onChange={(_, _filter, _sorter) => {
        const sorterResult = _sorter as SorterResult<RulePackageInstance>;
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
                title: '标题',
                type: 'Input',
              },
              // {
              //   key: 'content',
              //   title: '内容',
              //   type: 'Input',
              // },
              {
                key: 'status',
                title: '类型',
                type: 'Group',
                fieldProps: {
                  options:
                    ruleStatus &&
                    Object.keys(ruleStatus).map((key) => {
                      return { value: key, label: ruleStatus[key] };
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
        let list: RulePackageInstance[] = [];
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
      payload: ['ruleStatus'],
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
