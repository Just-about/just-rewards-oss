import { Storage } from "@plasmohq/storage";
import { nanoid } from "nanoid/non-secure";

import { safeAsync } from "@ja-packages/trpc/errors";

import { getAccessToken } from "./get-access-token";

import type { Resolver, ResolverDef } from "@ja-packages/trpc";

const storage = new Storage({
  area: "session",
});

const DEVICE_ID_KEY = "SESSION_DEVICE_ID";

const getDeviceID = async () => {
  const storedDeviceID = await storage.get(DEVICE_ID_KEY);
  if (storedDeviceID) return storedDeviceID;

  const newDeviceID = nanoid();
  await storage.set(DEVICE_ID_KEY, newDeviceID);

  return newDeviceID;
};

const createHeadersWithContext = async (headers?: Record<string, string>) => {
  const accessToken = await getAccessToken();
  const deviceID = await getDeviceID();

  return {
    ...(headers || {}),
    "X-Device-Id": deviceID,
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };
};

export const clientTRPCQuery = async <
  TDef extends ResolverDef,
  TProcedure extends { query: Resolver<TDef> },
  TResult = ReturnType<TProcedure["query"]>
>(
  procedure: TProcedure,
  input: Parameters<TProcedure["query"]>[0],
  headers?: Record<string, string>
) =>
  safeAsync(
    procedure.query(input, {
      context: {
        headers: createHeadersWithContext(headers),
      },
    }) as TResult
  );

export const clientTRPCMutate = async <
  TDef extends ResolverDef,
  TProcedure extends { mutate: Resolver<TDef> },
  TResult = ReturnType<TProcedure["mutate"]>
>(
  procedure: TProcedure,
  input: Parameters<TProcedure["mutate"]>[0],
  headers?: Record<string, string>
) =>
  safeAsync(
    procedure.mutate(input, {
      context: {
        headers: createHeadersWithContext(headers),
      },
    }) as TResult
  );
