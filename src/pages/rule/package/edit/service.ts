import request from '@/utils/request';
import type { ApiResponseData } from 'ant-design-exframework';
import type { RulePackage, } from '../../data.d';

export async function get(code: string) {
  return request.get<ApiResponseData<RulePackage>>(`/rule/get/${code}`, {
    
  });
}

export async function saveRulePackage(params: RulePackage) {
  return request.post<ApiResponseData<boolean>>('/rule/saveRulePackage', {
    data: {
      ...params,
    },
  });
}
