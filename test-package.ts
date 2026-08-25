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

// Minimal valid single-page PDF used to test ParsedDocument file upload/run endpoints
const MINIMAL_PDF_CONTENT = `%PDF-1.1
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 200 200] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj
4 0 obj << /Length 68 >> stream
BT /F1 12 Tf 20 100 Td (Jane Smith - Software Engineer - TypeScript) Tj ET
endstream
endobj
5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj
trailer << /Root 1 0 R >>
`;
const createMinimalPdfFile = (name: string): File => new File([MINIMAL_PDF_CONTENT], name, { type: 'application/pdf' });


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

// Email Template Data API Tests
const testCanCreateEmailTemplateData = async (dmapi: DocMasonApi, emailTemplateGuid: string): Promise<any> => {
  console.log('-------------------------');
  console.log('TEST: Can create email template data');
  try {
    // Debug: Let's see what JSON.stringify produces
    const testData = JSON.stringify('Welcome to Our Service');
    console.log('JSON stringified data:', testData);
    
    const emailTemplateData = await dmapi.emailTemplateDataApi.createEmailTemplateDataRequest({
      EmailTemplateData_Name: 'subject',
      EmailTemplate_guid: emailTemplateGuid,
      EmailTemplateData_Interface: 'string',
      EmailTemplateData_Data: testData
    });
    await dmapi.emailTemplateDataApi.createEmailTemplateDataRequest({
      EmailTemplate_guid: emailTemplateGuid,
      EmailTemplateData_Name: 'name',
      EmailTemplateData_Interface: 'string',
      EmailTemplateData_Data: '\\"Jane Smith\\"'
    });
    await dmapi.emailTemplateDataApi.createEmailTemplateDataRequest({
      EmailTemplate_guid: emailTemplateGuid,
      EmailTemplateData_Name: 'message',
      EmailTemplateData_Interface: 'string',
      EmailTemplateData_Data: '\\"Thank you for joining us! We have updated your information.\\"'
    });
    await dmapi.emailTemplateDataApi.createEmailTemplateDataRequest({
      EmailTemplate_guid: emailTemplateGuid,
      EmailTemplateData_Name: 'companyName',
      EmailTemplateData_Interface: 'string',
      EmailTemplateData_Data: '\\"Updated Company Name\\"'
    });
    console.log('Created Email Template Data: ');
    console.log(emailTemplateData);
    console.log('-------------------------');
    logTest('Create Email Template Data', 'pass', `Email template data created with GUID: ${emailTemplateData.EmailTemplateData_guid}`);
    return emailTemplateData;
  } catch (error: any) {
    console.error('Error creating email template data:', error);
    
    // Handle Response objects with better error details
    if (error && error.status) {
      try {
        const errorBody = await error.text();
        console.log('Error response body:', errorBody);
        logTest('Create Email Template Data', 'fail', `HTTP ${error.status}: ${error.statusText}`, new Error(`HTTP ${error.status}: ${errorBody}`));
      } catch {
        logTest('Create Email Template Data', 'fail', `HTTP ${error.status}: ${error.statusText}`, error as Error);
      }
    } else {
      logTest('Create Email Template Data', 'fail', '', error as Error);
    }
    
    console.log('-------------------------');
    return null;
  }
};

const testCanGetEmailTemplateData = async (dmapi: DocMasonApi, emailTemplateDataGuid: string): Promise<void> => {
  console.log('-------------------------');
  console.log('TEST: Can get email template data');
  try {
    const emailTemplateData = await dmapi.emailTemplateDataApi.getEmailTemplateDataRequest({ 
      EmailTemplateData_guid: emailTemplateDataGuid 
    });
    console.log('Retrieved Email Template Data: ');
    console.log(emailTemplateData);
    console.log('-------------------------');
    logTest('Get Email Template Data', 'pass', `Retrieved email template data: ${emailTemplateData.EmailTemplateData_Name}`);
  } catch (error: any) {
    console.error('Error getting email template data:', error);
    
    // Handle Response objects with better error details
    if (error && error.status) {
      try {
        const errorBody = await error.text();
        console.log('Error response body:', errorBody);
        logTest('Get Email Template Data', 'fail', `HTTP ${error.status}: ${error.statusText}`, new Error(`HTTP ${error.status}: ${errorBody}`));
      } catch {
        logTest('Get Email Template Data', 'fail', `HTTP ${error.status}: ${error.statusText}`, error as Error);
      }
    } else {
      logTest('Get Email Template Data', 'fail', '', error as Error);
    }
    
    console.log('-------------------------');
  }
};

