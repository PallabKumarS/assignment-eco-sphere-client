/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getValidToken } from "@/lib/verifyToken";
import { revalidateTag } from "next/cache";
import { FieldValues } from "react-hook-form";

// Get all ideas
export const getAllIdeas = async (query?: Record<string, unknown>) => {
  const queryString = new URLSearchParams(
    query as Record<string, string>
  ).toString();

  try {
    const res = await fetch(`${process.env.BASE_API}/ideas?${queryString}`, {
      next: {
        tags: ["ideas"],
      },
    });
    return await res.json();
  } catch (error: any) {
    return error;
  }
};

// Get single idea
export const getSingleIdea = async (ideaId: string) => {
  const token = await getValidToken();
  try {
    const res = await fetch(`${process.env.BASE_API}/ideas/${ideaId}`, {
      next: {
        tags: ["idea"],
      },
      headers: {
        Authorization: token,
      },
    });
    return await res.json();
  } catch (error: any) {
    return Error(error.message);
  }
};

// Create idea
export const createIdea = async (ideaData: FieldValues): Promise<any> => {
  const token = await getValidToken();

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/ideas`, {
      method: "POST",
      body: JSON.stringify(ideaData),
      headers: {
        "Content-type": "application/json",
        Authorization: token,
      },
    });

    revalidateTag("ideas");

    return await res.json();
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};

// Update idea
export const updateIdeaStatus = async (
  ideaId: string,
  status: string
): Promise<any> => {
  const token = await getValidToken();

  try {
    const res = await fetch(`${process.env.BASE_API}/ideas/${ideaId}`, {
      method: "PATCH",
      body: JSON.stringify({ status: status }),
      headers: {
        "Content-type": "application/json",
        Authorization: token,
      },
    });
    revalidateTag("ideas");

    return await res.json();
  } catch (error: any) {
    return Error(error.message);
  }
};

// Delete idea
export const deleteIdea = async (ideaId: string): Promise<any> => {
  const token = await getValidToken();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/ideas/${ideaId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      }
    );

    revalidateTag("ideas");
    return await res.json();
  } catch (error: any) {
    return Error(error);
  }
};
