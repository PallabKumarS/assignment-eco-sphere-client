"use server";

import { cookies } from "next/headers";

export const setCookies = async (accessToken: string, refreshToken: string) => {
  (await cookies()).set("access_token", accessToken);
  (await cookies()).set("refresh_token", refreshToken);
};

export const deleteCookie = async () => {
  (await cookies()).delete("accessToken");
  (await cookies()).delete("refreshToken");
  (await cookies()).delete("access_token");
  (await cookies()).delete("refresh_token");
};
