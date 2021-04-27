import request from '@/utils/request';
import type { ApiResponsePage,  QueryPageConditionRequest, } from 'ant-design-exframework';
import type { Message, } from './data';

export async function query(params?: QueryPageConditionRequest) {
  return request.post<ApiResponsePage<Message>>('/message/query', {
    data: {
      ...params,
    },
  });
}
