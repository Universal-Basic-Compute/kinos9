import React from 'react';
import { getAllNews } from '@/app/services/airtable';
import Link from 'next/link';
import NewsTable from '@/app/components/NewsTable';

export default async function NewsPage() {
  const news = await getAllNews();
  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">News</h1>
          <p className="text-gray-500 mt-1">{news.length} items found</p>
        </div>
        <Link 
          href="/news/new" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add News
        </Link>
      </div>
      
      <NewsTable initialNews={news} />
    </div>
  );
}
