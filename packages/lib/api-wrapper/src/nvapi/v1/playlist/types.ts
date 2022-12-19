type VideoId = `${"so" | "sm" | "nm"}${number}`;
type ChannelId = `ch${number}`;

export interface VideoListItemOwner<T = string, I = string> {
  ownerType: T;
  type: T;
  visibility: string;
  id: I;
  name: string;
  iconUrl: string;
}

export interface VideoListItem {
  type: string;
  id: VideoId;
  title: string;
  registeredAt: string;
  count: {
    view: number;
    comment: number;
    mylist: number;
    like: number;
  };
  thumbnail: {
    url: string;
    middleUrl: string;
    largeUrl: string;
    listingUrl: string;
    nHdUrl: string;
  };
  duration: number;
  shortDescription: string;
  latestCommentSummary: string;
  isChannelVideo: boolean;
  isPaymentRequired: boolean;
  playbackPosition: unknown;
  owner:
    | VideoListItemOwner<"user", `${number}`>
    | VideoListItemOwner<"channel", ChannelId>;
  requireSensitiveMasking: boolean;
  videoLive: unknown;
  isMuted: boolean;
  "9d091f87": boolean;
  acf68865: boolean;
}

export interface PlaylistItem {
  watchId: VideoId;
  content: VideoListItem;
}

export interface Playlist {
  id: {
    type: string;
    value: string;
  };
  meta: {
    title: string;
    ownerName: string;
  };
  totalCount: number;
  items: PlaylistItem[];
}
