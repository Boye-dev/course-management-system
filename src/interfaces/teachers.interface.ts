/* eslint-disable import/no-cycle */
import { IDepartmentDetails } from './courses.interface';

export interface ITeacherDetails {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  maritalStatus: string;
  nationality: string;
  state: string;
  lga: string;
  _id: string;
  department: IDepartmentDetails;
  status: string;
}
