import request from '@/utils/request';
import type { RequestOptionsType, } from '@ant-design/pro-utils/lib/typing';
import type { ApiResponseData } from 'ant-design-exframework';

type OptionParam<U> = U & {
  key: string;
};

export async function options<U = any>(param: OptionParam<U>): Promise<RequestOptionsType[]> {
  return request.get<RequestOptionsType[]>(`/ddl/options/${param.key}`);
}

export async function manyDictionary(keys: string[]): Promise<ApiResponseData<Record<string,RequestOptionsType[]>>> {
  return request.post<ApiResponseData<Record<string,RequestOptionsType[]>>>('/ddl/many', {
    data: keys,
  });
}
