export interface Param {
  id: string;
  key: string;
  name: string;
  value: string;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface DictionaryData {
  list: Param[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  sorter?: string;
  name?: string;
  appCode?: string;
  key?: number;
  pageSize?: number;
  current?: number;
}
