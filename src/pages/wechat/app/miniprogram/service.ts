import request from '@/utils/request';
import type { ApiResponseData, ApiResponsePage,  QueryPageConditionRequest, } from 'ant-design-exframework';
import type { MiniProgram } from './data';

export async function query(params?: QueryPageConditionRequest) {
  return request.post<ApiResponsePage<MiniProgram>>('/wechat-app/query', {
    data: {
      ...params,
    },
  });
}

export async function refresh() {
  return request.get<string>('/wechat-app/refresh', {
    
  });
}

export async function post(params: MiniProgram) {
  return request.post<ApiResponseData<boolean>>('/wechat-app/save', {
    data: {
      ...params,
    },
  });
}

export async function get(appId: string) {
  return request.get<ApiResponseData<MiniProgram>>(`/wechat-app/get/${appId}`, {

  });
}
