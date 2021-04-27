import request from '@/utils/request';
import type { ApiResponseData, } from 'ant-design-exframework';
import type { NoticeType } from './data';

export async function queryProjectNotice() {
  return request.get<ApiResponseData<NoticeType[]>>('/project/notice');
}

export async function queryActivities() {
  return request.get('/activities');
}

