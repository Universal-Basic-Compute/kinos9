import React from 'react';
import { getSwarms } from '@/app/services/airtable';
import Link from 'next/link';

export default async function SwarmsPage() {
  const swarms = await getSwarms(true);
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Swarms</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {swarms.map((swarm) => (
          <Link 
            key={swarm.id} 
            href={`/swarms/${swarm.id}`}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{swarm.name}</h2>
              {swarm.shortDescription && (
                <p className="text-gray-600 mb-4 line-clamp-2">{swarm.shortDescription}</p>
              )}
              <div className="flex justify-between text-sm">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {swarm.swarmType || 'Unknown Type'}
                </span>
                {swarm.revenueShare && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                    {swarm.revenueShare}% Revenue Share
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
