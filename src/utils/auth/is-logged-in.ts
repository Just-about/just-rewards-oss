import { getTokens } from "./get-tokens";

export const isLoggedIn = async () => {
  const tokens = await getTokens();
  return !!tokens["ja-refresh"];
};
