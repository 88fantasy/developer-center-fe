import React, { useState, useRef } from 'react';
import {
  Button,
  List,
  Card,
  Typography,
  Tooltip,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import type { ActionType } from '@ant-design/pro-table';
import ProList from '@ant-design/pro-list';
import numeral from 'numeral';
import { history, } from 'umi';
import type { RulePackageList } from '../data';
import type { FilterCondition } from 'ant-design-exframework';
import { QueryParamBar } from 'ant-design-exframework';
import {
  EditOutlined,
  PlusCircleOutlined,
  ProfileOutlined,
} from '@ant-design/icons';
import { query } from '../service';
import styles from './style.less';

const Index: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [searchParams, setSearchParams] = useState<FilterCondition[]>([]);

  const formatWan = (val: number) => {
    const v = val * 1;
    if (Number.isNaN(v)) return '';

    let result: React.ReactNode = val;
    if (val > 1000) {
      result = (
        <span>
          {Math.floor(val / 1000)}
          <span
            style={{
              position: 'relative',
              top: -2,
              fontSize: 14,
              fontStyle: 'normal',
              marginLeft: 2,
            }}
          >
            千
          </span>
        </span>
      );
    }
    else {
      result = (
        <span>
          {val}
        </span>
      );
    }
    return result;
  };

  return (
    <PageHeaderWrapper title={false}>
      <div className={styles.cardList}>
        <ProList<RulePackageList>
          toolBarRender={() => {
            return [
              <Button type="primary" onClick={() => {
                history.push('/rule/package/edit/new');
              }}>
                新增
                <PlusCircleOutlined
                  style={{
                    marginLeft: 8,
                  }}
                />
              </Button>,
            ];
          }}
          renderItem={(item) => {
            return (
              <List.Item key={item.code}>
                <Card
                  hoverable
                  className={styles.card}
                  bodyStyle={{ paddingBottom: 20 }}
                  actions={[
                    <Tooltip key="edit" title="编辑">
                      <EditOutlined onClick={() => {
                        history.push(`/rule/package/edit/${item.code}`);
                      }} />
                    </Tooltip>,
                    <Tooltip title="执行记录" key="query">
                      <ProfileOutlined onClick={() => {
                        history.push({
                          pathname: '/rule/instance',
                          query: {
                            package: item.code,
                          }, 
                        });
                      }} />
                    </Tooltip>,
                  ]}
                >
                  <Card.Meta
                    // avatar={<img alt="" className={styles.cardAvatar} src={item.avatar} />}
                    title={<a>{item.name}</a>}
                    description={
                      <Typography.Paragraph className={styles.item} ellipsis={{ rows: 3 }}>
                        {item.description}
                      </Typography.Paragraph>
                    }
                  />
                  <div className={styles.cardInfo}>
                    <div>
                      <p>累计运算次数</p>
                      <p>{formatWan(item.history || 0)}</p>
                    </div>
                    <div>
                      <p>今天运算</p>
                      <p>{numeral(item.today || 0).format('0,0')}</p>
                    </div>
                  </div>
                </Card>
              </List.Item>
            );
          }}
          headerTitle={
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
          }
          itemLayout="vertical"
          actionRef={actionRef}
          rowKey="code"
          pagination={{
            defaultPageSize: 8,
            showSizeChanger: false,
          }}
          grid={{ gutter: 8, column: 4 }}
          showActions="hover"
          locale={{
            emptyText: '没有任何规则集',
          }}
          request={async (params = {}) => {
            let list: RulePackageList[] = [];
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
        />
      </div>
      
      
    </PageHeaderWrapper>
  );
};

export default Index;
