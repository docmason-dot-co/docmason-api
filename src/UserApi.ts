import DocMasonApi from "./DocMasonApi";
import apiRequest from "./apiRequest";
import UserDto, { FullUserDto } from "./interfaces/UserDto";

export default class UserApi {

  constructor(private dmapi: DocMasonApi) {}

  public profileRequest = (): Promise<FullUserDto> => {
    const prom: Promise<FullUserDto> = new Promise((resolve, reject) => {
      apiRequest(`${this.dmapi.baseUrl}/user/profile`, { method: 'GET' }, this.dmapi.apiKey).then(res => {
        if (res.ok) {
          res.json().then(json => resolve(json as FullUserDto));
        } else {
          reject(res);
        }
      });
    });
    return prom;
  }

  public patchUser = (options: {User_Name: string}): Promise<FullUserDto> => {
    const prom: Promise<FullUserDto> = new Promise((resolve, reject) => {
      apiRequest(`${this.dmapi.baseUrl}/user`, { method: 'PATCH', body: JSON.stringify(options), headers: {'Content-Type': 'application/json'} }, this.dmapi.apiKey).then(res => {
        if (res.ok) {
          res.json().then(json => resolve(json as FullUserDto));
        } else {
          reject(res);
        }
      });
    });
    return prom;
  }

}