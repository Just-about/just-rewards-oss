import { isLoggedIn, getAccessToken } from "~utils/auth";

import type { StartsWithSlash } from "@ja-packages/types";

export const getFromStrapi = async (endpoint: StartsWithSlash, withAuth = true): Promise<any> => {
  const headers: HeadersInit = {};

  if (withAuth) {
    const loggedIn = await isLoggedIn();
    if (!loggedIn) return null;

    const accessToken = await getAccessToken();
    if (!accessToken) return null;

    headers.Auth = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${process.env.PLASMO_PUBLIC_API_URL}/api${endpoint}`, {
    headers,
  });

  if (!response.ok) return null;

  return response.json();
};
