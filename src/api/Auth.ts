import { JwtPayload, jwtDecode } from 'jwt-decode';
import { Roles } from '@/constants/roles';

export interface IUserDecoded extends JwtPayload {
  email: string;
  exp: number;
  firstName: string;
  lastName: string;
  iat: number;
  jti: string;
  phone: string;
  role: string;
  id: string;
}

function setToken(token: string) {
  localStorage.setItem('accessToken', token);
}

function setRefreshToken(token: string) {
  localStorage.setItem('refreshToken', token);
}

function getToken() {
  return localStorage.getItem('accessToken');
}

function getRefreshToken() {
  return localStorage.getItem('refreshToken');
}
export function getDecodedJwt(tkn = ''): IUserDecoded {
  try {
    const token = getToken();
    const t = token || tkn;
    return jwtDecode(t);
  } catch (error) {
    return {} as IUserDecoded;
  }
}
export function getDecodedRefreshJwt(tkn = ''): IUserDecoded {
  try {
    const token = getRefreshToken();
    const t = token || tkn;
    return jwtDecode(t);
  } catch (error) {
    return {} as IUserDecoded;
  }
}
function isAuthenticated() {
  try {
    const decodedToken = getDecodedJwt();

    if (decodedToken && decodedToken.id) {
      const { exp } = decodedToken;

      if (exp) {
        return exp * 1000 > Date.now();
      }

      return true;
    }

    return false;
  } catch (e) {
    return false;
  }
}
function isAuthenticatedAdmin() {
  try {
    const decodedToken = getDecodedJwt();

    if (decodedToken && decodedToken.id && decodedToken.role === Roles.ADMIN) {
      const { exp } = decodedToken;

      if (exp) {
        return exp * 1000 > Date.now();
      }

      return true;
    }

    return false;
  } catch (e) {
    return false;
  }
}

function removeToken() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

const Auth = {
  getDecodedJwt,
  getRefreshToken,
  getToken,
  isAuthenticated,
  setRefreshToken,
  setToken,
  removeToken,
  isAuthenticatedAdmin,
  getDecodedRefreshJwt,
};

export default Auth;
