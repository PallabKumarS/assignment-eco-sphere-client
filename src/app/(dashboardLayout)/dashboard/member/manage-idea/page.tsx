'use client';

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

  // const getCategoryNames = (ids: string[]) => {
  //   console.log(ids);
  //   return ids?.map((id) => categories.find((cat) => cat.id === id)?.name)
  //     .join(', ');
  // };
  const getCategoryNamesFromIdea = (ids: Category[]) => {
    return ids.map((cat) => cat.name).join(', ');
  };

  if (loading) return <p className="text-center mt-8">Loading ideas...</p>;

  return (
    <div className="p-6 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {ideas?.map((idea) => (
        <div key={idea.id} className="bg-white shadow rounded-xl p-5">
          <img
            src={idea.images[0]}
            alt={idea.title}
            className="w-full h-40 object-cover mb-4 rounded"
          />
          <h2 className="text-xl font-semibold mb-2">{idea.title}</h2>
          <p className="text-gray-600 mb-2 line-clamp-3">{idea.description}</p>
          <p className="text-sm text-gray-500">
            Categories: {getCategoryNamesFromIdea(idea.categories)}
          </p>
        </div>
      ))}
    </div>
  );
};

export default IdeaPage;

