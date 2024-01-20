import Api from '@/api/Api';
import { ISchoolDetails } from '@/interfaces/courses.interface';
import { handleErrors } from '@/utils/handleErrors';
import { IQueryParams, queryParamsHelper } from '@/utils/query-params';

export interface ApiSchoolResponse {
  total: number;
  page: number;
  pageSize: number;
  data: ISchoolDetails[];
}

export interface ITableParams extends IQueryParams {
  page: number;
  pageSize: string;
  search?: string;
}

export interface ISchoolParams extends ITableParams {
  searchBy?: string[];
}

interface IAddSchoolPayload {
  name: string;
  code: string;
}

interface IPatchSchoolPayload {
  formData: IAddSchoolPayload;
  id: string;
}
export const getSchools = async (queryParams: ISchoolParams) => {
  try {
    const res = await Api.get<ApiSchoolResponse>(`/api/school/${queryParamsHelper(queryParams)}`);
    if (res) {
      return res.data;
    }
  } catch (error) {
    return handleErrors(error);
  }
  return undefined;
};

export const addSchoolMutation = (payload: IAddSchoolPayload) => Api.post('/api/school/', payload);

export const editSchoolMutation = (payload: IPatchSchoolPayload) =>
  Api.patch(`/api/school/${payload.id}`, payload.formData);
