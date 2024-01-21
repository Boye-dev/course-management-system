import Api from '@/api/Api';
import { ISchoolDetails } from '@/interfaces/courses.interface';
import { ApiResponse, ITableParams } from '@/interfaces/helperInterface';
import { handleErrors } from '@/utils/handleErrors';
import { queryParamsHelper } from '@/utils/query-params';

export interface ApiSchoolResponse extends ApiResponse {
  data: ISchoolDetails[];
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
export const getSchools = async (queryParams?: ISchoolParams) => {
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