const testCanListEmailTemplateData = async (dmapi: DocMasonApi, emailTemplateGuid: string): Promise<void> => {
  console.log('-------------------------');
  console.log('TEST: Can list email template data');
  try {
    const emailTemplateDataList = await dmapi.emailTemplateDataApi.listEmailTemplateDataRequest({ 
      EmailTemplate_guid: emailTemplateGuid,
      from: 0, 
      to: 10 
    });
    console.log('Email Template Data List: ');
    console.log(emailTemplateDataList);
    console.log('-------------------------');
    logTest('List Email Template Data', 'pass', `Retrieved ${Array.isArray(emailTemplateDataList) ? emailTemplateDataList.length : 'N/A'} email template data items`);
  } catch (error: any) {
    console.error('Error listing email template data:', error);
    
    // Handle Response objects with better error details
    if (error && error.status) {
      try {
        const errorBody = await error.text();
        console.log('Error response body:', errorBody);
        logTest('List Email Template Data', 'fail', `HTTP ${error.status}: ${error.statusText}`, new Error(`HTTP ${error.status}: ${errorBody}`));
      } catch {
        logTest('List Email Template Data', 'fail', `HTTP ${error.status}: ${error.statusText}`, error as Error);
      }
    } else {
      logTest('List Email Template Data', 'fail', '', error as Error);
    }
    
    console.log('-------------------------');
  }
};

const testCanEditEmailTemplateData = async (dmapi: DocMasonApi, emailTemplateDataGuid: string): Promise<void> => {
  console.log('-------------------------');
  console.log('TEST: Can edit email template data');
  try {
    const updatedEmailTemplateData = await dmapi.emailTemplateDataApi.editEmailTemplateDataRequest({
      EmailTemplateData_guid: emailTemplateDataGuid,
      EmailTemplateData_Name: 'subject',
      EmailTemplateData_Interface: 'string',
      EmailTemplateData_Data: JSON.stringify('Updated: Welcome to Our Service')
    });
    console.log('Updated Email Template Data: ');
    console.log(updatedEmailTemplateData);
    console.log('-------------------------');
    logTest('Edit Email Template Data', 'pass', 'Email template data successfully updated');
  } catch (error: any) {
    console.error('Error editing email template data:', error);
    
    // Handle Response objects with better error details
    if (error && error.status) {
      try {
        const errorBody = await error.text();
        console.log('Error response body:', errorBody);
        logTest('Edit Email Template Data', 'fail', `HTTP ${error.status}: ${error.statusText}`, new Error(`HTTP ${error.status}: ${errorBody}`));
      } catch {
        logTest('Edit Email Template Data', 'fail', `HTTP ${error.status}: ${error.statusText}`, error as Error);
      }
    } else {
      logTest('Edit Email Template Data', 'fail', '', error as Error);
    }
    
    console.log('-------------------------');
  }
};

// Parsed Document API Tests
const testCanCreateParsedDocument = async (dmapi: DocMasonApi): Promise<any> => {
  console.log('-------------------------');
  console.log('TEST: Can create parsed document');
  try {
    const parsedDocument = await dmapi.parsedDocumentApi.createParsedDocumentRequest({
      ParsedDocument_Name: 'Test Resume Parser - ' + new Date().toISOString().slice(0, 19),
      ParsedDocument_Description: 'Extract candidate profile information from resumes',
      ParsedDocument_Interface: `{
        candidateName: string;
        email?: string;
        phone?: string;
        skills: string[];
      }`
    });
    console.log('Created Parsed Document: ');
    console.log(parsedDocument);
    console.log('-------------------------');
    logTest('Create Parsed Document', 'pass', `Parsed document created with GUID: ${parsedDocument.ParsedDocument_guid}`);
    return parsedDocument;
  } catch (error: any) {
    console.error('Error creating parsed document:', error);

    if (error && error.status) {
      try {
        const errorBody = await error.text();
        console.log('Error response body:', errorBody);
        logTest('Create Parsed Document', 'fail', `HTTP ${error.status}: ${error.statusText}`, new Error(`HTTP ${error.status}: ${errorBody}`));
      } catch {
        logTest('Create Parsed Document', 'fail', `HTTP ${error.status}: ${error.statusText}`, error as Error);
      }
    } else {
      logTest('Create Parsed Document', 'fail', '', error as Error);
    }

    console.log('-------------------------');
    return null;
  }
};

