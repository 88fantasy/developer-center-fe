import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import Miniprogram from './miniprogram';
import Com from './com';

const WechatApp: React.FC = () => {
  const [tab, setTab] = useState('miniprogram');

  const tabList = [
    {
      key: 'miniprogram',
      tab: '微信应用',
      children: <Miniprogram />,
      style: { padding : 0},
    },
    {
      key: 'com',
      tab: '企业微信应用',
      children: <Com />,
      style: { padding : 0},
    },
  ];

  return (
    <PageContainer
      title={false}
      tabList={tabList}
      tabActiveKey={tab}
      onTabChange={(active) => setTab(active)}
    />
  );
};

export default WechatApp;
