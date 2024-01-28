import {createContext} from "@lit/context";
import type {FlattedComment} from "@/comment-list";

export const commentContext = createContext<FlattedComment[]>("comment");
