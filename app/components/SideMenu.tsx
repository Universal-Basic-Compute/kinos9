import React from 'react';
import Link from 'next/link';
import { getSwarms } from '../services/airtable';

export async function SideMenu() {
  const swarms = await getSwarms();
  
  return (
    <aside className="w-64 bg-gray-100 h-screen p-4 shadow-md">
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Dashboard</h2>
        <ul className="space-y-1">
          <li>
            <Link 
              href="/"
              className="block p-2 hover:bg-gray-200 rounded text-gray-700 hover:text-gray-900"
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              href="/news"
              className="block p-2 hover:bg-gray-200 rounded text-gray-700 hover:text-gray-900"
            >
              News
            </Link>
          </li>
        </ul>
      </div>
      
      <h2 className="text-xl font-semibold mb-2">Swarms</h2>
      <ul className="space-y-1">
        {swarms.map((swarm) => (
          <li key={swarm.id}>
            <Link 
              href={`/swarms/${swarm.id}`}
              className="block p-2 hover:bg-gray-200 rounded text-gray-700 hover:text-gray-900"
            >
              {swarm.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
