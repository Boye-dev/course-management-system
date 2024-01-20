import { Navigate } from 'react-router-dom';
import useAdminAuthentication from '@/hooks/useAdminAuthentication';
import Layout from '@/shared/layout/Layout';
import BabcockLoader from '../BabcockLoader';

const AdminProtectedRoutes = () => {
  const { loading, authenticated } = useAdminAuthentication();

  return loading ? <BabcockLoader /> : authenticated ? <Layout /> : <Navigate to="/login" />;
};

export default AdminProtectedRoutes;
