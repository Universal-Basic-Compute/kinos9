import { NextResponse } from 'next/server';
import { getAllNews } from '@/app/services/airtable';

export async function GET() {
  try {
    const news = await getAllNews();
    return NextResponse.json({ news });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
