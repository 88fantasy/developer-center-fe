// eslint-disable-next-line import/no-extraneous-dependencies
import type { Request, Response } from 'express';
import { parse } from 'url';
import mockjs from 'mockjs';
import type { RulePackageList,  } from './data.d';
import type { ApiResponsePage, QueryPageConditionRequest } from 'ant-design-exframework';


const genData = () => {
  const data: RulePackageList = mockjs.mock({
    code : '@id',
    name: '@word',
    description: '@cparagraph(1)',
    ruleCount : '@integer(0,100)',
    history: '@integer(0,1000000)',
    today: 0,
  });
  return data;
}
// mock tableListDataSource
const genList = (current: number, pageSize: number) => {
  const tableListDataSource: RulePackageList[] = [];

  for (let i = 0; i < pageSize; i += 1) {
    const data = genData();
    tableListDataSource.push(data);
  }
  tableListDataSource.reverse();
  return tableListDataSource;
};

let tableListDataSource = genList(1, 100);

function getDictionary(req: Request, res: Response, u: string) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }
  const { current = 1, pageSize = 10 } = req.query;
  const params = (parse(realUrl, true).query as unknown) as TableListParams;

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

  if (params.name) {
    dataSource = dataSource.filter(data => data.name.includes(params.name || ''));
  }
  const result = {
    data: dataSource,
    total: tableListDataSource.length,
    success: true,
    pageSize,
    current: parseInt(`${params.currentPage}`, 10) || 1,
  };

  return res.json(result);
}

function remove(req: Request, res: Response, u: string, b: Request) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }

  const body = (b && b.body) || req.body;
  const { key } = body;

  tableListDataSource = tableListDataSource.filter(item => key.indexOf(item.key) === -1);

  const result = {
    list: tableListDataSource,
    pagination: {
      total: tableListDataSource.length,
    },
  };

  res.json(result);
}

function post(req: Request, res: Response, u: string, b: Request) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }

  const body = (b && b.body) || req.body;
  const { method, name, desc, key } = body;

  switch (method) {
    case 'add':
      (() => {
        const newModel : DictionaryItem = genData();
        tableListDataSource.unshift(newModel);
        return res.json(newModel);
      })();
      return;

    case 'update':
      (() => {
        let newRule = {};
        tableListDataSource = tableListDataSource.map(item => {
          if (item.key === key) {
            newRule = { ...item, desc, name };
            return { ...item, desc, name };
          }
          return item;
        });
        return res.json(newRule);
      })();
      return;
    default:
      break;
  }

  const result = {
    list: tableListDataSource,
    pagination: {
      total: tableListDataSource.length,
    },
  };

  res.json(result);
}

function query(req: Request, res: Response, u: string): ApiResponsePage<RulePackageList> {
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

  const result: ApiResponsePage<RulePackageList> = {
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
  'GET /rule/get': getDictionary,
  'POST /rule/query': query,
  'POST /rule/save': post,
};
