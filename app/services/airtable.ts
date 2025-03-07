import Airtable from 'airtable';
import { v4 as uuidv4 } from 'uuid';

// Initialize Airtable
const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID as string);

export async function getSwarms(fullData = false) {
  try {
    const records = await base('Swarms').select().all();
    return records.map(record => {
      if (fullData) {
        return {
          id: record.id,
          swarmId: record.get('swarmId') as string,
          name: record.get('name') as string,
          // Add other fields as needed
        };
      } else {
        return {
          id: record.id,
          name: record.get('name') as string,
        };
      }
    });
  } catch (error) {
    console.error('Error fetching swarms from Airtable:', error);
    return [];
  }
}

export async function getSwarmDetails(id: string) {
  try {
    // Get the swarm record
    const swarmRecord = await base('Swarms').find(id);
    if (!swarmRecord) return null;
    
    const swarm = {
      id: swarmRecord.id,
      swarmId: swarmRecord.get('swarmId') as string,
      name: swarmRecord.get('name') as string,
      image: swarmRecord.get('image') as string,
      pool: swarmRecord.get('pool') as string,
      weeklyRevenue: swarmRecord.get('weeklyRevenue') as number,
      totalRevenue: swarmRecord.get('totalRevenue') as number,
      gallery: swarmRecord.get('gallery') as string,
      tags: swarmRecord.get('tags') as string,
      swarmType: swarmRecord.get('swarmType') as string,
      multiple: swarmRecord.get('multiple') as number,
      revenueShare: swarmRecord.get('revenueShare') as number,
      wallet: swarmRecord.get('wallet') as string,
      description: swarmRecord.get('description') as string,
      shortDescription: swarmRecord.get('shortDescription') as string,
      hotWallet: swarmRecord.get('hotWallet') as string,
      balance: swarmRecord.get('balance') as number,
      secondaryMarketAvailable: swarmRecord.get('secondaryMarketAvailable') as boolean,
    };
    
    // Get related services
    const servicesRecords = await base('Services')
      .select({
        filterByFormula: `{swarmId} = "${swarm.swarmId}"`,
      })
      .all();
    
    const services = servicesRecords.map(record => ({
      id: record.id,
      serviceId: record.get('serviceId') as string,
      name: record.get('name') as string,
      description: record.get('description') as string,
      fullDescription: record.get('fullDescription') as string,
      basePrice: record.get('basePrice') as number,
      categories: record.get('categories') as string,
      computePerTask: record.get('computePerTask') as number,
      averageCompletionTime: record.get('averageCompletionTime') as string,
      capabilities: record.get('capabilities') as string,
      serviceType: record.get('serviceType') as string,
      banner: record.get('banner') as string,
      activeSubscriptions: record.get('activeSubscriptions') as number,
    }));
    
    // Get related news
    const newsRecords = await base('News')
      .select({
        filterByFormula: `{swarmId} = "${swarm.swarmId}"`,
        sort: [{ field: 'date', direction: 'desc' }],
      })
      .all();
    
    const news = newsRecords.map(record => ({
      id: record.id,
      newsId: record.get('newsId') as string,
      title: record.get('title') as string,
      content: record.get('content') as string,
      date: record.get('date') as string,
    }));
    
    // Get related thoughts
    const thoughtsRecords = await base('Thoughts')
      .select({
        filterByFormula: `{swarmId} = "${swarm.swarmId}"`,
        sort: [{ field: 'createdAt', direction: 'desc' }],
      })
      .all();
    
    const thoughts = thoughtsRecords.map(record => ({
      id: record.id,
      thoughtId: record.get('thoughtId') as string,
      content: record.get('content') as string,
      createdAt: record.get('createdAt') as string,
      type: record.get('type') as string,
      context: record.get('context') as string,
    }));
    
    // Get related missions (where this swarm is the lead)
    const missionsRecords = await base('Missions')
      .select({
        filterByFormula: `{leadSwarm} = "${swarm.swarmId}"`,
        sort: [{ field: 'createdAt', direction: 'desc' }],
      })
      .all();
    
    const missions = missionsRecords.map(record => ({
      id: record.id,
      missionId: record.get('missionId') as string,
      title: record.get('title') as string,
      description: record.get('description') as string,
      objective: record.get('objective') as string,
      priority: record.get('priority') as string,
      status: record.get('status') as string,
      createdAt: record.get('createdAt') as string,
      updatedAt: record.get('updatedAt') as string,
      dueDate: record.get('dueDate') as string,
      tags: record.get('tags') as string,
    }));
    
    // Get redistributions
    const redistributionsRecords = await base('Redistributions')
      .select({
        filterByFormula: `{swarmId} = "${swarm.swarmId}"`,
        sort: [{ field: 'date', direction: 'desc' }],
      })
      .all();
    
    const redistributions = redistributionsRecords.map(record => ({
      id: record.id,
      wallet: record.get('wallet') as string,
      token: record.get('token') as string,
      amount: record.get('amount') as number,
      date: record.get('date') as string,
    }));
    
    return {
      swarm,
      services,
      news,
      thoughts,
      missions,
      redistributions,
    };
  } catch (error) {
    console.error('Error fetching swarm details from Airtable:', error);
    return null;
  }
}

// New functions for News management

export async function getAllNews() {
  try {
    const records = await base('News')
      .select({
        sort: [{ field: 'date', direction: 'desc' }],
      })
      .all();
    
    return records.map(record => ({
      id: record.id,
      newsId: record.get('newsId') as string,
      title: record.get('title') as string,
      content: record.get('content') as string,
      date: record.get('date') as string,
      swarmId: record.get('swarmId') as string,
    }));
  } catch (error) {
    console.error('Error fetching news from Airtable:', error);
    return [];
  }
}

export async function createNewsItem(data: {
  title: string;
  content: string;
  date: string;
  swarmId: string;
}) {
  try {
    const newsId = uuidv4();
    
    await base('News').create({
      newsId,
      title: data.title,
      content: data.content,
      date: data.date,
      swarmId: data.swarmId,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error creating news item in Airtable:', error);
    throw error;
  }
}

export async function updateNewsItem(id: string, data: Partial<{
  title: string;
  content: string;
  date: string;
  swarmId: string;
}>) {
  try {
    await base('News').update(id, {
      ...(data.title && { title: data.title }),
      ...(data.content && { content: data.content }),
      ...(data.date && { date: data.date }),
      ...(data.swarmId && { swarmId: data.swarmId }),
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating news item in Airtable:', error);
    throw error;
  }
}

export async function deleteNewsItem(id: string) {
  try {
    await base('News').destroy(id);
    return { success: true };
  } catch (error) {
    console.error('Error deleting news item from Airtable:', error);
    throw error;
  }
}
