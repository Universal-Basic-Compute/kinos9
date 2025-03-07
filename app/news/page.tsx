import React from 'react';
import { getAllNews } from '@/app/services/airtable';
import Link from 'next/link';
import NewsTable from '@/app/components/NewsTable';

export default async function NewsPage() {
  const news = await getAllNews();
  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">News</h1>
        <Link 
          href="/news/new" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          Add News
        </Link>
      </div>
      
      <NewsTable initialNews={news} />
    </div>
  );
}
