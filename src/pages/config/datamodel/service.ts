import request from '@/utils/request';
import { TableListParams, DataModelItem } from './data.d';

export async function queryRule(params?: TableListParams) {
  return request('/api/getDataModel', {
    params,
  });
}

export async function removeRule(params: { key: number[] }) {
  return request('/api/deleteDataModel', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addRule(params: DataModelItem) {
  return request('/api/addDataModel', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateRule(params: TableListParams) {
  return request('/api/updateDataModel', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
