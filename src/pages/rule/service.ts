import request from '@/utils/request';
import type { RulePackage, RulePackageList, Rule } from './data';
import type { ApiResponsePage, QueryPageConditionRequest } from 'ant-design-exframework';

export async function get(params: GetParams) {
  return request.get(`/rule/get/${params.appCode}/${params.key}`, {
    
  });
}

export async function query(params?: QueryPageConditionRequest) {
  return request.post<ApiResponsePage<RulePackageList>>('/rule/query', {
    data: {
      ...params,
    },
  });
}

export async function queryRules(params?: QueryPageConditionRequest) {
  return request.post<ApiResponsePage<Rule>>('/rule/queryRules', {
    data: {
      ...params,
    },
  });
}

