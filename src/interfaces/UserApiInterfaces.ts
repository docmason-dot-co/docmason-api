export interface UserApiDto {
  UserApi_guid: string;
  UserApi_Key: string;
  UserApi_Valid: boolean;
  UserApi_CreatedAt: string;
  UserApi_UpdatedAt: string;
  User_id: number;
}

export interface CreateUserApiDto {
  User_guid: string;
}

export interface UpdateUserApiDto {
  UserApi_Valid?: boolean;
  UserApi_Key?: string;
}

export interface ApiKeyLimits {
  current: number;
  limit: number;
  userType: 'free' | 'pro' | 'business' | 'enterprise';
}

export interface CreateUserApiResponse {
  message: string;
  userApi: UserApiDto;
  limits: ApiKeyLimits;
}

export interface ListUserApiResponse {
  userApis: UserApiDto[];
  limits: ApiKeyLimits;
}

export interface GetUserApiResponse {
  userApi: UserApiDto;
}

export interface UpdateUserApiResponse {
  message: string;
  userApi: UserApiDto;
}

export interface DeleteUserApiResponse {
  message: string;
  userApi: UserApiDto;
}

export interface VerifyUserApiResponse {
  valid: boolean;
  userApi?: {
    UserApi_guid: string;
    UserApi_Valid: boolean;
    UserApi_CreatedAt: string;
  };
  user?: {
    User_guid: string;
    User_Name: string;
    User_Type: string;
    User_Active: boolean;
  };
}

export interface UserApiError {
  msg: string;
  param?: string;
  location?: string;
}

export interface ErrorResponse {
  errors: UserApiError[];
  limits?: ApiKeyLimits;
}