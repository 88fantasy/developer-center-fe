import request from '@/utils/request';
import type { ApiResponseData } from 'ant-design-exframework';
import type { RuleInstance } from '../data';

export async function list(packageInstanceId: string) {
  return request.get<ApiResponseData<RuleInstance[]>>(`/rule/listRuleInstances/${packageInstanceId}`, {
  });
}
