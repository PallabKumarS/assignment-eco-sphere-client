/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getValidToken } from "@/lib/verifyToken";
import { revalidateTag } from "next/cache";

// Upvote an idea
export const voteIdea = async (ideaId: string, voteData: string): Promise<any> => {
  const token = await getValidToken();

  try {
    const res = await fetch(`${process.env.BASE_API}/votes/${ideaId}/vote`, {
      method: "POST",
      body: JSON.stringify({type: voteData}),
      headers: {
        "Content-type": "application/json",
        Authorization: token,
      },
    });

    revalidateTag("votes");

    return await res.json();
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};

// Downvote an idea
export const deleteVote = async (ideaId: string, voteData: string): Promise<any> => {
  const token = await getValidToken();

  try {
    const res = await fetch(`${process.env.BASE_API}/votes/${ideaId}/vote`, {
      method: "DELETE",
      body: JSON.stringify({type: voteData}),
      headers: {
        "Content-type": "application/json",
        Authorization: token,
      },
    });

    revalidateTag("votes");

    return await res.json();
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};

