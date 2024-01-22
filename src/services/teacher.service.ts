import Api from '@/api/Api';
import { IUser } from '@/interfaces/auth.interface';
import { ApiResponse, ITableParams } from '@/interfaces/helperInterface';
import { handleErrors } from '@/utils/handleErrors';
import { queryParamsHelper } from '@/utils/query-params';

export interface ITeacherParams extends ITableParams {
  department?: string[];

  searchBy?: string[];

  status?: string[];

  gender?: string[];

  sortBy?: string;
}
export interface ApiTeachersResponse extends ApiResponse {
  data: IUser[];
}
export const getTeachers = async (queryParams: ITeacherParams) => {
  try {
    const res = await Api.get<ApiTeachersResponse>(
      `/api/user/teachers${queryParamsHelper(queryParams)}`
    );
    if (res) {
      return res.data;
    }
  } catch (error) {
    return handleErrors(error);
  }
  return undefined;
};

export const addTeacher = (formData: FormData) => Api.post<IUser>('/api/user', formData);
