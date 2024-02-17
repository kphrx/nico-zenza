import {createContext} from "@lit/context";
import type {WatchData} from "@nico-zenza/api-wrapper";

export type WatchDataContext = WatchData | undefined;
export const watchDataContext = createContext<WatchDataContext>("watch-data");
