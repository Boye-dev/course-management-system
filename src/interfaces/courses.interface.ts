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
  school: ISchoolDetails;
  _id: string;
}

export interface ISchoolDetails {
  name: string;
  _id: string;
}

export interface IEnrolledCourseDetails {
  course: ICourseDetails;
  grade: string;
  score: number;
  _id: string;
}
