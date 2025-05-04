/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { TIdea } from "@/types";
import { useEffect, useState } from "react";
import LoadingData from "@/components/shared/LoadingData";
import { getSingleIdea } from "@/services/IdeaService";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ThumbsUp, ThumbsDown, MessageSquare, X } from "lucide-react";
import { toast } from "sonner";
import { voteIdea } from "@/services/VoteService";
import { commentIdea } from "@/services/CommentService";

const SingleIdea = () => {
  const [idea, setIdea] = useState<TIdea>();
  const [isFetching, setIsFetching] = useState(true);
  const {ideaId} = useParams();
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    const fetchIdea = async () => {
      const res = await getSingleIdea(ideaId as string);
      setIdea(res?.data);
    };

    fetchIdea();
    setIsFetching(false);
  }, [ideaId]);

  const handleVote = async (ideaId: string, voteType: string) => {
    const toastId = toast.loading("Upvoting idea...");

    try {
      const res = await voteIdea(ideaId, voteType);

      if (res.success) {
        toast.success(res.message, {
          id: toastId,
        });
      } else {
        toast.error(res.message, {
          id: toastId,
        });
      }
    } catch (error: any) {
      toast.error(error.message);
      console.error(error);
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Commenting idea...");
    setCommentText("");
    setIsCommentModalOpen(false);

    try {
      const res = await commentIdea(ideaId as string, commentText)

      if (res.success) {
        toast.success(res.message, {
          id: toastId,
        });
      } else {
        toast.error(res.message, {
          id: toastId,
        });
      }
    } catch (error: any) {
      toast.error(error.message);
      console.error(error);
    }    
  };

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
                    <button onClick={() => handleVote(idea?.id as string, "UPVOTE")} className="flex items-center hover:text-green-600">
                      <ThumbsUp className="w-5 h-5 mr-1" />
                      <span>Upvote</span>
                    </button>
                    <button onClick={() => handleVote(idea?.id as string, "DOWNVOTE")} className="flex items-center hover:text-red-600">
                      <ThumbsDown className="w-5 h-5 mr-1" />
                      <span>Downvote</span>
                    </button>
                    <button
                      onClick={() => setIsCommentModalOpen(true)}
                      className="flex items-center hover:text-blue-600"
                    >
                      <MessageSquare className="w-5 h-5 mr-1" />
                      <span>Comment</span>
                    </button>
                  </div>                  
              </div>
          </div>
        </div>
      {/* Comment Modal */}
      {isCommentModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
              onClick={() => setIsCommentModalOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold mb-4">Add Comment</h3>
            <form onSubmit={handleCommentSubmit}>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                rows={4}
                placeholder="Write your comment here..."
                required
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}        
    </div>
  );
};

export default SingleIdea;
