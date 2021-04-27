import request from '@/utils/request';
import type { ApiResponseData } from 'ant-design-exframework';

export interface LoginParamsType {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
}

export type LoginResponse = {
  status: 'ok' | 'error';
  token?: string;
  authority?: string[];
};

export async function accountLogin(params: LoginParamsType) {
  return request.post<ApiResponseData<LoginResponse>>('/login/account', {
    data: params,
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/login/captcha?mobile=${mobile}`);
}
