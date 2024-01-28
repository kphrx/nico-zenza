interface ThreadComment {
  id: string;
  no: number;
  vposMs: number;
  body: string;
  commands: string[];
  userId: string;
  isPremium: boolean;
  score: number;
  postedAt: string;
  nicoruCount: number;
  nicoruId: unknown;
  source: string;
  isMyPost: boolean;
}

export interface Threads {
  globalComments: {id: string; count: number}[];
  threads: {
    id: string;
    fork: string;
    commentCount: number;
    comments: ThreadComment[];
  }[];
}

export interface FlattedComment extends Omit<ThreadComment, "postedAt"> {
  postedAt: number;
  fork: string;
  threadId: string;
}
