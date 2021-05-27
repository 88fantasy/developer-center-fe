import { WechatResponse } from "../data"

export type DateRange = {
  begin_date: string;
  end_date: string;
}

export type VisitPage = {
  pagePath: string;
  pageVisitPv: number;
  pageVisitUv: number;
  pageStaytimePv: number;
  entrypagePv: number;
  exitpagePv: number;
  pageSharePv: number;
  pageShareUv: number;
} 

export type VisitPageResponse = WechatResponse & {
  refDate: string;
  list: VisitPage[];
}

export type DailySummary = {
  /**
   * 日期
   */
  refDate: string;
  /**
   * 累计用户数
   */
  visitTotal: number;
  /**
   * 转发次数
   */
  sharePv: number;
  /**
   * 转发人数
   */
  shareUv: number;
}

export type DailySummaryResponse = WechatResponse & {
  list: DailySummary[];
}

export type UserPortraitItem = {
  id: number;
  name: string;
  value: number;
}

export type UserPortrait = {
  province: UserPortraitItem[];
  city: UserPortraitItem[];
  genders: UserPortraitItem[];
  platforms: UserPortraitItem[];
  devices: UserPortraitItem[];
  ages: UserPortraitItem[];
}

export type UserPortraitResponse = WechatResponse & {
  refDate: string;
  visitUvNew: UserPortrait;
  visitUv: UserPortrait;
}