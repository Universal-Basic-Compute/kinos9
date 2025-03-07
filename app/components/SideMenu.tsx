import React from 'react';
import Link from 'next/link';
import { getSwarms } from '../services/airtable';

export async function SideMenu() {
  const swarms = await getSwarms();
  
  return (
    <aside className="w-64 bg-gray-100 h-screen p-4">
      <h2 className="text-xl font-semibold mb-4">Swarms</h2>
      <ul className="space-y-2">
        {swarms.map((swarm) => (
          <li key={swarm.id}>
            <Link 
              href={`/swarms/${swarm.id}`}
              className="block p-2 hover:bg-gray-200 rounded"
            >
              {swarm.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
