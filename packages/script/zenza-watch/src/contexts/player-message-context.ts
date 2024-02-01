import {createContext} from "@lit/context";
import type {PlayerMessage} from "@/components/player/message";

export type PlayerMessageContext = PlayerMessage;
export const playerMessageContext =
  createContext<PlayerMessage>("player-message");
