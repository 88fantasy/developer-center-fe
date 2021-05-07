import React, { useState, useRef, useEffect } from 'react';
import { Button, Form, Space, Tag, Drawer, Avatar, notification, List } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import type { ActionType } from '@ant-design/pro-table';
import ProCard from '@ant-design/pro-card';
import ProList from '@ant-design/pro-list';
import ProForm, { ProFormText, ProFormSwitch, ProFormSlider } from '@ant-design/pro-form';

import { SortableContainer, SortableElement } from 'react-sortable-hoc';

import type { RulePackage, Rule } from '../../data';
import type { FilterCondition } from 'ant-design-exframework';
import { QueryParamBar } from 'ant-design-exframework';
import { queryRules } from '../../service';
import { saveRulePackage, get } from './service';
import { CodeTwoTone, MinusCircleFilled,  } from '@ant-design/icons';
import { useParams, history } from 'umi';
import arrayMove from 'array-move';

const Index: React.FC = () => {
  const [form] = Form.useForm<RulePackage>();
  const [rules, setRules] = useState<Rule[]>([]);
  const [drawerVisiable, setDrawerVisiable] = useState<boolean>(false);
  const rulesActionRef = useRef<ActionType>();
  const ruleActionRef = useRef<ActionType>();
  const [searchParams, setSearchParams] = useState<FilterCondition[]>([]);
  const [saveBuutonLoading, setSaveBuutonLoading] = useState<boolean>(false);
  const [rulePackage, setRulePackage] = useState<RulePackage>({
    code: '',
    name: '',
    description: '',
    skipOnFirstAppliedRule: false,
    skipOnFirstFailedRule: false,
    skipOnFirstNonTriggeredRule: false,
    rulePriorityThreshold: 10000,
  });

  

  const urlParams: { code: string } = useParams();
  const isCreate: boolean = !urlParams.code || urlParams.code === 'new';

  useEffect(() => {
    if (urlParams.code && !isCreate) {
      get(urlParams.code).then((res) => {
        if (res && res.status) {
          setRulePackage(res.data);
          setRules(res.data.rules || []);
          form.setFieldsValue(res.data);
        }
      });
    }
  }, [form, isCreate, urlParams.code]);

  const onDrawerOpen = () => {
    ruleActionRef.current?.reload();
    setDrawerVisiable(true);
  };

  const onDrawerClose = () => {
    setDrawerVisiable(false);
  };

  const onAddRule = (rule: Rule) => {
    const newRules = [...rules, rule];
    setRules(newRules);
    rulesActionRef.current?.reload();
    ruleActionRef.current?.reload();
  };

  const onDeleteRule = (rule: Rule) => {
    const newDependencies = rules.filter((m) => m.code !== rule.code);
    setRules(newDependencies);
    rulesActionRef.current?.reload();
  };

  const onSortEnd = ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMove(rules, oldIndex, newIndex).filter((el) => !!el);
      setRules(newData);
    }
  };

  const SortableItem = SortableElement(
    ({ value, valueIndex }: { value: Rule; valueIndex: number }) => (
      <List.Item 
        key={value.code} 
        actions={[
          <Button type="link" shape="circle" danger icon={<MinusCircleFilled />} onClick={() => {
            onDeleteRule(value);
          }} />
        ]}
        >
        <List.Item.Meta 
          avatar={
            <Avatar size="small" style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
              {valueIndex + 1}
            </Avatar>
          }
          title={
            <Space size="middle">
              <a>{value.name}</a>
              <Space size={0}>
                <Tag color="blue">{value.type}</Tag>
                {value.tags && value.tags.split(' ').map((tag) => <Tag>{tag}</Tag>)}
              </Space>
            </Space>
          }
          description={value.description}
        />
      </List.Item>
    ),
  );

  const SortableList = SortableContainer(({ items }: { items: Rule[] }) => {
    return (
      <List<Rule>
        rowKey="key"
        dataSource={items}
        split
        locale={{
          emptyText: '没有选择任何组件',
        }}
        renderItem={(item, index) => (
          <SortableItem key={`item-${item.code}`} index={index} value={item} valueIndex={index} />
        )}
      />
    );
  });

  return (
    <PageHeaderWrapper
      extra={[
        <Button
          key="gen"
          type="primary"
          loading={saveBuutonLoading}
          onClick={() => {
            setSaveBuutonLoading(true);
            form
              .validateFields()
              .then((values) => {
                saveRulePackage({
                  ...values,
                  rules,
                })
                  .then((res) => {
                    if (res.status) {
                      history.replace('/rule/package');
                    } else {
                      notification.error({
                        message: '请求失败',
                        description: res.message,
                      });
                    }
                  })
                  .finally(() => {
                    setSaveBuutonLoading(false);
                  });
              })
              .catch((error) => {
                notification.error({
                  message: '错误提示',
                  description: error,
                });
              });
          }}
        >
          保存
        </Button>,
      ]}
    >
      <ProForm<RulePackage>
        submitter={false}
        initialValues={{
          ...rulePackage,
        }}
        form={form}
      >
        <ProCard split="vertical">
          <ProCard title={`${isCreate ? '新建' : '编辑'}规则集`} colSpan="40%">
            <ProForm.Group title="规则集信息">
              <ProFormText name="code" label="代号" width="md" required />
              <ProFormText name="name" label="名称" width="md" required />
              <ProFormText name="description" label="描述" width="md" />
            </ProForm.Group>
            <ProForm.Group title="选项">
              <ProFormSwitch name="skipOnFirstAppliedRule" label="应用规则时停止" width="xs" />
              <ProFormSwitch name="skipOnFirstFailedRule" label="规则失败时停止" width="xs" />
              <ProFormSwitch
                name="skipOnFirstNonTriggeredRule"
                label="没有触发规则时停止"
                width="xs"
              />
              <ProFormSlider
                name="rulePriorityThreshold"
                label="优先级超过阈值时停止"
                max={10000}
                width="xs"
              />
            </ProForm.Group>
          </ProCard>
          <ProCard
            title="所需规则"
            headerBordered
            extra={[
              <Button shape="round" onClick={onDrawerOpen}>
                添加规则
              </Button>,
            ]}
          >
            <SortableList items={rules} onSortEnd={onSortEnd} />
          </ProCard>
        </ProCard>
        <Drawer
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
                ruleActionRef.current?.reload();
              }}
            />
          }
          width="70%"
          onClose={onDrawerClose}
          visible={drawerVisiable}
          bodyStyle={{ paddingBottom: 80 }}
          placement="left"
        >
          <ProList<Rule>
            actionRef={ruleActionRef}
            rowKey="code"
            request={async (params = {}) => {
              let list: Rule[] = [];
              let success = true;
              let total = 0;

              if (rules.length > 0) {
                const fc = searchParams.find(
                  (param) =>
                    param.key === 'code' &&
                    param.oper === 'NOT_IN' &&
                    param.filterDataType === 'LIST',
                );
                if (!fc) {
                  searchParams.push({
                    key: 'code',
                    oper: 'NOT_IN',
                    filterDataType: 'LIST',
                    filterValue: rules.map((rule) => rule.code),
                  });
                } else {
                  fc.filterValue = rules.map((rule) => rule.code);
                }
              }
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
            showActions="hover"
            locale={{
              emptyText: '没有选择任何规则',
            }}
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
                      <Tag color="blue">{row.type}</Tag>
                      {row.tags &&
                        row.tags.split(' ').map((tag) => {
                          return <Tag>{tag}</Tag>;
                        })}
                    </Space>
                  );
                },
              },
              actions: {
                render: (text, row) => [
                  <Button type="link" onClick={() => onAddRule(row)}>
                    添加
                  </Button>,
                ],
              },
            }}
          />
        </Drawer>
      </ProForm>
    </PageHeaderWrapper>
  );
};

export default Index;
