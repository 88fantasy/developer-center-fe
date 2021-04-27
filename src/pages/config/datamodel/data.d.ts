export interface DataModelItem {
  key: number;
  modelCode : string;
  appCode : string;
  disabled?: boolean;
  name: string;
  desc: string;
  dependencies : string[];
  updatedAt: Date;
  createdAt: Date;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface DataModelListData {
  list: DataModelItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  sorter?: string;
  status?: string;
  name?: string;
  modelCode?: string;
  appCode?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
}
