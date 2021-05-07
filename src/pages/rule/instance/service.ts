import request from '@/utils/request';
import type { ApiResponsePage,  QueryPageConditionRequest, } from 'ant-design-exframework';
import type { RulePackageInstance, } from './data';

export async function query(params?: QueryPageConditionRequest) {
  return request.post<ApiResponsePage<RulePackageInstance>>('/rule/queryPackageInstances', {
    data: {
      ...params,
    },
  });
}
