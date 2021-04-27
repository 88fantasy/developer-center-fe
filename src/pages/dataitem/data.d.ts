import { GlobalParent } from '@/typings';

export enum DataItemDisplayTypeEnum {
  EDIT // 普通
  = "EDIT",
  READONLY // 只读
  = "READONLY",
  DICTIONARY // 字典
  = "DICTIONARY",
  CHECKBOX // 复选
  = "CHECKBOX",
}

export enum DataItemValidTypeEnum {
  LONG // 整数
  = "LONG",
  STRING // 字符串
  = "STRING",
  BIGDECIMAL // 小数
  = "BIGDECIMAL",
  BOOLEAN // 布尔类型
  = "BOOLEAN",
}

export interface DataItem extends GlobalParent {
  code: string;
  name: string;
  comment: string;
  displayType: DataItemDisplayTypeEnum;
  validType: DataItemValidTypeEnum;
  maxlength: number;
  precision?: number;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface DataItemData {
  list: DataItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams extends GlobalParent {
  sorter?: string;
  name?: string;
  key?: number;
  pageSize?: number;
  current?: number;
}

export interface GetDataItemParams extends GlobalParent {
  withGlobal?: boolean;
}