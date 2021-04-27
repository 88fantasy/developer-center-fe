import { GlobalParent } from '@/typings';
export interface DictionaryItem {
  itemKey: string;
  itemName: string;
};

export interface Dictionary extends GlobalParent {
  key: string;
  name: string;
  value: Object;
};

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
};

export interface DictionaryData {
  list: Dictionary[];
  pagination: Partial<TableListPagination>;
};

export interface TableListParams extends GlobalParent {
  sorter?: string;
  name?: string;
  key?: number;
  pageSize?: number;
  current?: number;
};
