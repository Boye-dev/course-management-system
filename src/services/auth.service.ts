import Api from '@/api/Api';
import { IOtpInterface, LoginInterface } from '@/interfaces/auth.interface';

export const login = (values: LoginInterface) => Api.post('/api/auth/login', values);

export const verifyOtp = (values: IOtpInterface & { id: string }) =>
  Api.post(`/api/auth/otp/verify/${values.id}`, values);
