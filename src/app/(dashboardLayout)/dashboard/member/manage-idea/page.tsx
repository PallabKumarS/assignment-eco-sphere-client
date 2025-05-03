'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';

type Idea = {
  id: string;
  title: string;
  description: string;
  images: string[];
  categories: Category[];
};

type Category = {
  id: string;
  name: string;
};

const IdeaPage = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchIdeasAndCategories = async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('accessToken='))
          ?.split('=')[1];

        if (!token) {
          console.error('Access token not found');
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [ideasRes, categoriesRes] = await Promise.all([
          fetch('http://localhost:5000/api/ideas', { headers }),
          fetch('http://localhost:5000/api/categories', { headers }),
        ]);

        const ideasData = await ideasRes.json();
        const categoriesData = await categoriesRes.json();

        setIdeas(ideasData?.data);
        setCategories(categoriesData?.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching ideas or categories', err);
      }
    };

    fetchIdeasAndCategories();
  }, []);

  const handleCreateIdea = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title'),
      problem: formData.get('problem'),
      solution: formData.get('solution'),
      description: formData.get('description'),
      images: (formData.get('images') as string).split(','),
      isPaid: formData.get('isPaid') === 'on',
      price: parseFloat(formData.get('price') as string),
      categories: Array.from(formData.getAll('categories')),
    };

    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('accessToken='))
      ?.split('=')[1];

    const res = await fetch('http://localhost:5000/api/ideas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const newIdea = await res.json();
      setIdeas((prev) => [...prev, newIdea.data]);
      setShowModal(false);
    }
  };

  const getCategoryNamesFromIdea = (ids: Category[]) => {
    return ids.map((cat) => cat.name).join(', ');
  };
  const handleEdit = (id: any) => {
    console.log(id);
  }
  const handleDelete = (id: string) => {}

  if (loading) return <p className="text-center mt-8">Loading ideas...</p>;

  return (
    <div className="p-6 overflow-x-auto">
      <button className="px-3 py-1 mb-8 bg-blue-500 text-white rounded hover:bg-blue-600">Create An Idea</button>
      <table className="min-w-full bg-white rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="py-3 px-4">Title</th>
            <th className="py-3 px-4">Description</th>
            <th className="py-3 px-4">Categories</th>
            <th className="py-3 px-4">Image</th>
            <th className="py-3 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {ideas?.map((idea) => (
            <tr key={idea.id} className="border-t">
              <td className="py-2 px-4">{idea.title}</td>
              <td className="py-2 px-4 line-clamp-2">{idea.description}</td>
              <td className="py-2 px-4">{getCategoryNamesFromIdea(idea.categories)}</td>
              <td className="py-2 px-4">
                <Image
                  src={idea.images[0]}
                  alt={idea.title}
                  className="w-20 h-20 object-cover rounded"
                  width={300}
                  height={300}
                />
              </td>
              <td className="py-2 px-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleEdit(idea)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(idea.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IdeaPage;

