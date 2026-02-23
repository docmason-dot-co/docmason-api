import { DocMasonApi } from './src/index';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env file
const loadFromEnv = (): void => {
  const envPath = path.resolve(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        process.env[key.trim()] = value.trim();
      }
    });
  }
};

loadFromEnv();

// Test results tracker
interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'skip';
  message?: string;
  error?: Error;
}

const testResults: {
  passed: number;
  failed: number;
  skipped: number;
  results: TestResult[];
} = {
  passed: 0,
  failed: 0,
  skipped: 0,
  results: []
};

function logTest(name: string, status: 'pass' | 'fail' | 'skip', message = '', error: Error | null = null): void {
  const symbols = { pass: '✅', fail: '❌', skip: '⏭️' };
  const result: TestResult = { name, status, message, error: error || undefined };
  testResults.results.push(result);
  testResults[status === 'pass' ? 'passed' : status === 'fail' ? 'failed' : 'skipped']++;
  
  console.log(`${symbols[status]} ${name}${message ? ': ' + message : ''}`);
  if (error && status === 'fail') {
    console.log(`   Error: ${error.message}`);
  }
}

// Template API Tests
const testCanCreateTemplate = async (dmapi: DocMasonApi): Promise<any> => {
  console.log('-------------------------');
  console.log('TEST: Can create template');
  try {
    const templateContent = `<html>
  <body>
    <h1>{{title}}</h1>
    <p>Hello {{name}},</p>
    <p>This is a test template created on {{date}}.</p>
    <p>Company: {{company}}</p>
    <p>Best regards,<br/>DocMason Team</p>
  </body>
</html>`;
    const newTemplate = await dmapi.templateApi.createTemplateRequest({
      Template_Name: 'Test Template - ' + new Date().toISOString().slice(0, 19),
      content: templateContent,
      Template_MarginTop: '20px',
      Template_MarginBottom: '20px',
      Template_MarginLeft: '20px',
      Template_MarginRight: '20px'
    });
    console.log('Created Template: ');
    console.log(newTemplate);
    console.log('-------------------------');
    logTest('Create Template', 'pass', `Template created with GUID: ${newTemplate.Template_guid}`);
    return newTemplate;
  } catch (error) {
    console.error('Error creating template:', error);
    console.log('-------------------------');
    logTest('Create Template', 'fail', '', error as Error);
    return null;
  }
};

const testCanGetTemplate = async (dmapi: DocMasonApi, templateGuid: string): Promise<void> => {
  console.log('-------------------------');
  console.log('TEST: Can get template');
  try {
    const template = await dmapi.templateApi.getTemplateRequest({ Template_guid: templateGuid });
    console.log('Retrieved Template: ');
    console.log(template);
    console.log('-------------------------');
    logTest('Get Template', 'pass', `Retrieved template: ${template.Template_Name}`);
  } catch (error) {
    console.error('Error getting template:', error);
    console.log('-------------------------');
    logTest('Get Template', 'fail', '', error as Error);
  }
};

const testCanListTemplates = async (dmapi: DocMasonApi): Promise<void> => {
  console.log('-------------------------');
  console.log('TEST: Can list templates');
  try {
    const templates = await dmapi.templateApi.listTemplatesRequest({ from: 0, to: 10 });
    console.log('Templates: ');
    console.log(templates);
    console.log('-------------------------');
    logTest('List Templates', 'pass', `Retrieved templates list`);
  } catch (error) {
    console.error('Error listing templates:', error);
    console.log('-------------------------');
    logTest('List Templates', 'fail', '', error as Error);
  }
};

const testCanEditTemplate = async (dmapi: DocMasonApi, templateGuid: string): Promise<void> => {
  console.log('-------------------------');
  console.log('TEST: Can edit template');
  try {
    const updatedTemplate = await dmapi.templateApi.editTemplateRequest({
      Template_guid: templateGuid,
      Template_Name: 'Updated Test Template - ' + new Date().toISOString().slice(0, 19),
      content: `<html>
  <body>
    <h1>{{title}} - UPDATED</h1>
    <p>Hello {{name}},</p>
    <p>This is an UPDATED test template.</p>
    <p>Best regards,<br/>DocMason Team</p>
  </body>
</html>`
    });
    console.log('Updated Template: ');
    console.log(updatedTemplate);
    console.log('-------------------------');
    logTest('Edit Template', 'pass', 'Template successfully updated');
  } catch (error) {
    console.error('Error editing template:', error);
    console.log('-------------------------');
    logTest('Edit Template', 'fail', '', error as Error);
  }
};

