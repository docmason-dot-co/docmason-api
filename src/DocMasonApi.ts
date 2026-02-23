import EmailTemplateApi from "./EmailTemplateApi";
import SavedDocumentApi from "./SavedDocumentApi";
import TemplateApi from "./TemplateApi";
import TemplateDataApi from "./TemplateDataApi";
import UserApi from "./UserApi";

export interface DocMasonApiConfig {
  apiKey: string;
  baseUrl?: string;
}

export default class DocMasonApi {

  readonly apiKey: string = '';
  readonly baseUrl: string = 'https://docmason.co/api/v1';

  public constructor(apiKeyOrConfig: string | DocMasonApiConfig, baseUrl?: string) {
    if (typeof apiKeyOrConfig === 'string') {
      // Legacy constructor: new DocMasonApi(apiKey, baseUrl)
      this.apiKey = apiKeyOrConfig;
      if (baseUrl) {
        this.baseUrl = baseUrl;
      }
    } else {
      // New constructor: new DocMasonApi({ apiKey, baseUrl })
      this.apiKey = apiKeyOrConfig.apiKey;
      if (apiKeyOrConfig.baseUrl) {
        this.baseUrl = apiKeyOrConfig.baseUrl;
      }
    }
  }

  public userApi = new UserApi(this);
  public templateApi = new TemplateApi(this);
  public templateDataApi = new TemplateDataApi(this);
  public emailTemplateApi = new EmailTemplateApi(this);
  public savedDocumentApi = new SavedDocumentApi(this);

}