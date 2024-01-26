import {createContext} from "@lit/context";
import type {WatchV3Response} from "@/watch-data";

export const watchDataContext = createContext<WatchV3Response | undefined>(
  "watch-data",
);
