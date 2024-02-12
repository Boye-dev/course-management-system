import { IQueryParams } from '@/utils/query-params';

export interface IDrawerProps {
  opened: boolean;
  close: () => void;
}

export interface ITableParams extends IQueryParams {
  page: number;
  pageSize: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse {
  total: number;
  page: number;
  pageSize: number;
}

export interface IFilter {
  label: string;
  values: any;
  key: string;
}
