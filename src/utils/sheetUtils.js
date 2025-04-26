import axios from 'axios';

// Extract the spreadsheet ID from the URL
const extractSpreadsheetId = (url) => {
  const match = url.match(/\/d\/(.*?)\/|\/spreadsheets\/d\/(.*?)\//);
  return match ? (match[1] || match[2]) : null;
};

// Convert Google Sheet to CSV format URL
const getSheetCsvUrl = (spreadsheetId, sheetId = 0) => {
  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${sheetId}`;
};

// Parse CSV data
const parseCsvData = (csvData) => {
  // Split by lines
  const lines = csvData.split('\n');
  
  // If we have no data, return empty array
  if (lines.length <= 1) return [];
  
  // Process data (assuming first column is name, second column is value)
  const results = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Split cells
    const cells = line.split(',');
    if (cells.length < 2) continue;
    
    const name = cells[0].trim();
    const valueStr = cells[1].trim();
    
    // Skip if no name or value
    if (!name || !valueStr) continue;
    
    // Convert value to number
    const value = parseInt(valueStr, 10);
    if (isNaN(value)) continue;
    
    results.push({ name, value });
  }
  
  return results;
};

// Main function to fetch sheet data
export const fetchSheetData = async (url) => {
  try {
    // Extract spreadsheet ID
    const spreadsheetId = extractSpreadsheetId(url);
    if (!spreadsheetId) {
      throw new Error('無効なGoogle SpreadsheetのURLです');
    }
    
    // Get CSV URL
    const csvUrl = getSheetCsvUrl(spreadsheetId);
    
    // Fetch data
    const response = await axios.get(csvUrl);
    
    // Parse data
    return parseCsvData(response.data);
  } catch (error) {
    console.error('Error fetching spreadsheet data:', error);
    throw new Error('スプレッドシートデータの取得に失敗しました');
  }
};