'use client';

import React, { useState, useEffect } from 'react';
import { getSwarmDetails, updateSwarmDescription } from '@/app/services/airtable';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SwarmDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [swarmDetails, setSwarmDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Get the ID directly from params
  const id = params.id;

  // Fetch swarm details
  useEffect(() => {
    async function fetchData() {
      try {
        const details = await getSwarmDetails(id);
        setSwarmDetails(details);
        if (details) {
          setEditedDescription(details.swarm.description || '');
        }
      } catch (error) {
        console.error('Error fetching swarm details:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [id]);

  const handleEditDescription = () => {
    setIsEditingDescription(true);
  };

  const handleCancelEdit = () => {
    setIsEditingDescription(false);
    setEditedDescription(swarmDetails.swarm.description || '');
  };

  const handleSaveDescription = async () => {
    if (!swarmDetails) return;
    
    setIsSaving(true);
    try {
      await updateSwarmDescription(swarmDetails.swarm.id, editedDescription);
      
      // Update local state
      setSwarmDetails({
        ...swarmDetails,
        swarm: {
          ...swarmDetails.swarm,
          description: editedDescription
        }
      });
      
      setIsEditingDescription(false);
      setSuccessMessage('Description updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error updating description:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
        <div className="h-64 bg-gray-200 rounded mb-8"></div>
      </div>
    );
  }
  
  if (!swarmDetails) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Swarm not found</h1>
        <Link href="/" className="text-blue-500 hover:underline">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8">
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-md">
          {successMessage}
        </div>
      )}
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{swarmDetails.swarm.name}</h1>
        <p className="text-gray-600 mb-4">{swarmDetails.swarm.shortDescription}</p>
        
        {swarmDetails.swarm.image && (
          <div className="mb-4">
            <img 
              src={swarmDetails.swarm.image} 
              alt={swarmDetails.swarm.name} 
              className="rounded-lg max-w-md"
            />
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700">Swarm Type</h3>
            <p>{swarmDetails.swarm.swarmType}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700">Revenue Share</h3>
            <p>{swarmDetails.swarm.revenueShare}%</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700">Weekly Revenue</h3>
            <p>${swarmDetails.swarm.weeklyRevenue?.toLocaleString() || '0'}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700">Total Revenue</h3>
            <p>${swarmDetails.swarm.totalRevenue?.toLocaleString() || '0'}</p>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-2xl font-semibold">Description</h2>
            {!isEditingDescription && (
              <button 
                onClick={handleEditDescription}
                className="text-blue-500 hover:text-blue-700 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit
              </button>
            )}
          </div>
          
          {isEditingDescription ? (
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                rows={10}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="flex justify-end mt-3">
                <button
                  onClick={handleCancelEdit}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveDescription}
                  disabled={isSaving}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="whitespace-pre-line">{swarmDetails.swarm.description}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Services Section */}
      {swarmDetails.services.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {swarmDetails.services.map(service => (
              <div key={service.serviceId} className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                <p className="text-gray-600 mb-3">{service.description}</p>
                <div className="flex justify-between">
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    ${service.basePrice}
                  </span>
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                    {service.serviceType}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* News Section */}
      {swarmDetails.news.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Latest News</h2>
          <div className="space-y-4">
            {swarmDetails.news.map(item => (
              <div key={item.newsId} className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm mb-2">{new Date(item.date).toLocaleDateString()}</p>
                <p className="whitespace-pre-line">{item.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Thoughts Section */}
      {swarmDetails.thoughts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Thoughts</h2>
          <div className="space-y-4">
            {swarmDetails.thoughts.map(thought => (
              <div key={thought.thoughtId} className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="whitespace-pre-line">{thought.content}</p>
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-500">
                    {new Date(thought.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">
                    {thought.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Missions Section */}
      {swarmDetails.missions.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Missions</h2>
          <div className="space-y-4">
            {swarmDetails.missions.map(mission => (
              <div key={mission.missionId} className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between mb-2">
                  <h3 className="text-xl font-semibold">{mission.title}</h3>
                  <span className={`text-sm px-2 py-1 rounded ${
                    mission.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    mission.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {mission.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{mission.description}</p>
                <p className="text-sm text-gray-500">Due: {mission.dueDate ? new Date(mission.dueDate).toLocaleDateString() : 'No due date'}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Redistributions Section */}
      {swarmDetails.redistributions.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Redistributions</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-2 px-4 border-b text-left">Date</th>
                  <th className="py-2 px-4 border-b text-left">Wallet</th>
                  <th className="py-2 px-4 border-b text-left">Token</th>
                  <th className="py-2 px-4 border-b text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {swarmDetails.redistributions.map((redist, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="py-2 px-4 border-b">{new Date(redist.date).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border-b font-mono text-sm">{redist.wallet.substring(0, 6)}...{redist.wallet.substring(redist.wallet.length - 4)}</td>
                    <td className="py-2 px-4 border-b">{redist.token}</td>
                    <td className="py-2 px-4 border-b text-right">{redist.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
