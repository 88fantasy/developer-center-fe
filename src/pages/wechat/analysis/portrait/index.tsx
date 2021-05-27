import React, { useState, useEffect } from 'react';
import ProCard, { StatisticCard } from '@ant-design/pro-card';
import { listUserPortrait } from '../service';
import type { UserPortraitItem, UserPortraitResponse } from '../data';
import moment from 'moment';
import { DatePicker, Space, Select, Typography } from 'antd';
import { Pie, Bar } from '@ant-design/charts';

const Index: React.FC<{ appId: string }> = (props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [range, setRange] = useState<number>(1);
  const [date, setDate] = useState<string>(moment().add(-1, 'day').format('YYYYMMDD'));
  const [user, setUser] = useState<string>('visitUv');
  const [dataSource, setDataSource] = useState<UserPortraitResponse>();
  const { appId } = props;

  useEffect(() => {
    if (appId) {
      setLoading(true);
      listUserPortrait(appId, date, range)
        .then((res) => {
          if (res && res.status && !res.data.errcode) {
            setDataSource(res.data);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [appId, date, range]);

  const total = dataSource ? dataSource[user].platforms.reduce((_total: number, current: UserPortraitItem) => _total + current.value, 0,) : 0;

  const manItem: UserPortraitItem = dataSource ? dataSource[user].genders.find((v: { name: string; }) => v.name === '男') : { value: 0};
  const womanItem: UserPortraitItem = dataSource ? dataSource[user].genders.find((v: { name: string; }) => v.name === '女') : { value: 0};

  return (
    <ProCard
      title={
        <Space size={10}>
          <DatePicker
            format="YYYYMMDD"
            defaultValue={moment().add(-1, 'day')}
            onChange={(dates, dateStrings) => {
              setDate(dateStrings);
            }}
          />

          <Select
            defaultValue={range}
            style={{ width: 120 }}
            onChange={(value) => {
              setRange(value);
            }}
          >
            <Select.Option value={1}>近1天</Select.Option>
            <Select.Option value={7}>近7天</Select.Option>
            <Select.Option value={30}>近30天</Select.Option>
          </Select>

          <Select
            defaultValue={user}
            style={{ width: 120 }}
            onChange={(value) => {
              setUser(value);
            }}
          >
            <Select.Option value="visitUv">活跃用户</Select.Option>
            <Select.Option value="visitUvNew">新增用户</Select.Option>
          </Select>

          <Typography.Text>{dataSource ? dataSource.refDate : ''}</Typography.Text>
        </Space>
      }
      extra={<a href="#">下载</a>}
      // split={responsive ? 'horizontal' : 'vertical'}
      headerBordered
      bordered
      loading={loading}
    >
      <ProCard split="horizontal" colSpan="70%">
        <ProCard split="horizontal">
          <StatisticCard.Group direction="row"  >
            <StatisticCard
              colSpan="20%"
              statistic={{
                title: '总用户',
                value: total,
              }}
            />
            <StatisticCard.Divider type="vertical" />
            <StatisticCard
              colSpan="35%"
              statistic={{
                title: '男',
                value: manItem.value,
                description: <StatisticCard.Statistic title="占比" value={total === 0? "100%" : ''.concat((manItem.value / total * 100).toFixed(2), '%')} />,
              }}
              chart={
                <Pie
                  height={80}
                  width={80}
                  innerRadius={0.7}
                  renderer="svg"
                  data={[{ name: '', value: total - manItem.value }, { name: '男', value: manItem.value}]}
                  angleField="value"
                  colorField="name"
                  statistic={undefined}
                  legend={false}
                  tooltip={false}
                  color={[ '#f5f5f5','#6394f9', ]}
                />
              }
              chartPlacement="left"
            />
            <StatisticCard
              colSpan="35%"
              statistic={{
                title: '女',
                value: womanItem.value,
                description: <StatisticCard.Statistic title="占比" value={total === 0? "100%" : ''.concat((womanItem.value / total * 100).toFixed(2), '%')} />,
              }}
              chart={
                <Pie
                  height={80}
                  width={80}
                  innerRadius={0.7}
                  renderer="svg"
                  data={[{ name: '女', value:  womanItem.value}, { name: '', value: total - womanItem.value }, ]}
                  angleField="value"
                  colorField="name"
                  statistic={undefined}
                  legend={false}
                  tooltip={false}
                  color={[ '#65daab','#f5f5f5' ]}
                />
              }
              chartPlacement="left"
            />
          </StatisticCard.Group>
          {/* <ProCard split="vertical">
            <StatisticCard
              statistic={{
                title: '总人数',
                value: dataSource
                  ? dataSource[user].platforms.reduce(
                      (total: number, current: UserPortraitItem) => total + current.value,
                      0,
                    )
                  : 0,
              }}
            />
            <StatisticCard
              statistic={{
                title: '性别',
                value: dataSource
                  ? dataSource[user].genders
                      .map((v: UserPortraitItem) => `${v.value}${v.name}`)
                      .join('/')
                  : '',
                // description: <Statistic title="比例" value="8.04%" trend="down" />,
              }}
            />
          </ProCard> */}
        </ProCard>
        <StatisticCard
          title="设备分布"
          chart={
            <Bar
              data={
                dataSource
                  ? dataSource[user].devices.filter((v: UserPortraitItem) => v.value > 0)
                  : []
              }
              xField="value"
              yField="name"
              legend={{ position: 'top-left' }}
            />
          }
        />
      </ProCard>
      <ProCard split="horizontal" title="终端分布">
        <StatisticCard
          chart={
            <Pie
              height={200}
              data={dataSource ? dataSource[user].platforms : []}
              angleField="value"
              colorField="name"
              appendPadding={10}
              radius={0.9}
              label={{
                type: 'inner',
                offset: '-30%',
                content: function content(_ref) {
                  const { percent } = _ref;
                  return ''.concat((percent * 100).toFixed(2), '%');
                },
                style: {
                  fontSize: 14,
                  textAlign: 'center',
                },
              }}
              interactions={[{ type: 'element-active' }]}
            />
          }
        />

        <StatisticCard
          title="年龄分布"
          chart={
            <Pie
              height={300}
              data={dataSource ? dataSource[user].ages : []}
              angleField="value"
              colorField="name"
              appendPadding={10}
              radius={0.9}
              label={{
                type: 'inner',
                offset: '-30%',
                content: function content(_ref) {
                  const { percent } = _ref;
                  return ''.concat((percent * 100).toFixed(2), '%');
                },
                style: {
                  fontSize: 14,
                  textAlign: 'center',
                },
              }}
              interactions={[{ type: 'element-active' }]}
            />
          }
        />
      </ProCard>
    </ProCard>
  );
};

export default Index;
