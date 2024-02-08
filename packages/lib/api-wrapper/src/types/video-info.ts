export type VideoId = `${"so" | "sm" | "nm"}${number}`;
export type ChannelId = `ch${number}`;

interface VideoListItemOwner<T = string, I = string> {
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

export interface VideoInfo {
  id: VideoId;
  title: string;
  description: string;
  count: {
    view: number;
    comment: number;
    mylist: number;
    like: number;
  };
  duration: number;
  thumbnail: {
    url: string;
    middleUrl: string;
    largeUrl: string;
    player: string;
    ogp: string;
  };
  rating: {
    isAdult: boolean;
  };
  registeredAt: string;
  isPrivate: boolean;
  isDeleted: boolean;
  isNoBanner: boolean;
  isAuthenticationRequired: boolean;
  isEmbedPlayerAllowed: boolean;
  isGiftAllowed: boolean;
  viewer: {
    isOwner: boolean;
    like: {
      isLiked: boolean;
      count: unknown;
    };
  };
  watchableUserTypeForPayment: string;
  commentableUserTypeForPayment: string;
  "9d091f87": boolean;
}
