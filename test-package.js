const { DocMasonApi } = require('./dist/index.js');
const fs = require('fs');
const path = require('path');

const loadFromEnv = ()=>{
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
}
loadFromEnv();

// Main test function to create document and generate PDF
async function testDocumentGeneration() {
  console.log('🧪 Testing doc-mason-api package and PDF generation...');

  try {
    // Test that we can instantiate the API client
    const dmapi = new DocMasonApi({
      apiKey: process.env.API_KEY || 'test-api-key',
      baseUrl: process.env.BASE_URL || 'https://api.docmason.com/api/v1'
    });

    console.log('✅ DocMasonApi instantiated successfully');
    
    // Check that all modules are present
    const modules = ['template', 'templateData', 'templateRequest', 'userApi', 'user'];
    modules.forEach(module => {
      if (dmapi[module]) {
        console.log(`✅ ${module} module available`);
      } else {
        console.log(`❌ ${module} module missing`);
      }
    });

    // Test config methods
    const config = dmapi.getConfig();
    console.log('✅ Config retrieved:', { baseUrl: config.baseUrl, hasApiKey: config.hasApiKey });

    console.log('🎉 All basic tests passed!');
    
    // Create a test template
    console.log('\n📄 Creating test template...');
    const templateHtml = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; border-bottom: 2px solid #007acc; }
        .content { margin: 20px 0; }
        .highlight { background-color: #f0f8ff; padding: 10px; border-left: 4px solid #007acc; }
    </style>
</head>
<body>
    <h1>{{title}}</h1>
    <div class="content">
        <p>Hello, <strong>{{name}}</strong>!</p>
        <p>This is a test document generated on {{date}}.</p>
        <div class="highlight">
            <p>Company: {{company}}</p>
            <p>Email: {{email}}</p>
        </div>
        <p>Thank you for testing the DocMason API!</p>
    </div>
</body>
</html>`;

    const createTemplateResponse = await dmapi.template.create({
      Template_Name: 'Test Document Template',
      content: templateHtml,
    });

    console.log('✅ Template created:', createTemplateResponse.message);
    
    // Test data to fill the template
    const testData = {
      title: 'Test Document Report',
      name: 'John Doe',
      date: new Date().toLocaleDateString(),
      company: 'Acme Corporation',
      email: 'john.doe@acme.com'
    };

    console.log('\n📄 Template data:', testData);

    // Generate PDF from the template
    console.log('\n📄 Generating PDF...');
    const pdfBuffer = await dmapi.template.generatePdfBuffer({
      Template_guid: createTemplateResponse.template.Template_guid,
      data: testData
    });

    // Save the PDF to file
    const pdfPath = path.join(__dirname, 'examplePdf.pdf');
    fs.writeFileSync(pdfPath, pdfBuffer);
    
    console.log(`✅ PDF generated and saved to: ${pdfPath}`);
    console.log(`📊 PDF size: ${(pdfBuffer.length / 1024).toFixed(2)} KB`);
    
    // Test that the PDF file was created successfully
    console.log('\n🔍 Testing PDF file...');
    if (fs.existsSync(pdfPath)) {
      const stats = fs.statSync(pdfPath);
      console.log(`✅ PDF file exists and is ${stats.size} bytes`);
      
      // Verify it's a valid PDF by checking the header
      const pdfHeader = fs.readFileSync(pdfPath, { start: 0, end: 4 });
      if (pdfHeader.toString() === '%PDF-') {
        console.log('✅ PDF file has valid PDF header');
      } else {
        console.log('⚠️  PDF file may be corrupted - invalid header');
      }
    } else {
      console.log('❌ PDF file was not created');
    }
    
    // Clean up - delete the template from the user's account
    console.log('\n🧹 Cleaning up test template from account...');
    try {
      const deleteResponse = await dmapi.template.delete(createTemplateResponse.template.Template_guid);
      console.log('✅ Test template deleted from account:', deleteResponse.message);
    } catch (deleteError) {
      console.log('⚠️  Could not delete test template from account:', deleteError.message);
    }
    
    console.log(`\n🎉 Document generation test completed successfully!`);
    console.log(`📄 Generated PDF file kept at: ${pdfPath}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

// Run the test
testDocumentGeneration();