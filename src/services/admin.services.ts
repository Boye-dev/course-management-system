import Api from '@/api/Api';
import { IUser } from '@/interfaces/auth.interface';

interface IPatchUserPayload {
  id: string;
  formData: FormData;
}

interface IPatchUserPasswordPayload {
  id: string;
  formData: { oldPassword: string; newPassword: string };
}
export const getPersonalInfo = (id: string) => Api.get<IUser>(`/api/user/${id}`);

export const updatePersonalInfo = (payload: IPatchUserPayload) =>
  Api.patch<IUser>(`/api/user/${payload.id}`, payload.formData);

export const updatePassword = (payload: IPatchUserPasswordPayload) =>
  Api.patch<IUser>(`/api/user/update-password/${payload.id}`, payload.formData);
