/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getValidToken } from "@/lib/verifyToken";
import { revalidateTag } from "next/cache";

// Upvote an idea
export const commentIdea = async (ideaId: string, commentData: string): Promise<any> => {
  const token = await getValidToken();

  try {
    const res = await fetch(`${process.env.BASE_API}/comments/${ideaId}`, {
      method: "POST",
      body: JSON.stringify({content: commentData}),
      headers: {
        "Content-type": "application/json",
        Authorization: token,
      },
    });

    revalidateTag("comments");

    return await res.json();
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};

// Downvote an idea
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
    throw new Error(error.message || "Something went wrong");
  }
};

