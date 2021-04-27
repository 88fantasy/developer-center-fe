// eslint-disable-next-line import/no-extraneous-dependencies
import type { Request, Response } from 'express';
import { parse } from 'url';
import mockjs from 'mockjs';
import type { Com, } from './data.d';
import type { ApiResponsePage, QueryPageConditionRequest } from 'ant-design-exframework';

const genData = () => {
  const data: Com = mockjs.mock({
    agentId: '@id',
    name: '@cname',
    secret: '@string(32)',
  });
  return data;
};
// mock tableListDataSource
const genList = (current: number, pageSize: number) => {
  const tableListDataSource: Com[] = [];

  for (let i = 0; i < pageSize; i += 1) {
    const data = genData();
    tableListDataSource.push(data);
  }
  tableListDataSource.reverse();
  return tableListDataSource;
};

const tableListDataSource = genList(1, 100);

function queryList(req: Request, res: Response, u: string): ApiResponsePage<Com> {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }
  const { current = 1, pageSize = 10 } = req.query;
  const params = (parse(realUrl, true).query as unknown) as QueryPageConditionRequest;

  let dataSource = [...tableListDataSource].slice((current - 1) * pageSize, current * pageSize);
  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  const result: ApiResponsePage<Com> = {
    code: 200,
    status: true,
    data: {
      list: dataSource,
      pager: {
        size: params.page?.pageSize ? tableListDataSource.length / params.page?.pageSize : 0,
        total: tableListDataSource.length,
        current: parseInt(`${params.page?.current}`, 10) || 1,
        pageSize: params.page?.pageSize,
      },
    },
  };

  return res.json(result);
}

export default {
  'POST /wechat-com-app/query': queryList,
};
