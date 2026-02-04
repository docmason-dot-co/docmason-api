export interface UserDto {
  User_guid: string;
  User_Active: boolean;
  User_Name: string;
  User_Type: 'free'|'pro'|'business'|'enterprise';
}

// Typeguard for UserDto
export const isUserDto = (obj: any): obj is UserDto => {
  return typeof obj === 'object' &&
    typeof obj.User_guid === 'string' &&
    typeof obj.User_Active === 'boolean' &&
    typeof obj.User_Name === 'string' &&
    (obj.User_Type === 'free' || obj.User_Type === 'pro' || obj.User_Type === 'business' || obj.User_Type === 'enterprise');
}

export interface FullUserDto {
  User_guid: string;
  User_Email: string;
  User_FirstName: string;
  User_LastName: string;
  User_TermsOfService: string;
  User_Active: boolean;
}

export interface CreateUserDto {
  User_Username: string;
  User_Password: string;
  User_FirstName: string;
  User_LastName: string;
  User_Email: string;
  User_EmailVerified: Date | null;
  User_TermsOfService: Date;
  User_Active: boolean;
}

export interface PatchUserDto extends UserDto {
  User_FirstName: string;
  User_LastName: string;
  User_Email: string;
  User_Active: boolean;
}