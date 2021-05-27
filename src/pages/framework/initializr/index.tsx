import React, { useState, useRef } from 'react';
import { Button, Form, Space, Tag, Drawer } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import type { ActionType } from '@ant-design/pro-table';
import ProCard from '@ant-design/pro-card';
import ProList from '@ant-design/pro-list';
import ProForm, { ProFormText, ProFormRadio, ProFormDependency } from '@ant-design/pro-form';

import type { Project, Module } from './data';

const modules: Module[] = [
  {
    key: 'exframework-support-rest',
    name: 'Restful 接口组件',
    image: 'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png',
    tags: [
      {
        title: 'Spring',
        color: 'green',
      },
    ],
    description: '基于 SpringMvc 实现的 rest 接口组件',
  },
  {
    key: 'exframework-support-jersey',
    name: 'Jersey2 Restful 接口组件',
    image: 'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png',
    tags: [
      {
        title: 'Jersey',
        color: 'green',
      },
    ],
    description: '基于 Jersey 实现的 rest 接口组件, 注解采用标准 java rs',
  },
  {
    key: 'exframework-support-soap',
    name: 'Soap 接口组件',
    image: 'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png',
    tags: [
      {
        title: 'Cxf',
        color: 'green',
      },
      {
        title: 'Soap',
        color: 'green',
      },
    ],
    description: '基于 Apache Cxf 实现, 提供注解式接口',
  },
  {
    key: 'exframework-support-jdbc',
    name: 'JDBC数据库组件',
    image: 'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png',
    tags: [
      {
        title: 'MybatisPlus',
        color: 'green',
      },
      {
        title: 'Druid',
        color: 'green',
      },
    ],
    description: '基于 Druid 数据库连接池 和 MyBatisPlus 的实现, 后续添加无SQL注解式查询',
  },
  {
    key: 'exframework-support-jdbc-mysql',
    name: 'Mysql数据库驱动',
    image: 'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png',
    tags: [
      {
        title: 'Mysql',
        color: 'blue',
      },
    ],
    description: 'Mysql 驱动, 需要配合 exframework-support-jdbc 使用',
  },
  {
    key: 'exframework-support-jdbc-oracle',
    name: 'Oracle数据库驱动',
    image: 'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png',
    tags: [
      {
        title: 'Oracle',
        color: 'blue',
      },
    ],
    description: 'Oracle 驱动, 需要配合 exframework-support-jdbc 使用',
  },
  {
    key: 'exframework-support-mongo',
    name: 'Mongo 数据组组件',
    image: 'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png',
    tags: [
      {
        title: 'Spring',
        color: 'green',
      },
      {
        title: 'Mongo',
        color: 'green',
      },
    ],
    description: '基于Spring Mongo Templete实现',
  },
  {
    key: 'exframework-support-redis',
    name: 'Redis组件',
    image: 'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png',
    tags: [
      {
        title: 'Spring Redis',
        color: 'blue',
      },
    ],
    description: '基于Spring Redis Templete,后续考虑集成 Redission',
  },
  {
    key: 'exframework-support-cos',
    name: '腾讯云Cos文件系统组件',
    image: 'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png',
    tags: [
      {
        title: 'Tencent',
        color: 'green',
      },
      {
        title: 'Cos',
        color: 'green',
      },
    ],
    description: '基于腾讯云Cos对象存储,可替换Fastdfs文件系统,云端系统推荐使用',
  },
  {
    key: 'exframework-support-tdmq',
    name: '消息队列 TDMQ组件',
    image: 'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png',
    tags: [
      {
        title: '消息队列',
        color: 'blue',
      },
      {
        title: 'TDMQ',
        color: 'blue',
      },
      {
        title: 'Pulsar',
        color: 'blue',
      },
    ],
    description: '基于腾讯云TDMQ消息队列, 支持注解生成消费者',
  },
  {
    key: 'exframework-support-wechat',
    name: '微信组件',
    image: 'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png',
    tags: [
      {
        title: 'Wechat',
        color: 'blue',
      },
    ],
    description: '基于微信中心实现(对接微信开发平台),目前支持企业微信推送',
  },
  {
    key: 'exframework-support-monitor',
    name: '监控组件',
    image: 'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png',
    tags: [
      {
        title: 'Quartz',
        color: 'blue',
      },
    ],
    description: '基于Druid 为应用提供后台监控服务',
  },
  {
    key: 'exframework-support-monitor-job',
    name: '监控任务组件',
    image: 'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png',
    tags: [
      {
        title: 'Quartz',
        color: 'blue',
      },
    ],
    description: '自研实现, 通过继承MoinitorJob实现对任务统一监控,提供对外接口',
  },
];

const architecturers = {
  frontend: [
    {
      label: '公共组件',
      value: 'component',
    },
    {
      label: '功能组件',
      value: 'function',
    },
    {
      label: '应用',
      value: 'applcation',
    },
  ],
  backend: [
    {
      label: '基础组件',
      value: 'component',
    },
    {
      label: '功能组件',
      value: 'function',
    },
    {
      label: '单体应用',
      value: 'single',
    },
    {
      label: '分布式应用',
      value: 'distributed',
    },
  ],
  application: [{
    label: '管理系统',
    value: 'management',
  },{
    label: '商城',
    value: 'shop',
  }],
};