const testCanGetParsedDocument = async (dmapi: DocMasonApi, parsedDocumentGuid: string): Promise<void> => {
  console.log('-------------------------');
  console.log('TEST: Can get parsed document');
  try {
    const parsedDocument = await dmapi.parsedDocumentApi.getParsedDocumentRequest({ ParsedDocument_guid: parsedDocumentGuid });
    console.log('Retrieved Parsed Document: ');
    console.log(parsedDocument);
    console.log('-------------------------');
    logTest('Get Parsed Document', 'pass', `Retrieved parsed document: ${parsedDocument.ParsedDocument_Name}`);
  } catch (error: any) {
    console.error('Error getting parsed document:', error);

    if (error && error.status) {
      try {
        const errorBody = await error.text();
        console.log('Error response body:', errorBody);
        logTest('Get Parsed Document', 'fail', `HTTP ${error.status}: ${error.statusText}`, new Error(`HTTP ${error.status}: ${errorBody}`));
      } catch {
        logTest('Get Parsed Document', 'fail', `HTTP ${error.status}: ${error.statusText}`, error as Error);
      }
    } else {
      logTest('Get Parsed Document', 'fail', '', error as Error);
    }

    console.log('-------------------------');
  }
};

const testCanListParsedDocuments = async (dmapi: DocMasonApi): Promise<void> => {
  console.log('-------------------------');
  console.log('TEST: Can list parsed documents');
  try {
    const parsedDocuments = await dmapi.parsedDocumentApi.listParsedDocumentsRequest({ from: 0, to: 10 });
    console.log('Parsed Documents: ');
    console.log(parsedDocuments);
    console.log('-------------------------');
    logTest('List Parsed Documents', 'pass', `Retrieved ${Array.isArray(parsedDocuments) ? parsedDocuments.length : 'N/A'} parsed documents`);
  } catch (error: any) {
    console.error('Error listing parsed documents:', error);

    if (error && error.status) {
      try {
        const errorBody = await error.text();
        console.log('Error response body:', errorBody);
        logTest('List Parsed Documents', 'fail', `HTTP ${error.status}: ${error.statusText}`, new Error(`HTTP ${error.status}: ${errorBody}`));
      } catch {
        logTest('List Parsed Documents', 'fail', `HTTP ${error.status}: ${error.statusText}`, error as Error);
      }
    } else {
      logTest('List Parsed Documents', 'fail', '', error as Error);
    }

    console.log('-------------------------');
  }
};

const testCanUpdateParsedDocument = async (dmapi: DocMasonApi, parsedDocumentGuid: string): Promise<void> => {
  console.log('-------------------------');
  console.log('TEST: Can update parsed document');
  try {
    const updatedParsedDocument = await dmapi.parsedDocumentApi.updateParsedDocumentRequest({
      ParsedDocument_guid: parsedDocumentGuid,
      ParsedDocument_Interface: `{
        candidateName: string;
        email?: string;
        phone?: string;
        skills: string[];
        experience: {
          company: string;
          title: string;
          startDate?: string;
          endDate?: string;
        }[];
      }`
    });
    console.log('Updated Parsed Document: ');
    console.log(updatedParsedDocument);
    console.log('-------------------------');
    logTest('Update Parsed Document', 'pass', 'Parsed document successfully updated');
  } catch (error: any) {
    console.error('Error updating parsed document:', error);

    if (error && error.status) {
      try {
        const errorBody = await error.text();
        console.log('Error response body:', errorBody);
        logTest('Update Parsed Document', 'fail', `HTTP ${error.status}: ${error.statusText}`, new Error(`HTTP ${error.status}: ${errorBody}`));
      } catch {
        logTest('Update Parsed Document', 'fail', `HTTP ${error.status}: ${error.statusText}`, error as Error);
      }
    } else {
      logTest('Update Parsed Document', 'fail', '', error as Error);
    }

    console.log('-------------------------');
  }
};

