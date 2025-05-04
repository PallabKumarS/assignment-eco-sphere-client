/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { TIdea } from "@/types";
import { useEffect, useState } from "react";
import LoadingData from "@/components/shared/LoadingData";
import { getSingleIdea } from "@/services/IdeaService";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";

const SingleIdea = () => {
  const [idea, setIdea] = useState<TIdea>();
  const [isFetching, setIsFetching] = useState(true);
  const {ideaId} = useParams();

  useEffect(() => {
    const fetchIdea = async () => {
      const res = await getSingleIdea(ideaId as string);
      setIdea(res?.data);
    };

    fetchIdea();
    setIsFetching(false);
  }, [ideaId]);

  if (isFetching) return <LoadingData />;

  return (
    <div className="space-y-7 max-w-5xl mx-auto p-6">
        <div className="grid grid-cols-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-4 flex flex-col justify-between">
              <Image
                src={idea?.images?.[0] || '/placeholder.png'}
                alt={idea?.title || ''}
                className="w-full h-80 object-cover rounded-md mb-4"
                width={300}
                height={300}
            />
              <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2">
                      {idea?.title}
                  </h2>
                  <p className="text-sm text-gray-600 mb-1">
                      <strong>Problem:</strong> {idea?.problem.slice(0, 60)}...
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                      <strong>Solution:</strong> {idea?.solution.slice(0, 60)}...
                  </p>
                  <p className="text-sm text-gray-500 mb-1">
                      <strong>Categories:</strong>{' '}
                      {idea?.categories.map((cat: any) => cat.name).join(', ')}
                  </p>
                  <p className="text-sm mb-1">
                      <strong>Price:</strong> {idea?.isPaid ? `$${idea?.price.toFixed(2)}` : 'Free'}
                  </p>
                  <p className="text-sm mb-3">
                      <strong>Status:</strong> {idea?.status}
                  </p>
                  {/* Icons Section */}
                  <div className="flex items-center space-x-6 mt-4 text-gray-600">
                    <button className="flex items-center hover:text-green-600">
                      <ThumbsUp className="w-5 h-5 mr-1" />
                      <span>Upvote</span>
                    </button>
                    <button className="flex items-center hover:text-red-600">
                      <ThumbsDown className="w-5 h-5 mr-1" />
                      <span>Downvote</span>
                    </button>
                    <button className="flex items-center hover:text-blue-600">
                      <MessageSquare className="w-5 h-5 mr-1" />
                      <span>Comment</span>
                    </button>
                  </div>                  
              </div>
          </div>
        </div>
    </div>
  );
};

export default SingleIdea;
