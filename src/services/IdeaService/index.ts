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

// Get all ideas
export const getPersonalIdeas = async (query?: Record<string, unknown>) => {
  const queryString = new URLSearchParams(
    query as Record<string, string>
  ).toString();
  const token = await getValidToken();

  try {
    const res = await fetch(
      `${process.env.BASE_API}/ideas/personal?${queryString}`,
      {
        next: {
          tags: ["ideas"],
        },
        headers: {
          Authorization: token,
        },
      }
    );
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
    return error;
  }
};

// Create idea
export const createIdea = async (ideaData: FieldValues): Promise<any> => {
  const token = await getValidToken();

  try {
    const res = await fetch(`${process.env.BASE_API}/ideas`, {
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
    return error;
  }
};

// Update idea
export const updateIdeaStatus = async (
  ideaId: string,
  status: string,
  feedback?: string
): Promise<any> => {
  const token = await getValidToken();

  const payload: { status: string; feedback?: string } = {
    status: status,
  };

  if (feedback) {
    payload.feedback = feedback;
  }

  try {
    const res = await fetch(`${process.env.BASE_API}/ideas/${ideaId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
      headers: {
        "Content-type": "application/json",
        Authorization: token,
      },
    });
    revalidateTag("ideas");

    return await res.json();
  } catch (error: any) {
    return error;
  }
};

// Update idea
export const updateIdea = async (id: string, ideaData: any): Promise<any> => {
  const token = await getValidToken();

  const res = await fetch(`${process.env.BASE_API}/ideas/${id}`, {
    method: "PATCH",
    body: JSON.stringify(ideaData),
    headers: {
      "Content-type": "application/json",
      Authorization: token,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to update idea");
  }

  revalidateTag("ideas");
  return await res.json();
};

// Delete idea
export const deleteIdea = async (ideaId: string): Promise<any> => {
  const token = await getValidToken();

  try {
    const res = await fetch(`${process.env.BASE_API}/ideas/${ideaId}`, {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    });

    revalidateTag("ideas");
    return await res.json();
  } catch (error: any) {
    return error;
  }
};