const testCanUploadParsedDocumentExample = async (dmapi: DocMasonApi, parsedDocumentGuid: string): Promise<void> => {
  console.log('-------------------------');
  console.log('TEST: Can upload parsed document example');
  try {
    const exampleFile = createMinimalPdfFile('example-resume.pdf');
    const updatedParsedDocument = await dmapi.parsedDocumentApi.uploadParsedDocumentExampleRequest({
      ParsedDocument_guid: parsedDocumentGuid,
      file: exampleFile
    });
    console.log('Parsed Document with Example: ');
    console.log(updatedParsedDocument);
    console.log('-------------------------');
    logTest('Upload Parsed Document Example', 'pass', 'Example file successfully uploaded');
  } catch (error: any) {
    console.error('Error uploading parsed document example:', error);

    if (error && error.status) {
      try {
        const errorBody = await error.text();
        console.log('Error response body:', errorBody);
        logTest('Upload Parsed Document Example', 'fail', `HTTP ${error.status}: ${error.statusText}`, new Error(`HTTP ${error.status}: ${errorBody}`));
      } catch {
        logTest('Upload Parsed Document Example', 'fail', `HTTP ${error.status}: ${error.statusText}`, error as Error);
      }
    } else {
      logTest('Upload Parsed Document Example', 'fail', '', error as Error);
    }

    console.log('-------------------------');
  }
};

const testCanRunParsedDocument = async (dmapi: DocMasonApi, parsedDocumentGuid: string): Promise<{ requestGuid: string | null; }> => {
  console.log('-------------------------');
  console.log('TEST: Can run parsed document');
  try {
    const runFile = createMinimalPdfFile('resume.pdf');
    const runResult = await dmapi.parsedDocumentApi.runParsedDocumentRequest({
      ParsedDocument_guid: parsedDocumentGuid,
      file: runFile
    });
    console.log('Run Parsed Document Result: ');
    console.log(runResult);
    console.log('-------------------------');
    logTest('Run Parsed Document', 'pass', `Run returned status: ${runResult.status}`);
    return { requestGuid: runResult.parsedDocumentRequestGuid || null };
  } catch (error: any) {
    console.error('Error running parsed document:', error);

    if (error && error.status) {
      try {
        const errorBody = await error.text();
        console.log('Error response body:', errorBody);
        logTest('Run Parsed Document', 'fail', `HTTP ${error.status}: ${error.statusText}`, new Error(`HTTP ${error.status}: ${errorBody}`));
      } catch {
        logTest('Run Parsed Document', 'fail', `HTTP ${error.status}: ${error.statusText}`, error as Error);
      }
    } else {
      logTest('Run Parsed Document', 'fail', '', error as Error);
    }

    console.log('-------------------------');
    return { requestGuid: null };
  }
};

const testCanPollParsedDocument = async (dmapi: DocMasonApi, parsedDocumentGuid: string, parsedDocumentRequestGuid: string): Promise<void> => {
  console.log('-------------------------');
  console.log('TEST: Can poll parsed document request');
  try {
    const pollResult = await dmapi.parsedDocumentApi.pollParsedDocumentRequest({
      ParsedDocument_guid: parsedDocumentGuid,
      ParsedDocumentRequest_guid: parsedDocumentRequestGuid
    });
    console.log('Poll Result: ');
    console.log(pollResult);
    console.log('-------------------------');
    logTest('Poll Parsed Document', 'pass', `Poll returned status: ${pollResult.status}`);
  } catch (error: any) {
    console.error('Error polling parsed document:', error);

    if (error && error.status) {
      try {
        const errorBody = await error.text();
        console.log('Error response body:', errorBody);
        logTest('Poll Parsed Document', 'fail', `HTTP ${error.status}: ${error.statusText}`, new Error(`HTTP ${error.status}: ${errorBody}`));
      } catch {
        logTest('Poll Parsed Document', 'fail', `HTTP ${error.status}: ${error.statusText}`, error as Error);
      }
    } else {
      logTest('Poll Parsed Document', 'fail', '', error as Error);
    }

    console.log('-------------------------');
  }
};