const testCanPreviewTemplate = async (dmapi: DocMasonApi, templateGuid: string): Promise<void> => {
  console.log('-------------------------');
  console.log('TEST: Can preview template');
  try {
    const previewHtml = await dmapi.templateApi.getTemplatePreviewRequest({
      Template_guid: templateGuid,
      data: {
        title: 'Test Document',
        name: 'John Doe',
        date: new Date().toLocaleDateString(),
        company: 'Test Company'
      }
    });
    console.log('Preview HTML length:', previewHtml.length);
    console.log('-------------------------');
    logTest('Preview Template', 'pass', `Generated HTML preview (${previewHtml.length} chars)`);
  } catch (error) {
    console.error('Error previewing template:', error);
    console.log('-------------------------');
    logTest('Preview Template', 'fail', '', error as Error);
  }
};

const testCanGeneratePdf = async (dmapi: DocMasonApi, templateGuid: string): Promise<void> => {
  console.log('-------------------------');
  console.log('TEST: Can generate PDF');
  try {
    const pdfBlob = await dmapi.templateApi.getTemplatePdfRequest({
      Template_guid: templateGuid,
      data: {
        title: 'Test PDF Document',
        name: 'Jane Smith',
        date: new Date().toLocaleDateString(),
        company: 'Acme Corporation'
      }
    });
    
    // Convert blob to buffer and save
    const buffer = Buffer.from(await pdfBlob.arrayBuffer());
    const pdfPath = path.join(__dirname, 'examplePdf.pdf');
    fs.writeFileSync(pdfPath, buffer);
    
    console.log(`PDF generated and saved to ${pdfPath}, size: ${buffer.length} bytes`);
    console.log('-------------------------');
    logTest('Generate PDF', 'pass', `PDF generated successfully (${buffer.length} bytes)`);
  } catch (error: any) {
    console.error('Error generating PDF:', error);
    console.log('-------------------------');
    
    // Handle Response objects with better error details
    if (error && error.status) {
      try {
        const errorBody = await error.text();
        console.log('Error response body:', errorBody);
        logTest('Generate PDF', 'fail', `HTTP ${error.status}: ${error.statusText}`, new Error(`HTTP ${error.status}: ${errorBody}`));
      } catch {
        logTest('Generate PDF', 'fail', `HTTP ${error.status}: ${error.statusText}`, error as Error);
      }
    } else {
      logTest('Generate PDF', 'fail', '', error as Error);
    }
  }
};

// Template Data API Tests
const testCanCreateTemplateData = async (dmapi: DocMasonApi, templateGuid: string): Promise<any> => {
  console.log('-------------------------');
  console.log('TEST: Can create template data');
  console.log('templateGuid');
  console.log(templateGuid);
  try {
    const templateData = await dmapi.templateDataApi.createTemplateDataRequest({
      TemplateData_Name: 'Test Template Data - ' + new Date().toISOString().slice(0, 19),
      Template_guid: templateGuid,
      TemplateData_Interface: `{
        title: string;
        name: string;
        date: string;
        company: string;
      }`,
      TemplateData_Data: JSON.stringify({
        title: 'Sample Document Title',
        name: 'Sample Person',
        date: new Date().toLocaleDateString(),
        company: 'Sample Company'
      })
    });
    console.log('Created Template Data: ');
    console.log(templateData);
    console.log('-------------------------');
    logTest('Create Template Data', 'pass', `Template data created with GUID: ${templateData.TemplateData_guid}`);
    return templateData;
  } catch (error: any) {
    console.error('Error creating template data:', error);
    
    // Handle Response objects with better error details
    if (error && error.status) {
      try {
        const errorBody = await error.text();
        console.log('Error response body:', errorBody);
        logTest('Create Template Data', 'fail', `HTTP ${error.status}: ${error.statusText}`, new Error(`HTTP ${error.status}: ${errorBody}`));
      } catch {
        logTest('Create Template Data', 'fail', `HTTP ${error.status}: ${error.statusText}`, error as Error);
      }
    } else {
      logTest('Create Template Data', 'fail', '', error as Error);
    }
    
    console.log('-------------------------');
    return null;
  }
};

