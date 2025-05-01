/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getValidToken } from "@/lib/verifyToken";
import { revalidateTag } from "next/cache";

// Get all users
export const getAllUsers = async () => {
  try {
    const res = await fetch(`${process.env.BASE_API}/users`, {
      next: {
        tags: ["users"],
      },
      headers: {
        Authorization: await getValidToken(),
      },
    });
    return await res.json();
  } catch (error: any) {
    return error;
  }
};

// Get single user
export const getSingleUser = async (id: string) => {
  const token = await getValidToken();
  try {
    const res = await fetch(`${process.env.BASE_API}/users/${id}`, {
      next: {
        tags: ["user"],
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

// Delete user
export const deleteUser = async (userId: string): Promise<any> => {
  const token = await getValidToken();

  try {
    const res = await fetch(`${process.env.BASE_API}/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    });

    revalidateTag("users");
    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};

// get personal info
export const getMe = async () => {
  const token = await getValidToken();

  try {
    const res = await fetch(`${process.env.BASE_API}/users/me`, {
      headers: {
        "content-type": "application/json",
        Authorization: token,
      },
    });

    return await res.json();
  } catch (error: any) {
    return error;
  }
};
