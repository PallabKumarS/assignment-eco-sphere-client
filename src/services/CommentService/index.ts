/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getValidToken } from "@/lib/verifyToken";
import { revalidateTag } from "next/cache";

// Get all Comments
export const getAllComments = async (ideaId: string) => {
  try {
    const res = await fetch(`${process.env.BASE_API}/comments/${ideaId}`, {
      next: {
        tags: ["comments"],
      },
    });
    return await res.json();
  } catch (error: any) {
    return error;
  }
};

// Comment an idea
export const commentIdea = async (
  ideaId: string,
  commentData: string
): Promise<any> => {
  const token = await getValidToken();

  try {
    const res = await fetch(`${process.env.BASE_API}/comments/${ideaId}`, {
      method: "POST",
      body: JSON.stringify({ content: commentData }),
      headers: {
        "Content-type": "application/json",
        Authorization: token,
      },
    });

    revalidateTag("comments");

    return await res.json();
  } catch (error: any) {
    return error;
  }
};

// Update a comment
export const updateComment = async (
  commentId: string,
  updatedContent: string
): Promise<any> => {
  const token = await getValidToken();

  try {
    const res = await fetch(`${process.env.BASE_API}/comments/${commentId}`, {
      method: "PATCH",
      body: JSON.stringify({ content: updatedContent }),
      headers: {
        "Content-type": "application/json",
        Authorization: token,
      },
    });

    revalidateTag("comments"); // Optional if you're using ISR/SSG caching

    return await res.json();
  } catch (error: any) {
    return error;
  }
};

// Delete a comment
export const deleteComment = async (commentId: string): Promise<any> => {
  const token = await getValidToken();

  try {
    const res = await fetch(`${process.env.BASE_API}/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: token,
      },
    });

    revalidateTag("comment");

    return await res.json();
  } catch (error: any) {
    return error;
  }
};

// Reply to a comment
export const replyToComment = async (
  parentId: string,
  replyContent: string
): Promise<any> => {
  const token = await getValidToken();

  try {
    const res = await fetch(
      `${process.env.BASE_API}/comments/${parentId}/reply`,
      {
        method: "POST",
        body: JSON.stringify({ content: replyContent }),
        headers: {
          "Content-type": "application/json",
          Authorization: token,
        },
      }
    );

    revalidateTag("comments");

    return await res.json();
  } catch (error: any) {
    return error;
  }
};
