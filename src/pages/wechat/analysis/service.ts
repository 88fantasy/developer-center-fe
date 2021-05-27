import request from '@/utils/request';
import type { ApiResponseData, } from 'ant-design-exframework';
import type { DailySummaryResponse, DateRange, UserPortraitResponse, VisitPageResponse } from './data';

export async function listVisitPage(appId: string, date: string ) {
  return request.post<ApiResponseData<VisitPageResponse>>('https://develop.gzmpc.com/api/wechat/v1/mp/getVisitPage', {
    data: {
      appId,
      date,
    },
  });
}

export async function listDailySummary(appId: string, range: DateRange ) {
  return request.post<ApiResponseData<DailySummaryResponse>>('https://develop.gzmpc.com/api/wechat/v1/mp/getDailySummary', {
    data: {
      appId,
      request: range,
    },
  });
}

export async function listUserPortrait(appId: string, date: string, range: number ) {
  return request.post<ApiResponseData<UserPortraitResponse>>('https://develop.gzmpc.com/api/wechat/v1/mp/getUserPortrait', {
    data: {
      appId,
      date,
      range,
    },
  });
}


