type UserType = 'free'|'pro'|'business'|'enterprise';

export default interface UserDto {
  User_guid: string;
  User_Name: string;
  User_Type: UserType;
  User_Active: boolean;
}

export interface FullUserDto {
  User_guid: string;
  User_Name: string;
  User_Type: UserType;
  User_Email: string;
  User_TermsOfService: string;
  User_Active: boolean;
}