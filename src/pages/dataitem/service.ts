import request from '@/utils/request';
// import request from 'umi-request';
import { Pager, } from '@/typings';
import { TableListParams, DataItem, GetDataItemParams, } from './data';

export async function getDataItem(params: GetDataItemParams) {
  return request.get(`/v1/dataitem/get/${params.appCode}/${params.withGlobal? true: false}`, {
    
  });
}

export async function queryDataItem(params?: TableListParams) {
  return request.post<{
    list: DataItem[];
    pager: Pager;
  }>('/v1/dataitem/queryList', {
    data: {
      page : {
        current : params?.current,
        pageSize : params?.pageSize,
      },
      ...params,
    },
  });
}

export async function removeDataItem(params: { codes: string[] }) {
  return request.delete('/v1/dataitem/delete', {
    data: {
      ...params,
    },
  });
}

export async function postDataItem(params: DataItem) {
  return request.post('/v1/dataitem/post', {
    data: {
      ...params,
    },
  });
}
