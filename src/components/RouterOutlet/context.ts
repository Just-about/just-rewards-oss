import { FC, createContext, useContext } from "react";

export type Routes = Record<string, FC>;

type RouterContextType = {
  push: (path: string) => void;
  pop: () => void;
  navigate: (paths: string[], cursor?: number) => Promise<void>;
  routes: Routes;
  openExternalUrl: (url: string) => void;
  history: string[];
  cursor: number;
};

const defaultRouterContextValues: RouterContextType = {
  push: (path: string) => {},
  pop: () => {},
  navigate: async (paths: string[]) => {},
  routes: {},
  history: [],
  cursor: 0,
  openExternalUrl: () => {},
};

export const RouterContext = createContext<RouterContextType>(
  defaultRouterContextValues
);
export const useRouter = () => useContext(RouterContext);
