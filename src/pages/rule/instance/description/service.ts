import request from '@/utils/request';
import type { ApiResponseData } from 'ant-design-exframework';
import type { RulePackageInstance, } from '../data';

export async function get(id: string) {
  return request.get<ApiResponseData<RulePackageInstance>>(`/rule/getPackageInstance/${id}`,{
    
  });
}
