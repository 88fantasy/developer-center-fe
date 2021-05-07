import request from '@/utils/request';
import type { ApiResponseData,  FilterCondition,   } from 'ant-design-exframework';
import type { RuleStatisticResponse,  } from './data';

export async function postRuleStatistic(conditions?: FilterCondition[]) {
  return request.post<ApiResponseData<RuleStatisticResponse>>('/rule/postRuleStatistic', {
    data: conditions,
  });
}
