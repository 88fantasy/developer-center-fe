import request from '@/utils/request';
// import request from 'umi-request';
import { GetParams, Pager, } from '@/typings';
import { TableListParams, Param, } from './data';

export async function getParam(params: GetParams) {
  return request.get(`/v1/param/getValue/${params.appCode}/${params.key}`, {
    
  });
}

export async function queryParam(params?: TableListParams) {
  return request.post<{
    list: Param[];
    pager: Pager;
  }>('/v1/param/queryList', {
    data: {
      page : {
        current : params?.current,
        pageSize : params?.pageSize,
      },
      ...params,
    },
  });
}

export async function removeParam(params: { keys: string[] }) {
  return request.delete('/v1/param/delete', {
    data: {
      ...params,
    },
  });
}

export async function postParam(params: Param) {
  return request.post('/v1/param/saveValue', {
    data: {
      ...params,
    },
  });
}
