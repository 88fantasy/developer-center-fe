import React, { useState, useRef, useEffect } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { listVisitPage } from '../service';
import type { VisitPage } from '../data';
import moment from 'moment';
import type { SorterResult } from 'antd/lib/table/interface';
import { DatePicker } from 'antd';

const Index: React.FC<{ appId: string }> = (props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [sorter, setSorter] = useState<string>('');
  const actionRef = useRef<ActionType>();
  const [date, setDate] = useState<string>(moment().add(-1, 'day').format('YYYYMMDD'));
  const [dataSource, setDataSource] = useState<VisitPage[]>([]);
  const { appId } = props;

  useEffect(() => {
    if (appId) {
      setLoading(true);
      listVisitPage(appId, date).then((res) => {
        if (res && res.status && !res.data.errcode) {
          setDataSource(res.data.list);
        }
      }).finally(()=> {
        setLoading(false);
      });
    }
  }, [appId, date]);

  // const rangeFormat = {
  //   今天: [moment().startOf('day'), moment()],
  //   本周: [moment().startOf('week'), moment().endOf('week')],
  //   本月: [moment().startOf('month'), moment().endOf('month')],
  // };

  const columns: ProColumns<VisitPage>[] = [
    {
      title: '页面路径',
      dataIndex: 'pagePath',
      width: 200,
    },
    {
      title: '访问次数',
      dataIndex: 'pageVisitPv',
    },
    {
      title: '访问人数',
      dataIndex: 'pageVisitUv',
    },
    {
      title: '次均停留时长',
      dataIndex: 'pageStaytimePv',
    },
    {
      title: '进入页次数',
      dataIndex: 'entrypagePv',
    },
    {
      title: '退出页次数',
      dataIndex: 'exitpagePv',
    },
    {
      title: '转发次数',
      dataIndex: 'pageSharePv',
    },
    {
      title: '转发人数',
      dataIndex: 'pageShareUv',
    },
  ];

  return (
    <ProTable<VisitPage>
      loading={loading}
      actionRef={actionRef}
      rowKey="pagePath"
      onChange={(_, _filter, _sorter) => {
        const sorterResult = _sorter as SorterResult<VisitPage>;
        if (sorterResult.field) {
          setSorter(`${sorterResult.field}_${sorterResult.order}`);
        }
      }}
      params={{
        sorter,
      }}
      toolbar={{
        search: (
          <DatePicker
            format="YYYYMMDD"
            defaultValue={moment().add(-1, 'day')}
            onChange={(dates, dateStrings) => {
              setDate(dateStrings);
            }}
          />
        ),
        actions: [],
      }}
      dataSource={dataSource}
      columns={columns}
      search={false}
      options={{
        reload: false,
      }}
    />
  );
};

export default Index;
