import { accessTokenIsValid } from "@ja-packages/utils/auth";

import { getTokens, signOut, refreshAccessToken } from ".";

export const getAccessToken = async (): Promise<string | null> => {
  const tokens = await getTokens();
  const { "ja-access": accessToken } = tokens;

  // If access token does not expire within the next 30 minutes, return access token
  if (accessTokenIsValid(accessToken)) return accessToken;

  // If the access token expires within the next 30 minutes, attempt to refresh it.
  // If the refresh was successful, return the new access token.
  const refreshedToken = await refreshAccessToken();
  if (refreshedToken) return refreshedToken;

  // If refresh was unsuccessful, check if there is any time left on the original access
  // token and return it if so.
  if (accessTokenIsValid(accessToken, 0)) return accessToken;

  // If the access token has expired and could not be refreshed, sign the user out
  // and return null.
  await signOut();
  return null;
};
