import {createContext} from "@lit/context";
import type {WatchV3Response} from "@/watch-data";

export type WatchDataContext = WatchV3Response | undefined;
export const watchDataContext = createContext<WatchDataContext>("watch-data");
