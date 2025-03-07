// Use require instead of import for CommonJS compatibility
const dotenv = require('dotenv');
// Load environment variables from .env file
dotenv.config({ path: '.env' });

const Airtable = require('airtable');
const fs = require('fs');

// Make sure to run this script with the proper environment variables set
async function getAirtableSchema() {
  // Check for environment variables
  if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
    console.error('Error: AIRTABLE_API_KEY and AIRTABLE_BASE_ID must be set in environment variables');
    process.exit(1);
  }

  // Initialize Airtable
  const base = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY,
  }).base(process.env.AIRTABLE_BASE_ID);

  try {
    // We'll try to discover all tables in the base
    console.log('Attempting to discover all tables in the base...');
    
    // Create a schema object to store all table structures
    const schema = {};
    
    // First, let's try to get a list of all tables
    // We'll use a workaround by making a metadata request
    const metaUrl = `https://api.airtable.com/v0/meta/bases/${process.env.AIRTABLE_BASE_ID}/tables`;
    
    try {
      // Using Node's built-in https module to make the request
      const https = require('https');
      const options = {
        headers: {
          'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`
        }
      };
      
      // Make the request to get all tables
      const tableData = await new Promise((resolve, reject) => {
        https.get(metaUrl, options, (res) => {
          let data = '';
          
          res.on('data', (chunk) => {
            data += chunk;
          });
          
          res.on('end', () => {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              reject(e);
            }
          });
        }).on('error', reject);
      });
      
      // Extract table names from the response
      const tables = tableData.tables || [];
      const tableNames = tables.map(table => table.name);
      
      console.log('Discovered tables:', tableNames);
      
      // Process each table
      for (const tableName of tableNames) {
        console.log(`Processing table: ${tableName}`);
        
        try {
          // Get table schema
          const tableSchema = {
            name: tableName,
            fields: [],
          };
          
          // Get a single record to understand the structure
          const records = await base(tableName).select({ maxRecords: 1 }).all();
          
          if (records.length > 0) {
            // Extract field names from the first record
            const firstRecord = records[0];
            const fieldNames = Object.keys(firstRecord.fields);
            
            // Add fields to schema
            fieldNames.forEach(fieldName => {
              const value = firstRecord.fields[fieldName];
              // Get the type as a string
              let fieldType = typeof value;
              
              // Try to determine more specific types
              if (Array.isArray(value)) {
                fieldType = 'array';
              } else if (value instanceof Date) {
                fieldType = 'date';
              }
              
              tableSchema.fields.push({
                name: fieldName,
                type: fieldType,
              });
            });
          }
          
          // Add table schema to the overall schema
          schema[tableName] = tableSchema;
        } catch (error) {
          console.error(`Error processing table ${tableName}:`, error);
        }
      }
    } catch (metaError) {
      console.error('Error fetching tables metadata:', metaError);
      console.log('Falling back to known table names...');
      
      // Fallback to known table names
      const tableNames = ['Swarms']; // Add other table names you know exist
      
      // Process each table
      for (const tableName of tableNames) {
        console.log(`Processing table: ${tableName}`);
        
        try {
          // Get table schema
          const tableSchema = {
            name: tableName,
            fields: [],
          };
          
          // Get a single record to understand the structure
          const records = await base(tableName).select({ maxRecords: 1 }).all();
          
          if (records.length > 0) {
            // Extract field names from the first record
            const firstRecord = records[0];
            const fieldNames = Object.keys(firstRecord.fields);
            
            // Add fields to schema
            fieldNames.forEach(fieldName => {
              const value = firstRecord.fields[fieldName];
              // Get the type as a string
              let fieldType = typeof value;
              
              // Try to determine more specific types
              if (Array.isArray(value)) {
                fieldType = 'array';
              } else if (value instanceof Date) {
                fieldType = 'date';
              }
              
              tableSchema.fields.push({
                name: fieldName,
                type: fieldType,
              });
            });
          }
          
          // Add table schema to the overall schema
          schema[tableName] = tableSchema;
        } catch (error) {
          console.error(`Error processing table ${tableName}:`, error);
        }
      }
    }
    
    // Output the schema
    console.log(JSON.stringify(schema, null, 2));
    
    // Write to a file
    fs.writeFileSync('airtable-schema.json', JSON.stringify(schema, null, 2));
    console.log('Schema written to airtable-schema.json');
    
  } catch (error) {
    console.error('Error fetching Airtable schema:', error);
  }
}

// Run the function
getAirtableSchema();
