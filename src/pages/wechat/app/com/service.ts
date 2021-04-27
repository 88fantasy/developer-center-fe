import request from '@/utils/request';
import type { ApiResponsePage,  QueryPageConditionRequest, } from 'ant-design-exframework';
import type { Com, } from './data';

export async function query(params?: QueryPageConditionRequest) {
  return request.post<ApiResponsePage<Com>>('/wechat-com-app/query', {
    data: {
      ...params,
    },
  });
}

export async function refresh() {
  return request.get<string>('/wechat-com-app/refresh', {
    
  });
}