// eslint-disable-next-line import/no-cycle
import { IUser } from './auth.interface';

export interface ICourseDetails {
  name: string;
  _id: string;
  code: string;
  yearTaken: number;
  units: number;
  department: IDepartmentDetails;
}

export interface IDepartmentDetails {
  name: string;
  school: ISchoolDetails;
  _id: string;
  code: string;
  yearsTaken: number;
}

export interface ISchoolDetails {
  name: string;
  _id: string;
  code: string;
}

export interface IEnrolledCourseDetails {
  course: ICourseDetails;
  teacher: IUser;
}
