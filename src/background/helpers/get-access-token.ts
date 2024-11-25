import { accessTokenIsValid } from "@ja-packages/utils/auth";
import { COOKIES } from "@ja-packages/utils/cookies";

const BASE_URL = process.env.PLASMO_PUBLIC_SITE_URL || "https://justabout.com";

export const getAccessToken = async (): Promise<string | null> => {
  try {
    const cookies = await chrome.cookies.getAll({
      domain: process.env.PLASMO_PUBLIC_SITE_DOMAIN,
    });

    const hasRefreshToken = cookies.some(
      (cookie: any) => cookie.name === COOKIES.refresh
    );

    if (!hasRefreshToken) return null;

    const storedAccessToken = cookies.find(
      (cookie: any) => cookie.name === COOKIES.access
    )?.value;

    // If access token does not expire within the next 30 minutes, return access token
    if (accessTokenIsValid(storedAccessToken)) return storedAccessToken;

    // If the access token expires within the next 30 minutes, attempt to refresh it.
    // If the refresh was successful, return the new access token.
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      cache: "no-store",
      method: "POST",
    });

    const accessToken = await response.json().then((body) => body.accessToken);

    if (!accessToken) {
      // If refresh was unsuccessful, check if there is any time left on the original access
      // token and return it if so.
      if (accessTokenIsValid(storedAccessToken, 0)) return storedAccessToken;

      // sign out if the token is too old
      await fetch(`${BASE_URL}/auth/sign-out`);
      return null;
    }

    return accessToken;
  } catch {
    return null;
  }
};
