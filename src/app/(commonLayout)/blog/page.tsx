import React from "react";

const blogPosts = [
  {
    id: 1,
    title: "10 Ways to Reduce Plastic Waste in Your Daily Life",
    author: "Jane Doe",
    date: "April 25, 2025",
    summary:
      "Discover simple and effective strategies to cut down plastic usage and embrace a more sustainable lifestyle.",
  },
  {
    id: 2,
    title: "The Future of Renewable Energy: Trends to Watch",
    author: "John Smith",
    date: "March 18, 2025",
    summary:
      "Explore the most promising innovations in solar, wind, and other renewable energy sources reshaping our world.",
  },
  {
    id: 3,
    title: "Community Gardens: Growing Sustainability Together",
    author: "Emma Lee",
    date: "February 10, 2025",
    summary:
      "Learn how community-driven gardening projects are improving food access and environmental awareness.",
  },
];

const BlogPage = () => {
  return (
    <div className="bg-white min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-10 text-center">Our Blog</h1>

        <div className="grid gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h2 className="text-2xl font-semibold text-green-800 mb-2">{post.title}</h2>
              <p className="text-sm text-gray-500 mb-4">
                By {post.author} • {post.date}
              </p>
              <p className="text-gray-700">{post.summary}</p>
              <button className="mt-4 text-green-700 hover:underline">
                Read more →
              </button>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
