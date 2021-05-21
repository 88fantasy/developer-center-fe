import type { ReactText } from 'react';
import React, { useState, useRef, useEffect } from 'react';
import type { ActionType } from '@ant-design/pro-table';
import Field from '@ant-design/pro-field';
import ProList from '@ant-design/pro-list';
import type { FilterCondition } from 'ant-design-exframework';
import { list } from './service';
import type { Rule } from '../../data';
import { Avatar, Space, Tag, Timeline, Tooltip } from 'antd';
import type { RuleInstance } from '../data';
import moment from 'moment';
import { diff } from '@/utils/date';
import { CheckCircleTwoTone, CheckOutlined, ClockCircleOutlined, ClockCircleTwoTone, ExclamationCircleTwoTone, LoadingOutlined, MinusCircleTwoTone } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';

const Index: React.FC<{ id?: string }> = (props) => {
  const { id } = props;

  const [instances, setInstances] = useState<RuleInstance[]>([]);

  useEffect(() => {
    if (id) {
      list(id).then((res) => {
        if (res && res.status) {
          setInstances(res.data);
        }
      });
    }
  }, [id]);
  
  const getRuleStatus = (status: string): React.ReactNode => {
    switch (status) {
      case 'START':
        return <ClockCircleTwoTone />;
      case 'NEEDNOT':
        return <MinusCircleTwoTone />;
      case 'PROCESSING':
        return <LoadingOutlined />;
      case 'FINISHED':
        return <CheckCircleTwoTone twoToneColor="#52c41a" />;
      case 'FAILED':
        return <ExclamationCircleTwoTone twoToneColor="#eb2f96" />;
      default:
        return <CheckCircleTwoTone twoToneColor="#52c41a" />;
    }
  };

  return (
    <PageContainer header={{ title: undefined, breadcrumb: {} }}>
      <Timeline mode="left">
        {instances.map((ins) => {
          return (
            <Timeline.Item dot={getRuleStatus(ins.status)} style={{ fontSize: '16px' }}>
              <Space size="large">
                {ins.name}
                <Tooltip
                  title={`${ins.startTime} - ${ins.endTime ? ins.endTime : '至今'}`}
                  // color=""
                  placement="right"
                >
                  <Tag color="#5BD8A6">
                    {ins.endTime
                      ? diff(moment(ins.endTime).diff(ins.startTime, 'seconds'))
                      : diff(moment().diff(moment(ins.startTime), 'seconds'))}
                  </Tag>
                </Tooltip>
              </Space>
            </Timeline.Item>
          );
        })}
      </Timeline>
    </PageContainer>
  );
};

export default Index;
