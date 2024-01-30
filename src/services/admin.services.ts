import Api from '@/api/Api';
import { IUser } from '@/interfaces/auth.interface';
import { handleErrors } from '@/utils/handleErrors';

interface IPatchUserPayload {
  id: string;
  formData: FormData;
}

interface IPatchUserPasswordPayload {
  id: string;
  formData: { oldPassword: string; newPassword: string };
}

interface ISettings {
  registrationAllowed: Record<string, Record<string, string>>;
}
export const getPersonalInfo = async (id: string) => {
  try {
    const res = await Api.get<IUser>(`/api/user/${id}`);
    if (res) {
      return res.data;
    }
  } catch (error) {
    return handleErrors(error);
  }
  return undefined;
};

export const getSettings = async () => {
  try {
    const res = await Api.get<ISettings>('/api/settings/65a2d4069a03ce9ea7069c1d');
    if (res) {
      return res.data;
    }
  } catch (error) {
    return handleErrors(error);
  }
  return undefined;
};
export const updatePersonalInfo = (payload: IPatchUserPayload) =>
  Api.patch<IUser>(`/api/user/${payload.id}`, payload.formData);

export const updatePassword = (payload: IPatchUserPasswordPayload) =>
  Api.patch<IUser>(`/api/user/update-password/${payload.id}`, payload.formData);
