/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { TIdea, TMeta } from "@/types";
import { useEffect, useState } from "react";
import LoadingData from "@/components/shared/LoadingData";
import { PaginationComponent } from "@/components/shared/Pagination";
import { getAllIdeas } from "@/services/IdeaService";
import Image from "next/image";
import Link from "next/link";

const AllIdeas = ({ query }: { query: Record<string, unknown> }) => {
  const [ideas, setIdeas] = useState<TIdea[]>([]);
  const [meta, setMeta] = useState<TMeta>();
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchIdeas = async () => {
      const res = await getAllIdeas(query);
      setIdeas(res?.data);
      setMeta(res?.meta);
    };

    fetchIdeas();
    setIsFetching(false);
  }, [query]);

  if (isFetching) return <LoadingData />;

  return (
    <div className="space-y-7 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {ideas?.map((idea) => (
          <div
            key={idea.id}
            className="bg-white rounded-xl shadow-md overflow-hidden p-4 flex flex-col justify-between"
          >
            <Image
              src={idea.images?.[0] || "/placeholder.png"}
              alt={idea.title}
              className="w-full h-40 object-cover rounded-md mb-4"
              width={300}
              height={300}
            />
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-2">
                <Link
                  href={`/ideas/${idea.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {idea.title}
                </Link>
              </h2>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Problem:</strong> {idea.problem.slice(0, 60)}...
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Solution:</strong> {idea.solution.slice(0, 60)}...
              </p>
              <p className="text-sm text-gray-500 mb-1">
                <strong>Categories:</strong>{" "}
                {idea.categories.map((cat: any) => cat.name).join(", ")}
              </p>
              <p className="text-sm mb-1">
                <strong>Price:</strong>{" "}
                {idea.isPaid
                  ? `$${(idea.price as number).toFixed(2)}`
                  : "Free"}
              </p>
              <p className="text-sm mb-3">
                <strong>Status:</strong> {idea.status}
              </p>
            </div>
          </div>
        ))}
      </div>

      <PaginationComponent meta={meta} />
    </div>
  );
};

export default AllIdeas;
