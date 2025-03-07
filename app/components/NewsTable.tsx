'use client';

import React, { useState } from 'react';
import { updateNewsItem, deleteNewsItem } from '@/app/services/airtable';
import { format } from 'date-fns';

interface NewsItem {
  id: string;
  newsId: string;
  title: string;
  content: string;
  date: string;
  swarmId: string;
}

interface NewsTableProps {
  initialNews: NewsItem[];
}

export default function NewsTable({ initialNews }: NewsTableProps) {
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<NewsItem>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [expandedContent, setExpandedContent] = useState<string | null>(null);

  const handleEdit = (item: NewsItem) => {
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSave = async () => {
    if (!editingId || !editForm) return;
    
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      await updateNewsItem(editingId, editForm);
      
      // Update the local state
      setNews(prev => 
        prev.map(item => 
          item.id === editingId ? { ...item, ...editForm } : item
        )
      );
      
      setSuccessMessage('News item updated successfully!');
      setEditingId(null);
      setEditForm({});
    } catch (error) {
      console.error('Error updating news item:', error);
      setErrorMessage('Failed to update news item. Please try again.');
    } finally {
      setIsLoading(false);
      
      // Clear success message after 3 seconds
      if (successMessage) {
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this news item?')) return;
    
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      await deleteNewsItem(id);
      
      // Update the local state
      setNews(prev => prev.filter(item => item.id !== id));
      
      setSuccessMessage('News item deleted successfully!');
    } catch (error) {
      console.error('Error deleting news item:', error);
      setErrorMessage('Failed to delete news item. Please try again.');
    } finally {
      setIsLoading(false);
      
      // Clear success message after 3 seconds
      if (successMessage) {
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    }
  };

  const toggleContentExpand = (id: string) => {
    if (expandedContent === id) {
      setExpandedContent(null);
    } else {
      setExpandedContent(id);
    }
  };

  if (news.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500 mb-4">No news items found.</p>
        <p className="text-sm text-gray-400">Click the "Add News" button to create your first news item.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {(successMessage || errorMessage) && (
        <div className={`p-4 ${successMessage ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {successMessage || errorMessage}
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Swarm</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {news.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                {editingId === item.id ? (
                  // Edit mode
                  <>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        name="title"
                        value={editForm.title || ''}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="date"
                        name="date"
                        value={editForm.date ? new Date(editForm.date).toISOString().split('T')[0] : ''}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        name="swarmId"
                        value={editForm.swarmId || ''}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <textarea
                        name="content"
                        value={editForm.content || ''}
                        onChange={handleChange}
                        rows={3}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md mr-2 transition-colors"
                      >
                        {isLoading ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded-md transition-colors"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  // View mode
                  <>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {format(new Date(item.date), 'MMM d, yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{item.swarmId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div 
                        className={`text-sm text-gray-500 ${expandedContent === item.id ? '' : 'line-clamp-2'} cursor-pointer`}
                        onClick={() => toggleContentExpand(item.id)}
                      >
                        {item.content}
                      </div>
                      {item.content.length > 100 && (
                        <button 
                          onClick={() => toggleContentExpand(item.id)} 
                          className="text-xs text-blue-500 mt-1"
                        >
                          {expandedContent === item.id ? 'Show less' : 'Show more'}
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
