import Api from '@/api/Api';
import { IOtpInterface, IUser, LoginInterface } from '@/interfaces/auth.interface';
import { handleErrors } from '@/utils/handleErrors';

export const login = (values: LoginInterface) => Api.post('/api/auth/login', values);
export const resendOtp = (values: IUser) => Api.post('/api/auth/resend-otp', values);

export const verifyOtp = (values: IOtpInterface & { id: string }) =>
  Api.post(`/api/auth/otp/verify/${values.id}`, values);

export const forgotPassword = ({ email }: { email: string }) =>
  Api.post('/api/user/forgot-password', { email });
export const resetPassword = ({
  password,
  token,
  id,
}: {
  password: string;
  token: string;
  id: string;
}) => Api.patch(`/api/user/reset-password/${token}/${id}`, { password });
export const verifyUser = async ({ token, id }: { token: string; id: string }) => {
  try {
    const res = await Api.get(`/api/user/verify/token/${token}/${id}`);
    if (res) {
      return res.data;
    }
  } catch (error) {
    return handleErrors(error);
  }
  return undefined;
};
