import apiRequest from "./apiRequest";
import DocMasonApi from "./DocMasonApi";
import TemplateDataDto, { FullTemplateDataDto } from "./interfaces/TemplateDataDto";

export interface CreateTemplateDataRequestOptionsInterface {
  TemplateData_Name: string | null;
  TemplateData_Data: string | null;
  TemplateData_Interface: string | null;
  Template_guid: string;
}

export interface GetTemplateDataRequestOptionsInterface {
  Template_guid: string;
}

export interface ListTemplateDataRequestOptionsInterface {
  Template_guid: string;
  from?: number;
  to?: number;
}

export interface EditTemplateDataRequestOptionsInterface {
  TemplateData_guid: string;
  TemplateData_Name?: string | null;
  TemplateData_Data?: string | null;
  TemplateData_Interface?: string | null;
}

export interface DeleteTemplateDataOptionsInterface {
  TemplateData_guid: string;
}

export default class TemplateDataApi {
  constructor(private dmapi: DocMasonApi) {}

  createTemplateDataRequest = (options: CreateTemplateDataRequestOptionsInterface): Promise<TemplateDataDto> => {
    const prom: Promise<TemplateDataDto> = new Promise((resolve, reject) => {
      apiRequest(`${this.dmapi.baseUrl}/template-data`, { 
        method: 'POST',
        body: JSON.stringify(options),
        headers: {
          'Content-Type': 'application/json'
        } 
      }, 
      this.dmapi.apiKey).then(res => {
        if (res.ok) {
          res.json().then(json => resolve(json as TemplateDataDto));
        } else {
          reject(res);
        }
      });
    });
    return prom;
  }
  
  public getTemplateDataRequest = (options: GetTemplateDataRequestOptionsInterface): Promise<FullTemplateDataDto> => {
    const prom: Promise<FullTemplateDataDto> = new Promise((resolve, reject) => {
      apiRequest(`${this.dmapi.baseUrl}/template-data?Template_guid=${options.Template_guid}`, { 
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        } 
      }, 
      this.dmapi.apiKey).then(res => {
        if (res.ok) {
          res.json().then(json => resolve(json as FullTemplateDataDto));
        } else {
          reject(res);
        }
      });
    });
    return prom;
  }

  public listTemplateDataRequest = (options: ListTemplateDataRequestOptionsInterface): Promise<FullTemplateDataDto[]> => {
    const prom: Promise<FullTemplateDataDto[]> = new Promise((resolve, reject) => {
      let queryParams = [];
      if (options.Template_guid) {
        queryParams.push(`Template_guid=${options.Template_guid}`);
      }
      if (options.from !== undefined) {
        queryParams.push(`from=${options.from}`);
      }
      if (options.to !== undefined) {
        queryParams.push(`to=${options.to}`);
      }
      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

      apiRequest(`${this.dmapi.baseUrl}/template-data/list${queryString}`, { 
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        } 
      }, 
      this.dmapi.apiKey).then(res => {
        if (res.ok) {
          res.json().then(json => resolve(json as FullTemplateDataDto[]));
        } else {
          reject(res);
        }
      });
    });
    return prom;
  }

  public editTemplateDataRequest = (options: EditTemplateDataRequestOptionsInterface): Promise<TemplateDataDto> => {
    const prom: Promise<TemplateDataDto> = new Promise((resolve, reject) => {
      apiRequest(`${this.dmapi.baseUrl}/template-data?TemplateData_guid=${options.TemplateData_guid}`, { 
        method: 'PATCH',
        body: JSON.stringify(options),
        headers: {
          'Content-Type': 'application/json'
        } 
      }, 
      this.dmapi.apiKey).then(res => {
        if (res.ok) {
          res.json().then(json => resolve(json as TemplateDataDto));
        } else {
          reject(res);
        }
      });
    });
    return prom;
  }

  public deleteTemplateDataRequest = (options: DeleteTemplateDataOptionsInterface): Promise<{TemplateData_guid: string;}> => {
    const prom: Promise<{TemplateData_guid: string;}> = new Promise((resolve, reject) => {
      apiRequest(`${this.dmapi.baseUrl}/template-data?TemplateData_guid=${options.TemplateData_guid}`, { 
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        } 
      }, 
      this.dmapi.apiKey).then(res => {
        if (res.ok) {
          res.json().then(json => resolve(json as {TemplateData_guid: string;}));
        } else {
          reject(res);
        }
      });
    });
    return prom;
  }
}