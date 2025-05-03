/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getValidToken } from "@/lib/verifyToken";
import { revalidateTag } from "next/cache";
import { FieldValues } from "react-hook-form";

// Get all categories
export const getAllCategories = async (query?: Record<string, unknown>) => {
  const token = await getValidToken();

  const queryString = new URLSearchParams(
    query as Record<string, string>
  ).toString();

  try {
    const res = await fetch(
      `${process.env.BASE_API}/categories?${queryString}`,
      {
        next: {
          tags: ["categories"],
        },
        headers: {
          Authorization: token,
        },
      }
    );
    return await res.json();
  } catch (error: any) {
    return Error(error.message);
  }
};

// Get single category
export const getSingleCategory = async (categoryId: string) => {
  const token = await getValidToken();
  try {
    const res = await fetch(
      `${process.env.BASE_API}/categories/${categoryId}`,
      {
        next: {
          tags: ["category"],
        },
        headers: {
          Authorization: token,
        },
      }
    );
    return await res.json();
  } catch (error: any) {
    return Error(error.message);
  }
};

// Create category
export const createCategory = async (
  categoryData: FieldValues
): Promise<any> => {
  const token = await getValidToken();

  try {
    const res = await fetch(`${process.env.BASE_API}/categories`, {
      method: "POST",
      body: JSON.stringify(categoryData),
      headers: {
        "Content-type": "application/json",
        Authorization: token,
      },
    });

    revalidateTag("categories");

    return await res.json();
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};

// update category
export const updateCategory = async (
  categoryId: string,
  categoryData: FieldValues
): Promise<any> => {
  const token = await getValidToken();

  try {
    const res = await fetch(
      `${process.env.BASE_API}/categories/${categoryId}`,
      {
        method: "PATCH",
        body: JSON.stringify(categoryData),
        headers: {
          "Content-type": "application/json",
          Authorization: token,
        },
      }
    );

    revalidateTag("categories");

    return await res.json();
  } catch (error: any) {
    return Error(error);
  }
};

// Delete category
export const deleteCategory = async (categoryId: string): Promise<any> => {
  const token = await getValidToken();

  try {
    const res = await fetch(
      `${process.env.BASE_API}/categories/${categoryId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      }
    );

    revalidateTag("categories");
    return await res.json();
  } catch (error: any) {
    return Error(error);
  }
};
