import Api from '@/api/Api';
import { IDepartmentDetails } from '@/interfaces/courses.interface';
import { ApiResponse, ITableParams } from '@/interfaces/helperInterface';
import { handleErrors } from '@/utils/handleErrors';
import { queryParamsHelper } from '@/utils/query-params';

export interface IDepartmentParams extends ITableParams {
  searchBy?: string[];
  school?: string[];
  yearsTaken?: string[];
}
export interface ApiDepartmentsResponse extends ApiResponse {
  data: IDepartmentDetails[];
}
interface IAddDepartmentPayload {
  name: string;
  code: string;
  school: string;
  yearsTaken: number;
}

interface IPatchDepartmentPayload {
  formData: Omit<IAddDepartmentPayload, 'school' | 'yearsTaken'>;
  id: string;
}
export const getDepartments = async (queryParams: IDepartmentParams) => {
  try {
    const res = await Api.get<ApiDepartmentsResponse>(
      `/api/department/${queryParamsHelper(queryParams)}`
    );
    if (res) {
      return res.data;
    }
  } catch (error) {
    return handleErrors(error);
  }
  return undefined;
};

export const editDepartmentMutation = (payload: IPatchDepartmentPayload) =>
  Api.patch(`/api/department/${payload.id}`, payload.formData);

export const addDepartmentMutation = (payload: IAddDepartmentPayload) =>
  Api.post('/api/department/', payload);
