import Api from '@/api/Api';
import { IUser } from '@/interfaces/auth.interface';
import { ApiResponse, ITableParams } from '@/interfaces/helperInterface';
import { handleErrors } from '@/utils/handleErrors';
import { queryParamsHelper } from '@/utils/query-params';

export interface IStudentParams extends ITableParams {
  department?: string[];

  searchBy?: string[];

  status?: string[];

  yearOfAdmission?: string[];

  gender?: string[];

  sortBy?: string;
}
export interface ApiStudentsResponse extends ApiResponse {
  data: IUser[];
}
export const getStudents = async (queryParams: IStudentParams) => {
  try {
    const res = await Api.get<ApiStudentsResponse>(
      `/api/user/students${queryParamsHelper(queryParams)}`
    );
    if (res) {
      return res.data;
    }
  } catch (error) {
    return handleErrors(error);
  }
  return undefined;
};

export const addStudent = (formData: FormData) => Api.post<IUser>('/api/user', formData);
