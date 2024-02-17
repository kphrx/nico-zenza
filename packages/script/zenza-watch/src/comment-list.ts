import type {NVCommentThreads} from "@nico-zenza/api-wrapper";

export interface FlattedComment
  extends Omit<
    NVCommentThreads["threads"][number]["comments"][number],
    "postedAt"
  > {
  postedAt: number;
  fork: string;
  threadId: `${number}`;
}
