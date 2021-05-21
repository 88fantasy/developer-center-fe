import React, { useRef, useState } from 'react';
import moment from 'moment';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { PageContainer,  } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import type { SorterResult } from 'antd/es/table/interface';
import type { FilterCondition } from 'ant-design-exframework';
import { QueryParamBar } from 'ant-design-exframework';
import type { RulePackageInstance } from './data';
import { query } from './service';
import { Button, Drawer, Dropdown, Menu } from 'antd';
import type { Dispatch } from 'umi';
import { connect, useLocation } from 'umi';
import type { ConfigStateType } from '@/models/config';
import type { ConnectState } from '@/models/connect';
import { diff } from '@/utils/date';
import ProDescriptions from '@ant-design/pro-descriptions';
import Description from './description';
import RuleList from './ruleList';
import RuleLine from './timeline';

const Table: React.FC<{ config: ConfigStateType }> = (props) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const packageCode = params.get('package');
  const [sorter, setSorter] = useState<string>('');
  const [searchParams, setSearchParams] = useState<FilterCondition[]>(
    packageCode
      ? [
          {
            key: 'code',
            oper: 'EQUAL',
            filterValue: packageCode,
            filterDataType: 'STRING',
          },
        ]
      : [],
  );
  const actionRef = useRef<ActionType>();
  const [drawerVisiable, setDrawerVisiable] = useState<boolean>(false);
  const [currentPackageInstance, setCurrentPackageInstance] = useState<RulePackageInstance>();
  const [tab, setTab] = useState('description');

  const {
    config: {
      dictionary: { ruleStatus },
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
    Object.keys(ruleStatus).forEach((key) => {
      Object.assign(ruleStatusEnum, {
        [key]: { text: ruleStatus[key], status: getRuleStatus(key) },
      });
    });
  }

  const onDrawerOpen = () => {
    setDrawerVisiable(true);
  };

  const onDrawerClose = () => {
    setDrawerVisiable(false);
  };

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
      title: '业务单据',
      dataIndex: 'sourceId',
      copyable: true,
      ellipsis: true,
    },
    {
      title: '进行状态',
      dataIndex: 'status',
      valueEnum: ruleStatusEnum,
      width: 80,
    },
    {
      title: '持续时长',
      renderText: (text, record) => {
        return record.endTime
          ? diff(moment(record.endTime).diff(record.startTime, 'seconds'))
          : diff(moment().diff(moment(record.startTime), 'seconds'));
      },
      width: 120,
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      width: 180,
    },
    {
      title: '来源',
      dataIndex: 'ip',
      width: 135,
    },
  ];

  const tabList = [
    {
      key: 'description',
      tab: '结果',
      children: <Description id={currentPackageInstance?.id} />,
      // style: { padding : 0},
    },
    {
      key: 'timeline',
      tab: '时间线',
      children: <RuleLine id={currentPackageInstance?.id} />,
      // style: { padding : 0},
    },
    {
      key: 'ruleInstance',
      tab: '执行过程',
      children: <RuleList id={currentPackageInstance?.id} />,
      // style: { padding : 0},
    },
  ];

  return (
    <>
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
                  title: '规则集',
                  type: 'Input',
                },
                {
                  key: 'sourceId',
                  title: '业务单据',
                  type: 'Input',
                },
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
          // actions: [
          //   <Dropdown key="overlay" overlay={<Menu></Menu>}>
          //     <Button type="primary">
          //       新增
          //       <DownOutlined
          //         style={{
          //           marginLeft: 8,
          //         }}
          //       />
          //     </Button>
          //   </Dropdown>,
          // ],
        }}
        onRow={
          (record: React.SetStateAction<RulePackageInstance | undefined>) => {
            return {
              onClick: () => {
                setCurrentPackageInstance(record);
                onDrawerOpen();
              }
            }
          }
        }
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

      <Drawer
        title={`${currentPackageInstance?.name}(${currentPackageInstance?.sourceId})`}
        onClose={onDrawerClose}
        visible={drawerVisiable}
        bodyStyle={{padding: 0}}
        width={1000}
      >
        <PageContainer
          breadcrumb={undefined}
          title={false}
          fixedHeader
          tabList={tabList}
          tabActiveKey={tab}
          onTabChange={(active) => setTab(active)}
          content={
            <ProDescriptions
              dataSource={currentPackageInstance}
              column={2}
              columns={[
                {
                  title: '实例',
                  dataIndex: 'id',
                },
                {
                  title: '名称',
                  dataIndex: 'name',
                },
              ]}
            />
          }
        />
      </Drawer>
    </>
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
