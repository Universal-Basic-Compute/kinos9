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
    // Get all tables in the base
    const tables = await base.tables();
    
    // Create a schema object to store all table structures
    const schema: Record<string, any> = {};
    
    // Process each table
    for (const table of tables) {
      console.log(`Processing table: ${table.name}`);
      
      // Get table schema
      const tableSchema = {
        id: table.id,
        name: table.name,
        fields: [] as Array<{
          id: string;
          name: string;
          type: string;
          options?: any;
        }>,
        records: [] as any[],
      };
      
      // Get field information
      for (const field of table.fields) {
        tableSchema.fields.push({
          id: field.id,
          name: field.name,
          type: field.type,
          options: field.options,
        });
      }
      
      // Get a sample of records to understand the data
      try {
        const records = await table.select({ maxRecords: 5 }).firstPage();
        tableSchema.records = records.map(record => ({
          id: record.id,
          fields: record.fields,
        }));
      } catch (error) {
        console.error(`Error fetching records for table ${table.name}:`, error);
        tableSchema.records = [];
      }
      
      // Add table schema to the overall schema
      schema[table.name] = tableSchema;
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
