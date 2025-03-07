import Airtable from 'airtable';

// Initialize Airtable
const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID as string);

export async function getSwarms() {
  try {
    const records = await base('Swarms').select().all();
    return records.map(record => ({
      id: record.id,
      name: record.get('name') as string,
    }));
  } catch (error) {
    console.error('Error fetching swarms from Airtable:', error);
    return [];
  }
}
