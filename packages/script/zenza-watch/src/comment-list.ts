interface ThreadComment {
  id: `${number}`;
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
  globalComments: {id: `${number}`; count: number}[];
  threads: {
    id: `${number}`;
    fork: string;
    commentCount: number;
    comments: ThreadComment[];
  }[];
}

export interface FlattedComment extends Omit<ThreadComment, "postedAt"> {
  postedAt: number;
  fork: string;
  threadId: `${number}`;
}
