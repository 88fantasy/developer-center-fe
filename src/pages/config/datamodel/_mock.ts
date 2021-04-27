// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';
import { parse } from 'url';
import mockjs from 'mockjs';
import { DataModelItem, TableListParams } from '@/pages/config/datamodel/data';


// mock tableListDataSource
const genList = (current: number, pageSize: number) => {
  const tableListDataSource: DataModelItem[] = [];

  for (let i = 0; i < pageSize; i += 1) {
    const data = mockjs.mock({
      key: '@id',
      modelCode : '@string("lower", 5)',
      appCode : '@string("lower", 5)',
      disabled : '@boolean',
      name: '@title',
      desc: '@cparagraph(1)',
      dependencies : [],
      updatedAt: '@datetime',
      createdAt: '@datetime',
    });
    tableListDataSource.push(data);
  }
  tableListDataSource.reverse();
  return tableListDataSource;
};

let tableListDataSource = genList(1, 100);

function getDataModel(req: Request, res: Response, u: string) {
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

function postRule(req: Request, res: Response, u: string, b: Request) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }

  const body = (b && b.body) || req.body;
  const { method, name, desc, key } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      tableListDataSource = tableListDataSource.filter(item => key.indexOf(item.key) === -1);
      break;
    case 'post':
      (() => {
        const newModel : DataModelItem = mockjs.mock({
          key: '@id',
          modelCode : '@string("lower", 5)',
          appCode : '@string("lower", 5)',
          disabled : '@boolean',
          name: '@title',
          desc: '@cparagraph(1)',
          dependencies : [],
          updatedAt: '@datetime',
          createdAt: '@datetime',
        });
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

export default {
  'GET /api/getDataModel': getDataModel,
  'POST /api/rule': postRule,
};
