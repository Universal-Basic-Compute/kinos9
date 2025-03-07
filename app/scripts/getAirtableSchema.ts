import * as dotenv from 'dotenv';
// Load environment variables from .env.local file
dotenv.config({ path: '.env.local' });

import Airtable from 'airtable';
import * as fs from 'fs';

// Make sure to run this script with the proper environment variables set
// You can run it with: npm run schema
async function getAirtableSchema() {
  // Check for environment variables
  if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
    console.error('Error: AIRTABLE_API_KEY and AIRTABLE_BASE_ID must be set in environment variables');
    process.exit(1);
  }

  // Initialize Airtable
  const base = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY,
  }).base(process.env.AIRTABLE_BASE_ID as string);

  try {
    // Define known table names (you can add more as needed)
    const tableNames = ['Swarms']; // Add other table names you know exist
    
    // Create a schema object to store all table structures
    const schema: Record<string, any> = {};
    
    // Process each table
    for (const tableName of tableNames) {
      console.log(`Processing table: ${tableName}`);
      
      try {
        // Get table schema
        const tableSchema = {
          name: tableName,
          fields: [] as Array<{
            name: string;
            type: string;
          }>,
          records: [] as any[],
        };
        
        // Get records to understand the structure
        const records = await base(tableName).select({ maxRecords: 5 }).all();
        
        if (records.length > 0) {
          // Extract field names from the first record
          const firstRecord = records[0];
          const fieldNames = Object.keys(firstRecord.fields);
          
          // Add fields to schema
          fieldNames.forEach(fieldName => {
            const value = firstRecord.fields[fieldName];
            let type = typeof value;
            
            // Try to determine more specific types
            if (Array.isArray(value)) {
              type = 'array';
            } else if (value instanceof Date) {
              type = 'date';
            }
            
            tableSchema.fields.push({
              name: fieldName,
              type: type,
            });
          });
          
          // Add sample records
          tableSchema.records = records.map(record => ({
            id: record.id,
            fields: record.fields,
          }));
        }
        
        // Add table schema to the overall schema
        schema[tableName] = tableSchema;
      } catch (error) {
        console.error(`Error processing table ${tableName}:`, error);
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
