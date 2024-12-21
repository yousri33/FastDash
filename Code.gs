function doGet(e) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  
  try {
    if (e.parameter.name && e.parameter.email) {
      // Get the specific spreadsheet by ID
      const spreadsheetId = '177AsUYb_e7tU4EuysJu7A6G2uKCk_Y5VPCDvMmjlXP4';
      const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
      const sheet = spreadsheet.getSheets()[0]; // Gets the first sheet
      
      // Get timestamp
      const timestamp = new Date();
      
      // Prepare row data
      const rowData = [
        timestamp,
        e.parameter.name,
        e.parameter.email,
        e.parameter.request || '',
        e.parameter.fileName || ''
      ];
      
      // Append row
      sheet.appendRow(rowData);
      
      // Log for debugging
      Logger.log('Data added: ' + JSON.stringify(rowData));
      
      // Return success response
      return ContentService.createTextOutput(JSON.stringify({
        'status': 'success',
        'message': 'Data added successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
    }
    
    // Return error for invalid requests
    throw new Error('Invalid request format');
  } catch (error) {
    // Log the error
    Logger.log('Error: ' + error.message);
    Logger.log('Stack: ' + error.stack);
    
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': error.message
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
  }
}

function doPost(e) {
  return ContentService.createTextOutput("The API is working");
} 