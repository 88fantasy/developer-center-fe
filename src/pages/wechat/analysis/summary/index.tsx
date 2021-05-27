import React, { useState, useRef, useEffect } from 'react';
import { listDailySummary, listVisitPage } from '../service';
import type { DailySummary, DateRange, VisitPage } from '../data';
import moment from 'moment';
import { Card, DatePicker, Spin } from 'antd';
import { Line } from '@ant-design/charts';

type LineData = {
  date: string;
  value: number;
  category: string;
}

const dict = {
  visitTotal: '累计用户数',
  sharePv: '转发次数',
  shareUv: '转发人数',
}

const Index: React.FC<{ appId: string }> = (props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    begin_date: moment().add(-7, 'day').format('YYYYMMDD'),
    end_date: moment().add(-1, 'day').format('YYYYMMDD'),
  });
  const [dataSource, setDataSource] = useState<LineData[]>([]);
  const { appId } = props;

  useEffect(() => {
    if (appId && dateRange) {
      setLoading(true);
      listDailySummary(appId, dateRange).then((res) => {
        if (res && res.status && !res.data.errcode) {
          const data: LineData[] = [];
          res.data.list.forEach((value) => {
            Object.keys(value).filter((n) => n !== 'refDate').forEach((n) => {
              data.push({
                date: moment(value.refDate, 'YYYYMMDD').format('YYYY-MM-DD'),
                value: value[n],
                category: dict[n] || n,
              })
            })
          })
          setDataSource(data);
        }
      }).finally(()=> {
        setLoading(false);
      });
    }
  }, [appId, dateRange]);

  const rangeFormat = {
    今天: [moment().startOf('day'), moment()],
    本周: [moment().startOf('week'), moment().endOf('week')],
    本月: [moment().startOf('month'), moment().endOf('month')],
  };

  return (
    <Card bordered={false}
      title={
        <DatePicker.RangePicker
          defaultValue={[moment().add(-7, 'day'), moment().add(-1, 'day')]}
          // disabledDate={ props.disabledRangeTime }
          showTime={false}
          format="YYYYMMDD"
          onChange={(dates, dateStrings) => {
            setDateRange({ begin_date: dateStrings[0], end_date: dateStrings[1] });
          }}
          ranges={rangeFormat}
        />
      }
      extra={<a href="#">下载</a>}
      // style={{ width: 300 }}
    >
      <Spin spinning={loading}>
        <Line 
          data={dataSource} 
          xField="date"
          yField="value"
          seriesField="category"
          smooth
          animation={{
            appear: {
              animation: 'path-in',
              duration: 5000,
            },
          }}
        />
      </Spin>
    </Card>
  );
};

export default Index;
