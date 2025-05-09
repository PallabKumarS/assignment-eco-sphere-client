/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getValidToken } from "@/lib/verifyToken";
import { revalidateTag } from "next/cache";

// Get all payments
export const getAllPayments = async (query?: Record<string, unknown>) => {
  const queryString = new URLSearchParams(
    query as Record<string, string>
  ).toString();

  try {
    const res = await fetch(`${process.env.BASE_API}/payments/${queryString}`, {
      next: {
        tags: ["payments"],
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

// Get single payment
export const getSinglePayment = async (paymentId: string) => {
  const token = await getValidToken();
  try {
    const res = await fetch(`${process.env.BASE_API}/payments/${paymentId}`, {
      next: {
        tags: ["payment"],
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

// Create payment
export const createPayment = async (paymentData: any): Promise<any> => {
  const token = await getValidToken();

  try {
    const res = await fetch(`${process.env.BASE_API}/payments`, {
      method: "POST",
      body: JSON.stringify(paymentData),
      headers: {
        "Content-type": "application/json",
        Authorization: token,
      },
    });

    revalidateTag("payments");
    revalidateTag("payment");

    return await res.json();
  } catch (error: any) {
    return error;
  }
};

// verify payment
export const verifyPayment = async (
  paymentId: string,
  data: { userId: string }
): Promise<any> => {
  const token = await getValidToken();

  try {
    const res = await fetch(
      `${process.env.BASE_API}/payments/${paymentId}/verify`,
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-type": "application/json",
          Authorization: token,
        },
      }
    );

    revalidateTag("payments");
    revalidateTag("payment");

    return await res.json();
  } catch (error: any) {
    return error;
  }
};

// Delete payment
export const deletePayment = async (paymentId: string): Promise<any> => {
  const token = await getValidToken();

  try {
    const res = await fetch(`${process.env.BASE_API}/payments/${paymentId}`, {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    });

    revalidateTag("payments");
    revalidateTag("payment");

    return await res.json();
  } catch (error: any) {
    return error;
  }
};
