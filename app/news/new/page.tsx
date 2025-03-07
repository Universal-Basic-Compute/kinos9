'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createNewsItem, getSwarms } from '@/app/services/airtable';
import Link from 'next/link';

interface Swarm {
  id: string;
  swarmId: string;
  name: string;
}

export default function NewNewsPage() {
  const router = useRouter();
  const [swarms, setSwarms] = useState<Swarm[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    swarmId: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSwarms = async () => {
      try {
        const swarmsData = await getSwarms(true); // true to get full swarm data
        setSwarms(swarmsData);
        if (swarmsData.length > 0) {
          setFormData(prev => ({ ...prev, swarmId: swarmsData[0].swarmId }));
        }
      } catch (error) {
        console.error('Error fetching swarms:', error);
      }
    };

    fetchSwarms();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await createNewsItem(formData);
      router.push('/news');
    } catch (error) {
      console.error('Error creating news item:', error);
      setError('Failed to create news item. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Add News</h1>
        <Link 
          href="/news" 
          className="text-blue-500 hover:text-blue-700"
        >
          Back to News
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="date" className="block text-gray-700 font-medium mb-2">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="swarmId" className="block text-gray-700 font-medium mb-2">
            Swarm
          </label>
          <select
            id="swarmId"
            name="swarmId"
            value={formData.swarmId}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {swarms.map(swarm => (
              <option key={swarm.id} value={swarm.swarmId}>
                {swarm.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="content" className="block text-gray-700 font-medium mb-2">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={6}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => router.push('/news')}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md mr-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create News'}
          </button>
        </div>
      </form>
    </div>
  );
}
