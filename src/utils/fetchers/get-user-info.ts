import { jwtDecode } from "jwt-decode";

import { getAccessToken, isLoggedIn } from "~utils/auth";
import { getBalance, getUser } from "~utils/fetchers";
import { getStoredData, setStoredData, STORAGE_KEYS } from "~utils/storage";

import type { UserType } from "@ja-packages/types";

type UserInfo = {
  balance: number;
  user: UserType;
};

export const getUserInfo = async (): Promise<UserInfo | null> => {
  const loggedIn = await isLoggedIn();
  if (!loggedIn) return null;

  const accessToken = await getAccessToken();
  if (!accessToken) return null;

  const storedBalance = await getStoredData<string>(STORAGE_KEYS.USER_BALANCE);
  const storedUser = await getStoredData<UserType>(STORAGE_KEYS.USER_DATA);
  if (storedBalance && storedUser) {
    const decodedToken = jwtDecode<{ "https://justabout.com/email"?: string }>(
      accessToken
    );
    if (storedUser.email === decodedToken["https://justabout.com/email"]) {
      return {
        balance: Number(storedBalance),
        user: storedUser,
      };
    }
  }

  const user = await getUser();
  const balance = await getBalance();
  if (balance === null || user === null) return null;

  await Promise.allSettled([
    setStoredData(STORAGE_KEYS.USER_DATA, user),
    setStoredData(STORAGE_KEYS.USER_BALANCE, balance),
  ]);

  return {
    balance,
    user,
  };
};
