import { DocMasonApiConfig } from './types';
import { TemplateApi } from './modules/TemplateApi';
import { TemplateDataApi } from './modules/TemplateDataApi';
import { TemplateRequestApi } from './modules/TemplateRequestApi';
import { UserApiApi } from './modules/UserApiApi';
import { UserApi } from './modules/UserApi';

export class DocMasonApi {
  public readonly template: TemplateApi;
  public readonly templateData: TemplateDataApi;
  public readonly templateRequest: TemplateRequestApi;
  public readonly userApi: UserApiApi;
  public readonly user: UserApi;

  private config: DocMasonApiConfig;

  constructor(config: DocMasonApiConfig) {
    this.config = config;
    
    // Initialize API modules
    this.template = new TemplateApi(config);
    this.templateData = new TemplateDataApi(config);
    this.templateRequest = new TemplateRequestApi(config);
    this.userApi = new UserApiApi(config);
    this.user = new UserApi(config);
  }

  /**
   * Update the API configuration (useful for changing API keys or base URL)
   */
  updateConfig(newConfig: Partial<DocMasonApiConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Update all modules with new config
    (this.template as any).config = this.config;
    (this.templateData as any).config = this.config;
    (this.templateRequest as any).config = this.config;
    (this.userApi as any).config = this.config;
    (this.user as any).config = this.config;
  }

  /**
   * Get current configuration (excluding sensitive data)
   */
  getConfig(): Omit<DocMasonApiConfig, 'apiKey'> & { hasApiKey: boolean } {
    return {
      baseUrl: this.config.baseUrl,
      hasApiKey: !!this.config.apiKey,
    };
  }
}

// Re-export types and interfaces for convenience
export * from './types';
export * from './interfaces/TemplateInterfaces';
export * from './interfaces/TemplateDataInterfaces';
export * from './interfaces/TemplateRequestInterfaces';
export * from './interfaces/UserApiInterfaces';
export * from './interfaces/UserInterfaces';