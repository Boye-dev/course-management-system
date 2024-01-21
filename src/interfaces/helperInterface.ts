import { IQueryParams } from '@/utils/query-params';

export interface IDrawerProps {
  opened: boolean;
  close: () => void;
}

export interface ITableParams extends IQueryParams {
  page: number;
  pageSize: string;
  search?: string;
}

export interface ApiResponse {
  total: number;
  page: number;
  pageSize: number;
}
