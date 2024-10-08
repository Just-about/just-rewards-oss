import { Storage } from "@plasmohq/storage";

interface StoredData<T> {
  data: T;
  expires: number;
}

const DEFAULT_TTL = 15 * 60 * 1000; // 15 minutes in milliseconds
const storage = new Storage();

// Constants for commonly used storage keys
export const STORAGE_KEYS = {
  CURRENT_BOUNTIES: "current-bounties",
  DISMISSED_NOTIFICATION: "dismissed-notification-url-map",
  USER_BALANCE: "user-balance",
  USER_DATA: "user-data",
} as const;

// Only allow storage keys that are defined in the STORAGE_KEYS object
type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

// Retrieves stored data for a given key if it hasn't expired
export async function getStoredData<T>(key: StorageKey): Promise<T | null> {
  const storedItem = await storage.get(key);
  if (!storedItem) return null;

  const parsedItem: StoredData<T> = JSON.parse(storedItem);

  if (parsedItem.expires > Date.now()) {
    return parsedItem.data;
  }

  return null;
}

// Stores data with a given key and expiration time
export async function setStoredData<T>(
  key: StorageKey,
  data: T,
  ttl: number = DEFAULT_TTL
): Promise<void> {
  const expirationTime = Date.now() + ttl;
  const itemToStore: StoredData<T> = { data, expires: expirationTime };
  await storage.set(key, JSON.stringify(itemToStore));
}