const testCanGetTemplateData = async (dmapi: DocMasonApi, templateGuid: string): Promise<void> => {
  console.log('-------------------------');
  console.log('TEST: Can get template data');
  try {
    const templateData = await dmapi.templateDataApi.getTemplateDataRequest({ Template_guid: templateGuid });
    console.log('Retrieved Template Data: ');
    console.log(templateData);
    console.log('-------------------------');
    logTest('Get Template Data', 'pass', 'Template data retrieved successfully');
  } catch (error: any) {
    console.error('Error getting template data:', error);
    
    // Handle Response objects with better error details
    if (error && error.status) {
      try {
        const errorBody = await error.text();
        console.log('Error response body:', errorBody);
        logTest('Get Template Data', 'fail', `HTTP ${error.status}: ${error.statusText}`, new Error(`HTTP ${error.status}: ${errorBody}`));
      } catch {
        logTest('Get Template Data', 'fail', `HTTP ${error.status}: ${error.statusText}`, error as Error);
      }
    } else {
      logTest('Get Template Data', 'fail', '', error as Error);
    }
    
    console.log('-------------------------');
  }
};

const testCanListTemplateData = async (dmapi: DocMasonApi, templateGuid: string): Promise<void> => {
  console.log('-------------------------');
  console.log('TEST: Can list template data');
  try {
    const templateDataList = await dmapi.templateDataApi.listTemplateDataRequest({ 
      Template_guid: templateGuid, 
      from: 0, 
      to: 10 
    });
    console.log('Template Data List: ');
    console.log(templateDataList);
    console.log('-------------------------');
    logTest('List Template Data', 'pass', `Retrieved ${Array.isArray(templateDataList) ? templateDataList.length : 'N/A'} template data items`);
  } catch (error) {
    console.error('Error listing template data:', error);
    console.log('-------------------------');
    logTest('List Template Data', 'fail', '', error as Error);
  }
};

// Email Template API Tests
const testCanCreateEmailTemplate = async (dmapi: DocMasonApi): Promise<any> => {
  console.log('-------------------------');
  console.log('TEST: Can create email template');
  try {
    const templateContent = `<html>
  <body style="font-family: Arial, sans-serif;">
    <h2>{{subject}}</h2>
    <p>Hello {{name}},</p>
    <p>This is a test email template.</p>
    <p>Message: {{message}}</p>
    <p>Best regards,<br/>DocMason Team</p>
  </body>
</html>`;
    const newTemplate = await dmapi.emailTemplateApi.createEmailTemplateRequest({
      EmailTemplate_Name: 'Test Email Template - ' + new Date().toISOString().slice(0, 19),
      content: templateContent
    });
    console.log('Created EmailTemplate: ');
    console.log(newTemplate);
    console.log('-------------------------');
    logTest('Create Email Template', 'pass', `Email template created with GUID: ${newTemplate.EmailTemplate_guid}`);
    return newTemplate;
  } catch (error) {
    console.error('Error creating email template:', error);
    console.log('-------------------------');
    logTest('Create Email Template', 'fail', '', error as Error);
    return null;
  }
};

const testCanGetEmailTemplate = async (dmapi: DocMasonApi, templateGuid: string): Promise<void> => {
  console.log('-------------------------');
  console.log('TEST: Can get email template');
  try {
    const template = await dmapi.emailTemplateApi.getEmailTemplateRequest({ EmailTemplate_guid: templateGuid });
    console.log('Email Template: ');
    console.log(template);
    console.log('-------------------------');
    logTest('Get Email Template', 'pass', `Retrieved email template: ${template.EmailTemplate_Name}`);
  } catch (error) {
    console.error('Error getting email template:', error);
    console.log('-------------------------');
    logTest('Get Email Template', 'fail', '', error as Error);
  }
};

const testCanEditEmailTemplate = async (dmapi: DocMasonApi, templateGuid: string): Promise<void> => {
  console.log('-------------------------');
  console.log('TEST: Can edit email template');
  try {
    const updatedTemplate = await dmapi.emailTemplateApi.editEmailTemplateRequest({
      EmailTemplate_guid: templateGuid,
      EmailTemplate_Name: 'Updated Test Email Template - ' + new Date().toISOString().slice(0, 19),
      content: `<html>
  <body style="font-family: Arial, sans-serif;">
    <h2>{{subject}} - UPDATED</h2>
    <p>Hello {{name}},</p>
    <p>This is an UPDATED test email template.</p>
    <p>Message: {{message}}</p>
    <p>Best regards,<br/>DocMason Team</p>
  </body>
</html>`
    });
    console.log('Updated Template: ');
    console.log(updatedTemplate);
    console.log('-------------------------');
    logTest('Edit Email Template', 'pass', 'Email template successfully updated');
  } catch (error) {
    console.error('Error editing email template:', error);
    console.log('-------------------------');
    logTest('Edit Email Template', 'fail', '', error as Error);
  }
};

