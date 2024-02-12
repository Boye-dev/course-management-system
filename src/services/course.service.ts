import Api from '@/api/Api';
import { ICourseDetails, IEnrolledCourseDetails, IMyCourse } from '@/interfaces/courses.interface';
import { ApiResponse, ITableParams } from '@/interfaces/helperInterface';
import { handleErrors } from '@/utils/handleErrors';
import { queryParamsHelper } from '@/utils/query-params';

export interface ICourseParams extends ITableParams {
  searchBy?: string[];
  department?: string[];
  yearTaken?: string[] | string;
  year?: string;
}

export interface IEnrolledCouresPayload {
  teacher: string;
  queryParams?: ICourseParams;
}
export interface ApiCoursesResponse extends ApiResponse {
  data: ICourseDetails[];
}
export interface ApiEnrolledCoursesResponse extends ApiResponse {
  data: IEnrolledCourseDetails[];
}
export interface ApiMyCoursesResponse extends ApiResponse {
  data: IMyCourse[];
}
interface IAddCoursePayload {
  name: string;
  code: string;
  department: string;
  yearTaken: number;
}

interface IEnrollCoursePayload {
  courses: string[];
  id: string;
}
interface IEnrollStudentCoursePayload {
  courses: string[];
  id: string;
  year: string;
}

interface IPatchCoursePayload {
  formData: Omit<IAddCoursePayload, 'department' | 'yearTaken'>;

  id: string;
}
interface IUpdateScorePayload {
  formData: { score: number };
  id: string;
}
export const getCourses = async (queryParams?: ICourseParams) => {
  try {
    const res = await Api.get<ApiCoursesResponse>(`/api/course/${queryParamsHelper(queryParams)}`);
    if (res) {
      return res.data;
    }
  } catch (error) {
    return handleErrors(error);
  }
  return undefined;
};

export const editCourseMutation = (payload: IPatchCoursePayload) =>
  Api.patch(`/api/course/${payload.id}`, payload.formData);

export const updateScoreMutation = (payload: IUpdateScorePayload) =>
  Api.patch(`/api/course/update-score/${payload.id}`, payload.formData);

export const addCourseMutation = (payload: IAddCoursePayload) => Api.post('/api/course/', payload);
export const enrollCourseMutation = (payload: IEnrollCoursePayload) =>
  Api.post(`/api/course/enroll/${payload.id}`, payload);
export const enrollStudentCourseMutation = (payload: IEnrollStudentCoursePayload) =>
  Api.post(`/api/course/enroll/student/${payload.id}`, payload);

export const getEnrolledCourses = async (payload: IEnrolledCouresPayload) => {
  try {
    const res = await Api.get<ApiEnrolledCoursesResponse>(
      `/api/course/enrolled/${payload.teacher}${queryParamsHelper(payload.queryParams)}`
    );

    if (res) {
      return res.data;
    }
  } catch (error) {
    return handleErrors(error);
  }
  return undefined;
};

export const getEnrolledCoursesSelect = async (queryParams: ICourseParams) => {
  try {
    const res = await Api.get<ApiEnrolledCoursesResponse>(
      `/api/course/enrolled-teacher${queryParamsHelper(queryParams)}`
    );

    if (res) {
      return res.data;
    }
  } catch (error) {
    return handleErrors(error);
  }
  return undefined;
};

export const getEnrolledStudentCourses = async (queryParams: ICourseParams, id: string) => {
  try {
    const res = await Api.get<ApiMyCoursesResponse>(
      `/api/course/enrolled-student/${id}${queryParamsHelper(queryParams)}`
    );

    if (res) {
      return res.data;
    }
  } catch (error) {
    return handleErrors(error);
  }
  return undefined;
};

export const getEnrolledMyStudent = async (
  queryParams: ICourseParams,
  courseId: string,
  year: string,
  teacherId: string
) => {
  try {
    const res = await Api.get<ApiMyCoursesResponse>(
      `/api/course/enrolled-student/${courseId}/${year}/${teacherId}${queryParamsHelper(
        queryParams
      )}`
    );

    if (res) {
      return res.data;
    }
  } catch (error) {
    return handleErrors(error);
  }
  return undefined;
};
