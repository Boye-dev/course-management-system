import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { LoadingOverlay } from '@mantine/core';
import Layout from './shared/layout/Layout';
import PersonalInformation from './modules/Admin/PersonalInformation/PersonalInformation';
import StudentPersonalInformation from './modules/Student/PersonalInformation/PersonalInformation';
import StudentCourses from './modules/Student/Courses/Courses';
import Courses from './modules/Admin/Courses/Courses';
import Teachers from './modules/Admin/Teachers/Teachers';
import Students from './modules/Admin/Students/Students';
import Departments from './modules/Admin/Departments/Departments';
import Schools from './modules/Admin/Schools/Schools';
import MyCourses from './modules/Student/Courses/MyCourses';
import SelectCourse from './modules/Student/Courses/SelectCourse';

const loadingOverlay = () => LoadingOverlay;
const router = createBrowserRouter([
  {
    path: '/admin',
    Component: Layout,
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
    Component: Layout,
    children: [
      {
        path: '',
        element: <Navigate to="/student/personal-info" />,
      },
      {
        path: 'personal-info',
        Component: StudentPersonalInformation,
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
]);

export function Router() {
  return <RouterProvider router={router} />;
}
