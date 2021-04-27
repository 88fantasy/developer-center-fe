import request from '@/utils/request';
import type { ApiResponseData } from 'ant-design-exframework';

export async function query(): Promise<any> {
  return request('/user/users');
}

export async function queryCurrent() {
  return request.get<ApiResponseData<any>>('/user/currentUser');
}

export async function queryNotices(): Promise<any> {
  return request('/user/notices');
}
