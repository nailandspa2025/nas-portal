export interface LoginPayload {
  email: string;
  password: string;
}

export interface UserInfo {
  id: string;
  email: string;
  userName: string;
  fullName: string;
}
export interface LoginResponse {
  token: string;
  user: UserInfo;
}
