import type { ReactText } from 'react';
import React, { useState, useRef, useEffect } from 'react';
import type { ActionType } from '@ant-design/pro-table';
import Field from '@ant-design/pro-field';
import ProList from '@ant-design/pro-list';
import type { FilterCondition } from 'ant-design-exframework';
import { query } from './service';
import type { Rule } from '../../data';
import { Avatar, Descriptions, Space, Tag, Tooltip } from 'antd';
import type { RuleInstance } from '../data';
import moment from 'moment';
import { diff } from '@/utils/date';

const Index: React.FC<{ id?: string }> = (props) => {
  const { id } = props;

  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly ReactText[]>([]);
  const actionRef = useRef<ActionType>();
  const defaultParams: FilterCondition[] = [
    {
      key: 'packageInstanceId',
      oper: 'EQUAL',
      filterValue: id,
      filterDataType: 'STRING',
    },
  ];
  const [searchParams, setSearchParams] = useState<FilterCondition[]>([]);

  useEffect(() => {
    if (id) {
      actionRef.current?.reload();
    }
  }, [id]);

  return (
    <ProList<RuleInstance>
      metas={{
        title: {
          dataIndex: 'name',
        },
        subTitle: {
          render: (dom, record) => {
            return (
              <Tooltip
                title={`${record.startTime} - ${record.endTime ? record.endTime : '至今'}`}
                // color=""
                placement="right"
              >
                <Tag color="#5BD8A6">
                  {record.endTime
                    ? diff(moment(record.endTime).diff(record.startTime, 'seconds'))
                    : diff(moment().diff(moment(record.startTime), 'seconds'))}
                </Tag>
              </Tooltip>
            );
          },
        },
        // description: {
        //   dataIndex: 'description',
        // },
        description: {
          render: (dom, record) => {
            return (
              <Descriptions column={1} bordered>
                <Descriptions.Item label="输入">
                  <Field text={record.input} valueType="jsonCode" mode="read" />
                </Descriptions.Item>
                <Descriptions.Item label="输出">
                  <Field text={record.output} valueType="jsonCode" mode="read" />
                </Descriptions.Item>
              </Descriptions>
            );
          },
        },
        avatar: {
          render: (dom, record) => {
            return (
              <Avatar size="small" style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
                {record.priority + 1}
              </Avatar>
            );
          },
        },
      }}
      // headerTitle={
      //   <QueryParamBar
      //     params={[
      //       {
      //         key: 'name',
      //         title: '应用名称',
      //         type: 'Input',
      //       },
      //       {
      //         key: 'agentId',
      //         title: '应用Id',
      //         type: 'Input',
      //       },
      //     ]}
      //     onChange={(conditions) => {
      //       setSearchParams(conditions);
      //       actionRef.current?.reload();
      //     }}
      //   />
      // }
      actionRef={actionRef}
      rowKey="id"
      expandable={{ expandedRowKeys, onExpandedRowsChange: setExpandedRowKeys }}
      pagination={{
        defaultPageSize: 20,
        showSizeChanger: false,
      }}
      locale={{
        emptyText: '没有任何规则集',
      }}
      request={async (params = {}) => {
        let list: RuleInstance[] = [];
        let success = true;
        let total = 0;
        await query({
          page: { current: params.current, pageSize: params.pageSize },
          conditions: [...searchParams, ...defaultParams],
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
  );
};

export default Index;
