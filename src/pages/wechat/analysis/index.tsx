import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { get, } from '../app/miniprogram/service';

import { useParams, history, } from 'umi';
import type { MiniProgram } from '../app/miniprogram/data';
import Visit from './visit';
import Summary from './summary';
import Portrait from './portrait';

// import Com from './com';

const WechatApp: React.FC = () => {
  const [miniProgram, setMiniProgram] = useState<MiniProgram>();
  const { appId, page = 'visit', } = useParams<{ appId: string; page: string }>();
  const [tab, setTab] = useState<string>(page);

  useEffect(() => {
    if (appId ) {
      get(appId).then((res) => {
        if (res && res.status) {
          setMiniProgram(res.data);
        }
      });
    }
  }, [appId, ]);

  const tabList = [
    {
      key: 'visit',
      tab: '页面分析',
      children: <Visit appId={appId} />,
      style: { padding : 0},
    },
    {
      key: 'summary',
      tab: '日访问量',
      children: <Summary appId={appId} />,
      style: { padding : 0},
    },
    {
      key: 'portrait',
      tab: '用户画像',
      children: <Portrait appId={appId} />,
      style: { padding : 0},
    },
  ];

  return (
    <PageContainer
      onBack={() => {
        history.replace('/wechat/app');
      }}
      title={`${miniProgram?.name}    (${miniProgram?.appId})`}
      tabList={tabList}
      tabActiveKey={tab}
      onTabChange={(active) => {
        history.push(`/wechat/analysis/${miniProgram?.appId}/${active}`);
        setTab(active);
      }}
    />
  );
};

export default WechatApp;
