import React, { useState, useRef } from 'react';
import { history, } from 'umi';
import { Button, Card, Dropdown, List, Menu, message, notification, Tooltip } from 'antd';
import type { ActionType,  } from '@ant-design/pro-table';
import type { FilterCondition } from 'ant-design-exframework';
import { QueryParamBar } from 'ant-design-exframework';
import type { MiniProgram } from './data';
import { query, refresh, post } from './service';
import ProForm, { DrawerForm, ProFormSwitch, ProFormText } from '@ant-design/pro-form';
import styles from './style.less';
import ProList from '@ant-design/pro-list';
import Avatar from 'antd/lib/avatar/avatar';
import { CopyOutlined, DownOutlined, EllipsisOutlined, PieChartOutlined, PlusCircleOutlined, SyncOutlined } from '@ant-design/icons';

const Index: React.FC = () => {
  const [searchParams, setSearchParams] = useState<FilterCondition[]>([]);
  const actionRef = useRef<ActionType>();
  const [drawVisible, setDrawVisible] = useState<boolean>(false);
  // const [formValues, setFormValues] = useState({});

  return (
    <div className={styles.cardList}>
      <ProList<MiniProgram>
        toolBarRender={() => {
          return [
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
                    <SyncOutlined />刷新缓存
                  </Menu.Item>
                </Menu>
              }
            >
              <Button type="primary" onClick={() => {
                setDrawVisible(true);
              }}>
                <PlusCircleOutlined />
                新增
                <DownOutlined
                  style={{
                    marginLeft: 10,
                  }}
                />
              </Button>
            </Dropdown>,
          ];
        }}
        renderItem={(item) => {
          return (
            <List.Item key={item.appId}>
              <Card
                hoverable
                className={styles.card}
                bodyStyle={{ paddingBottom: 20 }}
                actions={[
                  item.miniprogram && <Tooltip key="chart" title="统计报表">
                    <PieChartOutlined 
                      onClick={() => {
                        history.push(`/wechat/analysis/${item.appId}/visit`);
                      }}
                    />
                  </Tooltip>,
                  // <Tooltip title="执行记录" key="query">
                  //   <ProfileOutlined
                  //     onClick={() => {
                  //       history.push({
                  //         pathname: '/rule/instance',
                  //         query: {
                  //           package: item.code,
                  //         },
                  //       });
                  //     }}
                  //   />
                  // </Tooltip>,
                  <Dropdown
                    key="ellipsis"
                    overlay={
                      <Menu>
                        <Menu.Item>
                          <CopyOutlined />复制应用密钥
                        </Menu.Item>
                        {
                          item.paySecret && <Menu.Item>
                          <CopyOutlined />复制商户密钥
                        </Menu.Item>
                        }
                      </Menu>
                    }
                  >
                    <EllipsisOutlined />
                  </Dropdown>,
                ]}
              >
                <Card.Meta
                  avatar={
                    <Avatar >{item.name.substring(0, 1)}</Avatar>
                  }
                  title={<a>{item.name}</a>}
                  description={item.appId}
                />
                <div className={styles.cardInfo}>
                  <div>
                    <p>活跃用户</p>
                    <p>0</p>
                  </div>
                  <div>
                    <p>新增用户</p>
                    <p>0</p>
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
          emptyText: '没有任何应用',
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
      />
      <DrawerForm<MiniProgram>
              onVisibleChange={setDrawVisible}
              title="新建应用"
              visible={drawVisible}
              onFinish={async (fields) => {
                let success = false;
                await post({
                  ...fields,
                }).then((res) => {
                  if (res && res.status) {
                    success = res.data;
                    if (success) {
                      actionRef.current?.reload();
                      setDrawVisible(false);
                    }
                  } else {
                    notification.error({
                      message: '错误提示',
                      description: res.message,
                    });
                  }
                });
                return success;
              }}
            >
              <ProFormText width="md" name="name" label="应用名称" required />
              <ProForm.Group title="应用信息">
                <ProFormText
                  width="md"
                  name="appId"
                  label="应用Id"
                  placeholder="请输入微信公众平台中的AppID"
                  required
                />

                <ProFormText.Password
                  width="md"
                  name="appSecret"
                  label="应用密钥"
                  placeholder="请输入微信公众平台中的AppSecret"
                  required
                />
              </ProForm.Group>
              <ProForm.Group title="支付相关">
                <ProFormText
                  width="md"
                  name="conpayIdtract"
                  label="商户号"
                  placeholder="请输入名称"
                />
                <ProFormText.Password
                  width="md"
                  name="paySecret"
                  label="商户密钥"
                  placeholder="请输入名称"
                />
              </ProForm.Group>
              <ProFormSwitch name="miniprogram" label="小程序" fieldProps={{ checked: true }} />
            </DrawerForm>
    </div>
  );
};

export default Index;