const testCanListEmailTemplates = async (dmapi: DocMasonApi): Promise<void> => {
  console.log('-------------------------');
  console.log('TEST: Can list email templates');
  try {
    const templates = await dmapi.emailTemplateApi.listEmailTemplatesRequest({ from: 0, to: 10 });
    console.log('Email Templates: ');
    console.log(templates);
    console.log('-------------------------');
    logTest('List Email Templates', 'pass', 'Retrieved email templates list');
  } catch (error) {
    console.error('Error listing email templates:', error);
    console.log('-------------------------');
    logTest('List Email Templates', 'fail', '', error as Error);
  }
};

const testCanPreviewEmailTemplate = async (dmapi: DocMasonApi, templateGuid: string): Promise<void> => {
  console.log('-------------------------');
  console.log('TEST: Can preview email template');
  try {
    const previewHtml = await dmapi.emailTemplateApi.getEmailTemplatePreviewRequest({
      EmailTemplate_guid: templateGuid,
      data: {
        subject: 'Test Email Subject',
        name: 'John Doe',
        message: 'This is a test message for the email template.'
      }
    });
    console.log('Preview HTML length:', previewHtml.length);
    console.log('-------------------------');
    logTest('Preview Email Template', 'pass', `Generated email HTML preview (${previewHtml.length} chars)`);
  } catch (error) {
    console.error('Error previewing email template:', error);
    console.log('-------------------------');
    logTest('Preview Email Template', 'fail', '', error as Error);
  }
};

// User API Tests
const testCanGetUserProfile = async (dmapi: DocMasonApi): Promise<void> => {
  console.log('-------------------------');
  console.log('TEST: Can get user profile');
  try {
    const profile = await dmapi.userApi.profileRequest();
    console.log('User Profile: ');
    console.log(profile);
    console.log('-------------------------');
    logTest('Get User Profile', 'pass', `Retrieved profile for user: ${profile.User_Name}`);
  } catch (error) {
    console.error('Error getting user profile:', error);
    console.log('-------------------------');
    logTest('Get User Profile', 'fail', '', error as Error);
  }
};

// Saved Document API Tests
const testCanListSavedDocuments = async (dmapi: DocMasonApi): Promise<void> => {
  console.log('-------------------------');
  console.log('TEST: Can list saved documents');
  try {
    const savedDocuments = await dmapi.savedDocumentApi.listSavedDocumentsRequest({
      EmailTemplate_Name: '',
      from: 0,
      to: 10
    });
    console.log('Saved Documents: ');
    console.log(savedDocuments);
    console.log('-------------------------');
    logTest('List Saved Documents', 'pass', `Retrieved ${savedDocuments.length} saved documents`);
  } catch (error) {
    console.error('Error listing saved documents:', error);
    console.log('-------------------------');
    logTest('List Saved Documents', 'fail', '', error as Error);
  }
};

