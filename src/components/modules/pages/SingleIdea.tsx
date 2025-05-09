/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { TComment, TIdea } from "@/types";
import { useEffect, useState } from "react";
import LoadingData from "@/components/shared/LoadingData";
import { getSingleIdea } from "@/services/IdeaService";
import { useParams, useRouter } from "next/navigation";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { voteIdea } from "@/services/VoteService";
import {
  commentIdea,
  deleteComment,
  getAllComments,
  replyToComment,
  updateComment,
} from "@/services/CommentService";
import CommentItem from "@/components/shared/CommentItem";
import { buildCommentTree } from "@/lib/utils";
import { useAppContext } from "@/providers/ContextProvider";
import { Modal } from "@/components/shared/Modal";
import ImageSlider from "@/components/shared/ImageSlider";

const SingleIdea = () => {
  const [idea, setIdea] = useState<TIdea>();
  const [isFetching, setIsFetching] = useState(true);
  const { ideaId } = useParams();
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<TComment[]>([]);
  const [hasPurchased, setHasPurchased] = useState<boolean>(false);
  const { user } = useAppContext();
  const router = useRouter();

  const fetchComments = async () => {
    const res = await getAllComments(ideaId as string); // create this service
    setComments(res?.data || []);
  };

  useEffect(() => {
    const fetchIdea = async () => {
      try {
        const res = await getSingleIdea(ideaId as string);
        setIdea(res?.data);
      } catch (error) {
        console.error("Error fetching idea:", error);
        toast.error("Failed to load idea details");
      }
    };

    fetchIdea();
  }, [ideaId]);

  useEffect(() => {
    fetchComments();
  }, [ideaId]);

  useEffect(() => {
    if (!idea || !user) return;

    // Check if current user has purchased this idea
    if (idea.authorId === user.id) {
      setHasPurchased(true);
      setIsFetching(false);
    } else if (
      idea.isPaid &&
      idea.paidIdeaPurchase &&
      idea.paidIdeaPurchase.length > 0
    ) {
      const purchased = idea.paidIdeaPurchase.some((purchase) => {
        return purchase.userId === user.id;
      });
      setHasPurchased(purchased);
      setIsFetching(false);
    } else {
      setIsFetching(false);
    }
  }, [idea, user]);

  // after fetchComments:
  const treeComments = buildCommentTree(comments);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Commenting idea...");
    setCommentText("");
    setIsCommentModalOpen(false);

    try {
      const res = await commentIdea(ideaId as string, commentText);

      if (res.success) {
        toast.success(res.message, {
          id: toastId,
        });
        await fetchComments();
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

  // handleReply
  const handleReply = async (parentId: string, text: string) => {
    const res = await replyToComment(parentId as string, text);
    if (res.success) {
      const updated = await getAllComments(ideaId as string);
      setComments(updated.data);
      await fetchComments();
    }
  };

  // handleUpdate
  const handleUpdate = async (commentId: string, newText: string) => {
    // Create `updateComment` service
    const res = await updateComment(commentId, newText);
    if (res.success) {
      const updated = await getAllComments(ideaId as string);
      setComments(updated.data);
      await fetchComments();
    }
  };

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
  };

  const handleDelete = async (commentId: string) => {
    const toastId = toast.loading("Deleting comment...");

    try {
      const res = await deleteComment(commentId);

      if (res.success) {
        toast.success(res.message, { id: toastId });

        // Refresh comment list locally
        const updated = comments.filter((comment) => comment.id !== commentId);
        setComments(updated);
        await fetchComments();
      } else {
        toast.error(res.message || "Failed to delete", { id: toastId });
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  if (!isFetching && !hasPurchased) {
    toast.error("You need to purchase this idea to view it.");
    router.push("/ideas");
  }

  return (
    <div className="space-y-7 max-w-5xl mx-auto p-6">
      <div className="grid grid-cols-1">
        <div className="bg-base-300 rounded-xl shadow-md overflow-hidden p-4 flex flex-col justify-between">
          {isFetching && <LoadingData />}

          {/* image slider here  */}
          <ImageSlider variant="detail" images={idea ? idea?.images : []} />

          <div className="flex-1">
            <h2 className="text-xl font-bold mb-2">{idea?.title}</h2>
            <p className="text-sm  mb-1">
              <strong>Problem:</strong> {idea?.problem}
            </p>
            <p className="text-sm  mb-1">
              <strong>Solution:</strong> {idea?.solution}
            </p>
            <p className="text-sm text-gray-500 mb-1">
              <strong>Categories:</strong>{" "}
              {idea?.categories.map((cat: any) => cat.name).join(", ")}
            </p>
            <p className="text-sm mb-1">
              <strong>Price:</strong>{" "}
              {idea?.isPaid ? `$${(idea.price as number).toFixed(2)}` : "Free"}
            </p>
            <p className="text-sm mb-3">
              <strong>Status:</strong> {idea?.status}
            </p>
            {/* Icons Section */}
            <div className="flex items-center space-x-4 mt-4">
              <p className="">
                {idea?.votes?.filter((vote) => {
                  return vote.type === "UPVOTE";
                })?.length || 0}
              </p>
              <button
                onClick={() => handleVote(idea?.id as string, "UPVOTE")}
                className="flex items-center hover:text-green-600"
              >
                <ThumbsUp className="w-5 h-5 mr-1" />
                <span>Upvote</span>
              </button>

              <p>
                {idea?.votes?.filter((vote) => {
                  return vote.type === "DOWNVOTE";
                })?.length || 0}
              </p>
              <button
                onClick={() => handleVote(idea?.id as string, "DOWNVOTE")}
                className="flex items-center hover:text-red-600"
              >
                <ThumbsDown className="w-5 h-5 mr-1" />
                <span>Downvote</span>
              </button>

              {/* Comment Modal */}
              <Modal
                open={isCommentModalOpen}
                onOpenChange={setIsCommentModalOpen}
                title="Comment Form"
                content={
                  <>
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
                  </>
                }
                trigger={
                  <button className="flex items-center hover:text-blue-600">
                    <MessageSquare className="w-5 h-5 mr-1" />
                    <span>Comment</span>
                  </button>
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Display all comments  */}
      <div className="mt-6">
        {comments.length > 0 ? (
          <h3 className="text-lg font-semibold mb-4">Comments</h3>
        ) : (
          <p className="text-gray-500">No comments available.</p>
        )}
        {treeComments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReply={handleReply}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            currentUserId={user?.id as string}
          />
        ))}
      </div>
    </div>
  );
};

export default SingleIdea;
