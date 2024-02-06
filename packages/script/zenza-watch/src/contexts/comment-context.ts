import {createContext} from "@lit/context";
import type {FlattedComment} from "@/comment-list";

export type CommentContext = FlattedComment[];
export const commentContext = createContext<CommentContext>("comment");