// Main test runner
const testPackage = async (): Promise<void> => {
  console.log('🧪 Doc Mason API - Package Test Suite');
  console.log('='.repeat(50));
  
  const dmapi = new DocMasonApi(process.env.API_KEY || '', process.env.BASE_URL);
  
  // Test basic configuration
  console.log(`\n🔧 API Configuration:`);
  console.log(`   Base URL: ${dmapi.baseUrl}`);
  console.log(`   API Key: ${dmapi.apiKey ? dmapi.apiKey.substring(0, 8) + '...' : 'NOT SET'}`);
  
  // Test if environment variables are loaded correctly
  console.log(`   Environment Check:`);
  console.log(`   - API_KEY exists: ${!!process.env.API_KEY}`);
  console.log(`   - BASE_URL: ${process.env.BASE_URL || 'using default'}`);
  
  // Early check - if no API key, warn the user
  if (!dmapi.apiKey) {
    console.log(`⚠️  WARNING: No API key set! Please create a .env file with API_KEY=your-api-key`);
    console.log(`   Most tests will fail without proper authentication.`);
  }

  let createdTemplate: any = null;
  let createdEmailTemplate: any = null;
  let createdTemplateData: any = null;

  // First test authentication with user profile
  console.log('\n🔐 Authentication Test');
  console.log('-'.repeat(30));
  
  try {
    await testCanGetUserProfile(dmapi);
    console.log('✅ Authentication working - proceeding with API tests');
  } catch (authError: any) {
    console.log('❌ Authentication failed - API key may be invalid or server unreachable');
    if (authError && authError.status) {
      console.log(`   HTTP Status: ${authError.status} ${authError.statusText}`);
    }
    console.log('   Continuing with tests but expect failures...');
  }

  // Template API Tests
  console.log('\n📄 Template API Tests');
  console.log('-'.repeat(30));
  
  createdTemplate = await testCanCreateTemplate(dmapi);
  await testCanListTemplates(dmapi);
  
  if (createdTemplate) {
    await testCanGetTemplate(dmapi, createdTemplate.Template_guid);
    await testCanEditTemplate(dmapi, createdTemplate.Template_guid);
    await testCanPreviewTemplate(dmapi, createdTemplate.Template_guid);
    await testCanGeneratePdf(dmapi, createdTemplate.Template_guid);
    
    // Template Data Tests
    console.log('\n📊 Template Data API Tests');
    console.log('-'.repeat(30));
    
    createdTemplateData = await testCanCreateTemplateData(dmapi, createdTemplate.Template_guid);
    await testCanGetTemplateData(dmapi, createdTemplate.Template_guid);
    await testCanListTemplateData(dmapi, createdTemplate.Template_guid);
  } else {
    logTest('Get Template', 'skip', 'No template to test with');
    logTest('Edit Template', 'skip', 'No template to test with');
    logTest('Preview Template', 'skip', 'No template to test with');
    logTest('Generate PDF', 'skip', 'No template to test with');
    logTest('Create Template Data', 'skip', 'No template to test with');
    logTest('Get Template Data', 'skip', 'No template to test with');
    logTest('List Template Data', 'skip', 'No template to test with');
  }

  // Email Template API Tests
  console.log('\n📧 Email Template API Tests');
  console.log('-'.repeat(30));
  
  createdEmailTemplate = await testCanCreateEmailTemplate(dmapi);
  await testCanListEmailTemplates(dmapi);
  
  if (createdEmailTemplate) {
    await testCanGetEmailTemplate(dmapi, createdEmailTemplate.EmailTemplate_guid);
    await testCanEditEmailTemplate(dmapi, createdEmailTemplate.EmailTemplate_guid);
    await testCanPreviewEmailTemplate(dmapi, createdEmailTemplate.EmailTemplate_guid);
  } else {
    logTest('Get Email Template', 'skip', 'No email template to test with');
    logTest('Edit Email Template', 'skip', 'No email template to test with');
    logTest('Preview Email Template', 'skip', 'No email template to test with');
  }

  // User API Tests (already tested above for authentication)
  console.log('\n👤 User API Tests');
  console.log('-'.repeat(30));
  console.log('✅ User profile test already completed during authentication check');

  // Saved Document API Tests
  console.log('\n💾 Saved Document API Tests');
  console.log('-'.repeat(30));
  
  await testCanListSavedDocuments(dmapi);

  // Final Summary
  console.log('\n📊 Test Results Summary');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`⏭️  Skipped: ${testResults.skipped}`);
  console.log(`📈 Total Tests: ${testResults.results.length}`);
  
  const passRate = testResults.passed + testResults.failed > 0 
    ? ((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)
    : '0.0';
  console.log(`🎯 Pass Rate: ${passRate}% (excluding skipped)`);

  if (testResults.failed > 0) {
    console.log('\n❌ Failed Tests:');
    testResults.results
      .filter(r => r.status === 'fail')
      .forEach(r => console.log(`   - ${r.name}: ${r.error?.message || 'Unknown error'}`));
  }

  console.log(`\n🎉 Package testing completed!`);
  
  // Exit with appropriate code
  process.exit(testResults.failed > 0 ? 1 : 0);
};

// Run the test suite
testPackage().catch(error => {
  console.error('❌ Test suite failed to run:', error.message);
  process.exit(1);
});