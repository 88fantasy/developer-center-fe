import request from '@/utils/request';
import type { ApiResponsePage, QueryPageConditionRequest } from 'ant-design-exframework';
import type { RuleInstance } from '../data';

export async function query(params?: QueryPageConditionRequest) {
  return request.post<ApiResponsePage<RuleInstance>>('/rule/queryRuleInstances', {
    data: {
      ...params,
    },
  });
}
