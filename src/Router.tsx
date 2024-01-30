import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { LoadingOverlay } from '@mantine/core';
import PersonalInformation from './modules/Admin/PersonalInformation/PersonalInformation';
import TeacherPersonalInformation from './modules/Teacher/PersonalInformation/PersonalInformation';
import StudentCourses from './modules/Student/Courses/Courses';
import TeacherCourses from './modules/Teacher/Courses/Courses';
import Courses from './modules/Admin/Courses/Courses';
import Teachers from './modules/Admin/Teachers/Teachers';
import Students from './modules/Admin/Students/Students';
import Departments from './modules/Admin/Departments/Departments';
import Schools from './modules/Admin/Schools/Schools';
import MyCourses from './modules/Student/Courses/MyCourses';
import SelectCourse from './modules/Student/Courses/SelectCourse';
import MyStudents from './modules/Teacher/Courses/MyStudents';
import Login from './pages/Auth/Login.page';
import AdminProtectedRoutes from './shared/components/Auth/AdminProtectedRoutes';
import StudentProtectedRoutes from './shared/components/Auth/StudentProtectedRoutes';
import TeacherProtectedRoutes from './shared/components/Auth/TeacherProtectedRoutes';
import Years from './modules/Teacher/Courses/Years';

const loadingOverlay = () => LoadingOverlay;
const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" /> },
  { path: '/login', Component: Login },
  {
    path: '/admin',
    element: <AdminProtectedRoutes />,
    children: [
      {
        path: '',
        element: <Navigate to="/admin/personal-info" />,
      },
      {
        path: 'personal-info',
        Component: PersonalInformation,
      },
      {
        path: 'courses',
        Component: Courses,
      },
      {
        path: 'teachers',
        Component: Teachers,
      },
      {
        path: 'students',
        Component: Students,
      },
      {
        path: 'departments',
        Component: Departments,
      },
      {
        path: 'schools',
        Component: Schools,
      },
    ],
  },
  {
    path: '/student',
    element: <StudentProtectedRoutes />,
    children: [
      {
        path: '',
        element: <Navigate to="/student/personal-info" />,
      },
      {
        path: 'personal-info',
        Component: TeacherPersonalInformation,
      },
      {
        path: 'courses',
        Component: StudentCourses,
      },
      {
        path: 'courses/:year/my-courses',
        Component: MyCourses,
        loader: loadingOverlay,
      },
      {
        path: 'courses/:year/add-courses',
        Component: SelectCourse,
        loader: loadingOverlay,
      },
    ],
  },
  {
    path: '/teacher',
    element: <TeacherProtectedRoutes />,
    children: [
      {
        path: '',
        element: <Navigate to="/teacher/personal-info" />,
      },
      {
        path: 'personal-info',
        Component: TeacherPersonalInformation,
      },
      {
        path: 'courses',
        Component: TeacherCourses,
      },
      {
        path: 'courses/:id',
        Component: Years,
      },
      {
        path: 'courses/:id/:year/my-students',
        Component: MyStudents,
        loader: loadingOverlay,
      },
    ],
  },
  {
    path: '*',
    element: <p>Not Found</p>,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
