"use client";
import { useAppContext } from "@/providers/ContextProvider";
import { TComment } from "@/types";
import { useState } from "react";

type Props = {
  comment: TComment;
  onReply: (parentId: string, text: string) => void;
  onUpdate: (commentId: string, text: string) => void;
  onDelete: (commentId: string) => void;
  currentUserId: string;
};

export default function CommentItem({
  comment,
  onReply,
  onUpdate,
  onDelete,
  currentUserId,
}: Props) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const { user } = useAppContext();

  const isAuthor = comment.user.id === currentUserId;

  const handleReply = () => {
    onReply(comment.id, replyText);
    setReplyText("");
    setShowReply(false);
  };

  const handleUpdate = () => {
    onUpdate(comment.id, editText);
    setIsEditing(false);
  };

  return (
    <div className="border-l-2 pl-4 my-4">
      <div className="text-sm">
        <span className="font-semibold">{comment.user.name}</span>:{" "}
        {isEditing ? (
          <>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="border p-1 w-full"
            />
            <button onClick={handleUpdate} className="text-blue-600">
              Save
            </button>
          </>
        ) : (
          <span>{comment.content}</span>
        )}
      </div>
      <div className="text-xs text-gray-500">
        {user?.role === "MEMBER" && (
          <button onClick={() => setShowReply(!showReply)}>Reply</button>
        )}

        {isAuthor && (
          <>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="ml-2 text-yellow-600"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(comment.id)}
              className="ml-2 text-red-600"
            >
              Delete
            </button>
          </>
        )}
      </div>

      {showReply && (
        <div className="ml-4 mt-2">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="border p-1 w-full"
          />
          <button onClick={handleReply} className="text-blue-600 mt-1">
            Submit
          </button>
        </div>
      )}

      {comment.replies?.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          onReply={onReply}
          onUpdate={onUpdate}
          onDelete={onDelete}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
}
