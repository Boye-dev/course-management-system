/* eslint-disable import/no-cycle */
import { IStudentDetails } from './student.interface';
import { ITeacherDetails } from './teachers.interface';

export interface ICourseDetails {
  name: string;
  department: IDepartmentDetails;
  school: ISchoolDetails;
  course_code: string;
  level: number;
  _id: string;
  credit: number;
}

export interface IDepartmentDetails {
  name: string;
  school?: ISchoolDetails;
  _id: string;
}

export interface ISchoolDetails {
  name: string;
  _id: string;
  code: string;
}

export interface IEnrolledCourseDetails {
  course: ICourseDetails;
  student: IStudentDetails;
  teacher: ITeacherDetails;
  grade: string;
  score: number;
  _id: string;
}
