import request from '@/utils/request';
// import request from 'umi-request';
import { GetParams, Pager,  } from '@/typings';
import { TableListParams, Dictionary } from './data';

export async function getDictionary(params: GetParams) {
  return request.get(`/v1/dictionary/get/${params.appCode}/${params.key}`, {
    
  });
}

export async function queryDictionary(params?: TableListParams) {
  return request.post<{
    list: Dictionary[];
    pager: Pager;
  }>('/v1/dictionary/queryList', {
    data: {
      page : {
        current : params?.current,
        pageSize : params?.pageSize,
      },
      ...params,
    },
  });
}

export async function removeDictionary(params: { keys: string[] }) {
  return request.delete('/v1/dictionary/delete', {
    data: {
      ...params,
    },
  });
}

export async function postDictionary(params: Dictionary) {
  return request.post('/v1/dictionary/save', {
    data: {
      ...params,
    },
  });
}
