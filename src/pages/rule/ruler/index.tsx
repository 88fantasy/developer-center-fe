import type { ReactText } from 'react';
import React, { useRef, useState } from 'react';
import type { ActionType } from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import type { FilterCondition } from 'ant-design-exframework';
import { QueryParamBar } from 'ant-design-exframework';
import { queryRules } from '../service';
import { Badge, Collapse, Drawer, List, Space, Tag } from 'antd';
import type { Dispatch } from 'umi';
import { connect } from 'umi';
import type { ConfigStateType } from '@/models/config';
import type { ConnectState } from '@/models/connect';
import ProCard from '@ant-design/pro-card';
import ProList from '@ant-design/pro-list';
import type { Rule } from '../data';
import { CodeTwoTone } from '@ant-design/icons';
import type { RuleTagCountResponse, RuleTypeCountResponse } from './data';
import { postRuleStatistic } from './service';
import ProDescriptions from '@ant-design/pro-descriptions';

const Table: React.FC<{ config: ConfigStateType }> = (props) => {
  const [sorter, setSorter] = useState<string>('');
  const [searchParams, setSearchParams] = useState<FilterCondition[]>([]);
  const actionRef = useRef<ActionType>();
  const [drawerVisiable, setDrawerVisiable] = useState<boolean>(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly ReactText[]>([]);
  const [typeGroup, setTypeGroup] = useState<RuleTypeCountResponse[]>([]);
  const [tagGroup, setTagGroup] = useState<RuleTagCountResponse[]>([]);
  const [currentRule, setCurrentRule] = useState<Rule>();

  const {
    config: {
      dictionary: { ruleType },
    },
  } = props;

  const onDrawerOpen = () => {
    setDrawerVisiable(true);
  };

  const onDrawerClose = () => {
    setDrawerVisiable(false);
  };

  return (
    <ProCard split="vertical">
      <ProCard title={false} colSpan="30%">
        <Collapse defaultActiveKey={['type', 'tag']} ghost>
          <Collapse.Panel header="类型" key="type">
            <List
              dataSource={typeGroup}
              split={false}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta title={ruleType[item.type]} />
                  <Badge count={item.count} style={{ backgroundColor: '#52c41a' }} />
                </List.Item>
              )}
            />
          </Collapse.Panel>
          <Collapse.Panel header="标签" key="tag">
            <List
              dataSource={tagGroup}
              split={false}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta title={item.tag} />
                  <Badge count={item.count} style={{ backgroundColor: '#2db7f5' }} />
                </List.Item>
              )}
            />
          </Collapse.Panel>
        </Collapse>
      </ProCard>
      <ProCard
        title={
          <QueryParamBar
            params={[
              {
                key: 'name',
                title: '规则名',
                type: 'Input',
              },
              {
                key: 'description',
                title: '规则描述',
                type: 'Input',
              },
            ]}
            onChange={(conditions) => {
              setSearchParams(conditions);
              actionRef.current?.reload();
            }}
          />
        }
        headerBordered
      >
        <ProList<Rule>
          actionRef={actionRef}
          toolBarRender={false}
          rowKey="code"
          request={async (params = {}) => {
            let list: Rule[] = [];
            let success = true;
            let total = 0;

            postRuleStatistic(searchParams).then((res) => {
              if (res.status) {
                setTypeGroup(res.data.typeCount);
                setTagGroup(res.data.tagCount);
              }
            });

            await queryRules({
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
          locale={{
            emptyText: '没有选择任何规则',
          }}
          split
          expandable={{ expandedRowKeys, onExpandedRowsChange: setExpandedRowKeys }}
          metas={{
            title: {
              dataIndex: 'name',
            },
            avatar: {
              render: () => {
                return <CodeTwoTone style={{ fontSize: '20px' }} />;
              },
            },
            description: {
              dataIndex: 'description',
            },
            subTitle: {
              render: (text, row) => {
                return (
                  <Space size={0}>
                    <Tag color="blue">{ruleType[row.type]}</Tag>
                    {row.tags &&
                      row.tags.split(' ').map((tag) => {
                        return <Tag>{tag}</Tag>;
                      })}
                  </Space>
                );
              },
            },
          }}
          onRow={
            (record: React.SetStateAction<Rule | undefined>) => {
              return {
                onClick: () => {
                  setCurrentRule(record);
                  onDrawerOpen();
                }
              }
            }
          }
        />
        <Drawer title={currentRule?.name} onClose={onDrawerClose} visible={drawerVisiable} width={1000} >
          <ProDescriptions
            actionRef={actionRef}
            formProps={{
              onValuesChange: (e, f) => console.log(f),
            }}
            editable={{}}
            dataSource={currentRule}
            column={2}
            columns={[
              {
                title: '代码',
                dataIndex: 'code',
                editable: false,
                fieldProps: {
                  style : {
                    width: '300px'
                  }
                },
              },
              {
                title: '名称',
                dataIndex: 'name',
                fieldProps: {
                  style : {
                    width: '300px'
                  }
                },
              },
              {
                title: '描述',
                dataIndex: 'description',
                valueType: 'textarea',
                span: 2,
                fieldProps: {
                  style : {
                    width: '600px'
                  }
                },
              },
              {
                title: '类型',
                dataIndex: 'type',
                valueType: 'select',
                editable: (text) => text !== 'CODE',
                valueEnum: ruleType,
                span: 2,
                fieldProps: {
                  style : {
                    width: '300px'
                  }
                },
              },
              {
                title: '输入',
                dataIndex: 'input',
                fieldProps: {
                  style : {
                    width: '300px'
                  }
                },
              },
              {
                title: '输出',
                dataIndex: 'output',
                fieldProps: {
                  style : {
                    width: '300px'
                  }
                },
              },
              {
                title: '条件',
                dataIndex: 'expression',
                valueType: "code",
                span: 2,
                fieldProps: {
                  style : {
                    width: '600px'
                  }
                },
              },
              {
                title: '执行',
                dataIndex: 'action',
                valueType: "code",
                span: 2,
                fieldProps: {
                  style : {
                    width: '600px'
                  }
                },
              },
            ]}
          />
        </Drawer>
      </ProCard>
    </ProCard>
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
      payload: ['ruleType'],
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
