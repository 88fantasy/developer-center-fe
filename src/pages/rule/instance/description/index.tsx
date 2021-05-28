import React, { useEffect, useState } from 'react';
import type { RulePackageInstance } from '../data.d';
import { get } from './service';
import type { Dispatch } from 'umi';
import { connect } from 'umi';
import type { ConfigStateType } from '@/models/config';
import type { ConnectState } from '@/models/connect';
import ProDescriptions from '@ant-design/pro-descriptions';
import { PageContainer } from '@ant-design/pro-layout';

const Description: React.FC<{ config: ConfigStateType; id?: string }> = (props) => {
  const [currentPackageInstance, setCurrentPackageInstance] = useState<RulePackageInstance>();

  const {
    config: {
      dictionary: { ruleStatus },
    },
    id,
  } = props;

  useEffect(() => {
    if (id) {
      get(id).then((res) => {
        if (res && res.status) {
          setCurrentPackageInstance(res.data);
        }
      });
    }
  }, [id]);

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

  return (
    <ProDescriptions<RulePackageInstance>
      dataSource={currentPackageInstance}
      column={2}
      columns={[
        {
          title: '描述',
          dataIndex: 'description',
          valueType: 'textarea',
          span: 2,
        },
        {
          title: '应用规则时停止',
          dataIndex: 'skipOnFirstAppliedRule',
          valueType: 'switch',
        },
        {
          title: '规则失败时停止',
          dataIndex: 'skipOnFirstFailedRule',
          valueType: 'switch',
        },
        {
          title: '没有触发规则时停止',
          dataIndex: 'skipOnFirstNonTriggeredRule',
          valueType: 'switch',
        },
        {
          title: '优先级超过阈值时停止',
          dataIndex: 'rulePriorityThreshold',
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
          title: '输入',
          dataIndex: 'input',
          valueType: 'jsonCode',
          span: 2,
          // fieldProps: {
          //   style: {
          //     width: '600px',
          //   },
          // },
        },
        {
          title: '输出',
          dataIndex: 'output',
          span: 2,
          valueType: 'jsonCode',
          // fieldProps: {
          //   style: {
          //     width: '600px',
          //   },
          // },
        },
      ]}
    />
  );
};

type IndexProps = {
  dispatch: Dispatch;
  config: ConfigStateType;
  loading?: boolean;
  id?: string;
};

type IndexState = {};

class Index extends React.Component<IndexProps, IndexState> {
  constructor(props: IndexProps) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'config/getDictionary',
      payload: ['ruleStatus'],
    });
  }

  render() {
    const { config, id } = this.props;

    return (
      <PageContainer header={{ title: undefined, breadcrumb: {} }}>
        <Description config={config} id={id} />
      </PageContainer>
    );
  }
}

export default connect(({ config, loading }: ConnectState) => ({
  config,
  loading: loading.models.config,
}))(Index);
