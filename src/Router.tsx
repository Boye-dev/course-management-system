import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import Layout from './shared/layout/Layout';
import PersonalInformation from './pages/PersonalInformation/PersonalInformation';
import Courses from './modules/Admin/Courses/Courses';
import Teachers from './modules/Admin/Teachers/Teachers';
import Students from './modules/Admin/Students/Students';
import Departments from './modules/Admin/Departments/Departments';
import Schools from './modules/Admin/Schools/Schools';

const router = createBrowserRouter([
  {
    path: '/admin',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <Navigate to="personal-info" />,
      },
      {
        path: 'personal-info',
        element: <PersonalInformation />,
      },
      {
        path: 'courses',
        element: <Courses />,
      },
      {
        path: 'teachers',
        element: <Teachers />,
      },
      {
        path: 'students',
        element: <Students />,
      },
      {
        path: 'departments',
        element: <Departments />,
      },
      {
        path: 'schools',
        element: <Schools />,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