const testCanDeleteParsedDocument = async (dmapi: DocMasonApi, parsedDocumentGuid: string): Promise<void> => {
  console.log('-------------------------');
  console.log('TEST: Can delete parsed document');
  try {
    await dmapi.parsedDocumentApi.deleteParsedDocumentRequest({ ParsedDocument_guid: parsedDocumentGuid });
    console.log('-------------------------');
    logTest('Delete Parsed Document', 'pass', 'Parsed document successfully deleted');
  } catch (error: any) {
    console.error('Error deleting parsed document:', error);

    if (error && error.status) {
      try {
        const errorBody = await error.text();
        console.log('Error response body:', errorBody);
        logTest('Delete Parsed Document', 'fail', `HTTP ${error.status}: ${error.statusText}`, new Error(`HTTP ${error.status}: ${errorBody}`));
      } catch {
        logTest('Delete Parsed Document', 'fail', `HTTP ${error.status}: ${error.statusText}`, error as Error);
      }
    } else {
      logTest('Delete Parsed Document', 'fail', '', error as Error);
    }

    console.log('-------------------------');
  }
};

// Parsed Document Request API Tests
const testCanListParsedDocumentRequests = async (dmapi: DocMasonApi, parsedDocumentGuid: string): Promise<void> => {
  console.log('-------------------------');
  console.log('TEST: Can list parsed document requests');
  try {
    const requestList = await dmapi.parsedDocumentRequestApi.listParsedDocumentRequestsRequest({
      ParsedDocument_guid: parsedDocumentGuid,
      from: 0,
      to: 10
    });
    console.log('Parsed Document Requests: ');
    console.log(requestList);
    console.log('-------------------------');
    logTest('List Parsed Document Requests', 'pass', `Retrieved ${requestList.parsedDocumentRequests?.length ?? 'N/A'} parsed document requests`);
  } catch (error: any) {
    console.error('Error listing parsed document requests:', error);

    if (error && error.status) {
      try {
        const errorBody = await error.text();
        console.log('Error response body:', errorBody);
        logTest('List Parsed Document Requests', 'fail', `HTTP ${error.status}: ${error.statusText}`, new Error(`HTTP ${error.status}: ${errorBody}`));
      } catch {
        logTest('List Parsed Document Requests', 'fail', `HTTP ${error.status}: ${error.statusText}`, error as Error);
      }
    } else {
      logTest('List Parsed Document Requests', 'fail', '', error as Error);
    }

    console.log('-------------------------');
  }
};

