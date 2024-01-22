import { Roles } from '@/constants/roles';
import { IDepartmentDetails } from './courses.interface';

export interface LoginInterface {
  username: string;
  password: string;
}
export interface IOtpInterface {
  otp: number;
}
export enum GenderEnum {
  Male = 'Male',
  Female = 'Female',
}
export enum RelationshipStatusEnum {
  Single = 'Single',
  Married = 'Married',
  Divorced = 'Divorced',
}

export enum StatusEnum {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
}

export enum RegistrationStatusEnum {
  Can_Update = 'CAN_UPDATE',
  Not_Registered = 'NOT_REGISTERED',
  Blocked = 'BLOCKED',
  Registered = 'REGISTERED',
}
export interface IUser {
  firstName: string;

  middleName: string;

  phoneNumber: string;

  lastName: string;

  address: string;

  gender: keyof typeof GenderEnum;

  profilePicture: string;

  dateOfBirth: Date;

  relationshipStatus: keyof typeof RelationshipStatusEnum;

  verified: boolean;

  email: string;

  role: keyof typeof Roles;

  nationality: string;

  state: string;

  lga: string;

  department?: IDepartmentDetails;

  school?: string;

  registrationStatus?: Record<string, string[]>;

  yearOfAdmission?: number;

  _id: string;

  status: string;
}
