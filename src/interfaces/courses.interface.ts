export interface ICourseDetails {
  name: string;
  department: IDepartmentDetails;
  school: ISchoolDetails;
  course_code: string;
  level: number;
  _id: string;
}

export interface IDepartmentDetails {
  name: string;
  school: ISchoolDetails;
  _id: string;
}

export interface ISchoolDetails {
  name: string;
  _id: string;
}
