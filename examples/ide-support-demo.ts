/**
 * Example demonstrating DocMason API usage with full IDE support
 * This file shows how the package provides excellent IntelliSense and type checking
 */

import { DocMasonApi, DocMasonApiConfig } from '../src/index';

async function demonstrateApiUsage() {
  // 1. Initialize with full type checking
  const config: DocMasonApiConfig = {
    apiKey: 'your-api-key-here',
    baseUrl: 'https://docmason.co/api/v1' // Optional
  };
  
  const dmapi = new DocMasonApi(config);
  
  // Alternative constructor (backward compatible)
  // const dmapi = new DocMasonApi('your-api-key-here', 'optional-base-url');
  
  try {
    // 2. Create a template with full autocomplete support
    const templateResponse = await dmapi.templateApi.createTemplateRequest({
      Template_Name: 'IDE Demo Template',
      content: `
        <html>
          <body>
            <h1>{{title}}</h1>
            <p>Hello {{customerName}},</p>
            <p>Your order total is: $\{{orderTotal}}</p>
            <p>Order Date: {{orderDate}}</p>
          </body>
        </html>
      `,
      Template_MarginTop: '20px',
      Template_MarginBottom: '20px',
      Template_MarginLeft: '15px',
      Template_MarginRight: '15px'
      // IDE will suggest all available optional properties
    });
    
    console.log('✅ Template created:', templateResponse.Template_guid);
    
    // 3. Generate PDF with type-safe data
    const orderData = {
      title: 'Order Confirmation',
      customerName: 'John Doe',
      orderTotal: '129.99',
      orderDate: new Date().toLocaleDateString()
    };
    
    const pdfBlob = await dmapi.templateApi.getTemplatePdfRequest({
      Template_guid: templateResponse.Template_guid,
      data: orderData // Type-checked against template variables
    });
    
    console.log('✅ PDF generated, size:', pdfBlob.size, 'bytes');
    
    // 4. Work with template data
    const templateData = await dmapi.templateDataApi.createTemplateDataRequest({
      TemplateData_Name: 'Sample Order Data',
      Template_guid: templateResponse.Template_guid,
      TemplateData_Interface: JSON.stringify({
        title: 'string',
        customerName: 'string',
        orderTotal: 'string',
        orderDate: 'string'
      }),
      TemplateData_Data: JSON.stringify(orderData)
    });
    
    console.log('✅ Template data saved:', templateData.TemplateData_guid);
    
    // 5. Email template operations
    const emailTemplate = await dmapi.emailTemplateApi.createEmailTemplateRequest({
      EmailTemplate_Name: 'Order Confirmation Email',
      content: `
        <html>
          <body style="font-family: Arial, sans-serif;">
            <h2>{{subject}}</h2>
            <p>Dear {{customerName}},</p>
            <p>{{messageBody}}</p>
            <p>Best regards,<br/>Your Team</p>
          </body>
        </html>
      `
    });
    
    // Preview the email template
    const emailPreview = await dmapi.emailTemplateApi.getEmailTemplatePreviewRequest({
      EmailTemplate_guid: emailTemplate.EmailTemplate_guid,
      data: {
        subject: 'Your Order Confirmation',
        customerName: 'John Doe',
        messageBody: 'Thank you for your order! We\'ll process it shortly.'
      }
    });
    
    console.log('✅ Email preview generated, length:', emailPreview.length);
    
    // 6. User profile operations
    const userProfile = await dmapi.userApi.profileRequest();
    console.log('✅ User profile:', userProfile.User_Name, `(${userProfile.User_Type})`);
    
  } catch (error) {
    console.error('❌ Error:', error);
    
    // Type-safe error handling
    if (error && typeof error === 'object' && 'message' in error) {
      console.error('Error message:', (error as Error).message);
    }
  }
}

// Example of using different API areas
async function demonstrateAllApis() {
  const dmapi = new DocMasonApi({
    apiKey: process.env.DMAPI_KEY || 'demo-key'
  });
  
  // Each API has full IntelliSense support
  console.log('Available APIs:');
  console.log('- templateApi:', typeof dmapi.templateApi);
  console.log('- templateDataApi:', typeof dmapi.templateDataApi);
  console.log('- emailTemplateApi:', typeof dmapi.emailTemplateApi);
  console.log('- userApi:', typeof dmapi.userApi);
  console.log('- savedDocumentApi:', typeof dmapi.savedDocumentApi);
}

// Export for use in other files
export { demonstrateApiUsage, demonstrateAllApis };

// Run demonstration if this file is executed directly
if (require.main === module) {
  console.log('🚀 DocMason API IDE Support Demonstration');
  console.log('This example shows full TypeScript support and IntelliSense');
  
  demonstrateAllApis().then(() => {
    console.log('✅ API structure demonstration complete');
  }).catch(console.error);
}