import { Navigate } from 'react-router-dom';
import useRoleAuthentication from '@/hooks/useRoleAuthentication';
import Layout from '@/shared/layout/Layout';
import BabcockLoader from '../BabcockLoader';
import { Roles } from '@/constants/roles';

const AdminProtectedRoutes = () => {
  const { loading, authenticated } = useRoleAuthentication(Roles.ADMIN);

  return loading ? <BabcockLoader /> : authenticated ? <Layout /> : <Navigate to="/login" />;
};

export default AdminProtectedRoutes;