const testCanGetParsedDocumentRequest = async (dmapi: DocMasonApi, parsedDocumentRequestGuid: string): Promise<void> => {
  console.log('-------------------------');
  console.log('TEST: Can get parsed document request');
  try {
    const parsedDocumentRequest = await dmapi.parsedDocumentRequestApi.getParsedDocumentRequestRequest({
      ParsedDocumentRequest_guid: parsedDocumentRequestGuid
    });
    console.log('Parsed Document Request: ');
    console.log(parsedDocumentRequest);
    console.log('-------------------------');
    logTest('Get Parsed Document Request', 'pass', `Retrieved parsed document request: ${parsedDocumentRequest.ParsedDocumentRequest_Name}`);
  } catch (error: any) {
    console.error('Error getting parsed document request:', error);

    if (error && error.status) {
      try {
        const errorBody = await error.text();
        console.log('Error response body:', errorBody);
        logTest('Get Parsed Document Request', 'fail', `HTTP ${error.status}: ${error.statusText}`, new Error(`HTTP ${error.status}: ${errorBody}`));
      } catch {
        logTest('Get Parsed Document Request', 'fail', `HTTP ${error.status}: ${error.statusText}`, error as Error);
      }
    } else {
      logTest('Get Parsed Document Request', 'fail', '', error as Error);
    }

    console.log('-------------------------');
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
  let createdEmailTemplateData: any = null;
  let createdParsedDocument: any = null;

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
    
    // Email Template Data Tests
    console.log('\n📨 Email Template Data API Tests');
    console.log('-'.repeat(30));
    
    createdEmailTemplateData = await testCanCreateEmailTemplateData(dmapi, createdEmailTemplate.EmailTemplate_guid);
    await testCanListEmailTemplateData(dmapi, createdEmailTemplate.EmailTemplate_guid);
    
    if (createdEmailTemplateData) {
      await testCanGetEmailTemplateData(dmapi, createdEmailTemplateData.EmailTemplateData_guid);
      await testCanEditEmailTemplateData(dmapi, createdEmailTemplateData.EmailTemplateData_guid);
    } else {
      logTest('Get Email Template Data', 'skip', 'No email template data to test with');
      logTest('Edit Email Template Data', 'skip', 'No email template data to test with');
    }
  } else {
    logTest('Get Email Template', 'skip', 'No email template to test with');
    logTest('Edit Email Template', 'skip', 'No email template to test with');
    logTest('Preview Email Template', 'skip', 'No email template to test with');
    logTest('Create Email Template Data', 'skip', 'No email template to test with');
    logTest('List Email Template Data', 'skip', 'No email template to test with');
    logTest('Get Email Template Data', 'skip', 'No email template to test with');
    logTest('Edit Email Template Data', 'skip', 'No email template to test with');
  }

  // User API Tests (already tested above for authentication)
  console.log('\n👤 User API Tests');
  console.log('-'.repeat(30));
  console.log('✅ User profile test already completed during authentication check');

  // Parsed Document API Tests
  console.log('\n🧾 Parsed Document API Tests');
  console.log('-'.repeat(30));

  createdParsedDocument = await testCanCreateParsedDocument(dmapi);
  await testCanListParsedDocuments(dmapi);

  if (createdParsedDocument) {
    await testCanGetParsedDocument(dmapi, createdParsedDocument.ParsedDocument_guid);
    await testCanUpdateParsedDocument(dmapi, createdParsedDocument.ParsedDocument_guid);
    await testCanUploadParsedDocumentExample(dmapi, createdParsedDocument.ParsedDocument_guid);

    const { requestGuid } = await testCanRunParsedDocument(dmapi, createdParsedDocument.ParsedDocument_guid);

    // Parsed Document Request API Tests
    console.log('\n🧾 Parsed Document Request API Tests');
    console.log('-'.repeat(30));

    await testCanListParsedDocumentRequests(dmapi, createdParsedDocument.ParsedDocument_guid);

    if (requestGuid) {
      await testCanPollParsedDocument(dmapi, createdParsedDocument.ParsedDocument_guid, requestGuid);
      await testCanGetParsedDocumentRequest(dmapi, requestGuid);
    } else {
      logTest('Poll Parsed Document', 'skip', 'No parsed document request to poll');
      logTest('Get Parsed Document Request', 'skip', 'No parsed document request to test with');
    }

    await testCanDeleteParsedDocument(dmapi, createdParsedDocument.ParsedDocument_guid);
  } else {
    logTest('Get Parsed Document', 'skip', 'No parsed document to test with');
    logTest('Update Parsed Document', 'skip', 'No parsed document to test with');
    logTest('Upload Parsed Document Example', 'skip', 'No parsed document to test with');
    logTest('Run Parsed Document', 'skip', 'No parsed document to test with');
    logTest('List Parsed Document Requests', 'skip', 'No parsed document to test with');
    logTest('Poll Parsed Document', 'skip', 'No parsed document to test with');
    logTest('Get Parsed Document Request', 'skip', 'No parsed document to test with');
    logTest('Delete Parsed Document', 'skip', 'No parsed document to test with');
  }

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