const Index: React.FC<{}> = () => {
  const [form] = Form.useForm();
  const [dependences, setDependences] = useState<Module[]>([]);
  const [drawerVisiable, setDrawerVisiable] = useState<boolean>(false);
  const dependencyActionRef = useRef<ActionType>();
  const moduleActionRef = useRef<ActionType>();

  const onDrawerOpen = () => {
    setDrawerVisiable(true);
  };

  const onDrawerClose = () => {
    setDrawerVisiable(false);
  };

  const onAddDependency = (module: Module) => {
    const newDependencies = [...dependences, module];
    setDependences(newDependencies);
    dependencyActionRef.current?.reload();
    moduleActionRef.current?.reload();
  };

  const onDeleteDependency = (module: Module) => {
    const newDependencies = dependences.filter((m) => m.key !== module.key);
    setDependences(newDependencies);
    dependencyActionRef.current?.reload();
    moduleActionRef.current?.reload();
  };

  return (
    <PageHeaderWrapper
      extra={[
        <Button key="share">分享</Button>,
        <Button key="gen" type="primary">
          生成
        </Button>,
      ]}
    >
      <ProForm<Project>
        submitter={false}
        initialValues={{
          group: 'com.gzmpc.xxx',
        }}
        form={form}
      >
        <ProCard split="vertical">
          <ProCard title="新建工程" colSpan="40%">
            <ProFormRadio.Group
              name="type"
              label="工程类型"
              radioType="button"
              initialValue="frontend"
              options={[
                {
                  label: '前端',
                  value: 'frontend',
                },
                {
                  label: '后端',
                  value: 'backend',
                },
                {
                  label: '应用',
                  value: 'application',
                },
              ]}
            />
            <ProFormDependency name={['type']}>
              {({ type }) => {
                return (
                  <ProFormRadio.Group
                    label="架构"
                    name="architecturer"
                    radioType="button"
                    options={architecturers[type]}
                  />
                );
              }}
            </ProFormDependency>
            <ProFormDependency name={['type', 'architecturer']}>
              {({ type, architecturer,}) => {
                return (
                  <ProFormRadio.Group
                    label="工程版本"
                    name="version"
                    layout="vertical"
                    options={[
                      {
                        label: '1.0 (Snapshot)',
                        value: '1',
                      },
                      {
                        label: '0.6',
                        value: '0.6',
                      },
                    ]}
                  />
                );
              }}
            </ProFormDependency>

            <ProForm.Group title="工程信息">
              <ProFormText name="name" label="工程名称" width="md" />
              <ProFormText name="group" label="Group" width="md" />
              <ProFormText name="artifact" label="Artifact" width="md" />
              <ProFormText name="description" label="描述" width="md" />
            </ProForm.Group>
          </ProCard>
          <ProCard
            title="所需组件"
            headerBordered
            extra={[
              <Button shape="round" onClick={onDrawerOpen}>
                添加组件
              </Button>,
            ]}
          >
            <ProList<Module>
              rowKey="key"
              actionRef={dependencyActionRef}
              dataSource={dependences}
              showActions="hover"
              toolBarRender={false}
              locale={{
                emptyText: '没有选择任何组件',
              }}
              metas={{
                title: {
                  dataIndex: 'name',
                },
                avatar: {
                  dataIndex: 'image',
                },
                description: {
                  dataIndex: 'description',
                },
                subTitle: {
                  render: (text, row) => {
                    return (
                      <Space size={0}>
                        {row.tags.map((tag) => {
                          return <Tag color={tag.color}>{tag.title}</Tag>;
                        })}
                      </Space>
                    );
                  },
                },
                actions: {
                  render: (text, row) => [
                    <Button type="link" onClick={() => onDeleteDependency(row)}>
                      删除
                    </Button>,
                  ],
                },
              }}
            />
          </ProCard>
        </ProCard>
        <Drawer
          title="组件库"
          width={720}
          onClose={onDrawerClose}
          visible={drawerVisiable}
          bodyStyle={{ paddingBottom: 80 }}
          placement="left"
        >
          <ProList<Module>
            actionRef={moduleActionRef}
            rowKey="key"
            dataSource={modules.filter((m) => !dependences.includes(m))}
            showActions="hover"
            locale={{
              emptyText: '没有选择任何组件',
            }}
            metas={{
              title: {
                dataIndex: 'name',
              },
              avatar: {
                dataIndex: 'image',
              },
              description: {
                dataIndex: 'description',
              },
              subTitle: {
                render: (text, row) => {
                  return (
                    <Space size={0}>
                      {row.tags.map((tag) => {
                        return <Tag color={tag.color}>{tag.title}</Tag>;
                      })}
                    </Space>
                  );
                },
              },
              actions: {
                render: (text, row) => [
                  <Button type="link" onClick={() => onAddDependency(row)}>
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
