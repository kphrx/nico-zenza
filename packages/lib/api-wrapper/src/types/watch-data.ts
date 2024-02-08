import type {
  VideoId,
  ChannelId,
  VideoListItem as SeriesVideo,
  VideoInfo,
} from "./video-info";

type CommunityId = `co${number}`;

export interface SeriesInfo {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  video: {
    prev: SeriesVideo | null;
    next: SeriesVideo | null;
    first: SeriesVideo | null;
  };
}

interface TagEdit {
  isEditable: boolean;
  uneditableReason: unknown;
  editKey: string;
}

export interface Tag {
  items: {
    name: string;
    isCategory: boolean;
    isCategoryCandidate: boolean;
    isNicodicArticleExists: boolean;
    isLocked: boolean;
  }[];
  hasR18Tag: boolean;
  isPublishedNicoscript: boolean;
  edit: TagEdit;
  viewer: TagEdit;
}

export interface NVComment {
  threadKey: string;
  server: string;
  params: {
    language: string;
    targets: {
      id: string;
      fork: string;
    }[];
  };
}

export interface OwnerInfo {
  id: number;
  nickname: string;
  iconUrl: string;
  channel: {
    id: ChannelId;
    name: string;
    url: string;
  } | null;
  live: unknown;
  isVideosPublic: string;
  isMylistsPublic: string;
  videoLiveNotice: unknown;
  viewer: {
    isFollowing: string;
  };
}

export interface ChannelInfo {
  id: ChannelId;
  name: string;
  isOfficialAnime: boolean;
  isDisplayAdBanner: boolean;
  thumbnail: {
    url: string;
    smallUrl: string;
  };
  viewer: {
    follow: {
      isFollowed: boolean;
      isBookmarked: boolean;
      token: string;
      tokenTimestamp: number;
    };
  };
}

export interface WatchData {
  ads: null;
  category: null;
  channel: ChannelInfo | null;
  client: {
    nicosid: string;
    watchId: VideoId;
    watchTrackId: string;
  };
  comment: {
    server: {
      url: "";
    };
    keys: {
      userKey: "";
    };
    layers: {
      index: number;
      isTranslucent: boolean;
      threadIds: {
        id: number;
        fork: number;
        forkLabel: string;
      }[];
    }[];
    threads: {
      id: number;
      fork: number;
      forkLabel: string;
      videoId: VideoId;
      isActive: boolean;
      isDefaultPostTarget: boolean;
      isEasyCommentPostTarget: boolean;
      isLeafRequired: boolean;
      isOwnerThread: boolean;
      isThreadkeyRequired: boolean;
      threadkey: string | null;
      is184Forced: boolean;
      hasNicoscript: boolean;
      label: string;
      postkeyStatus: number;
      server: string;
    }[];
    ng: {
      ngScore: {
        isDisabled: boolean;
      };
      channel: unknown[];
      owner: unknown[];
      viewer: {
        revision: number;
        count: number;
        items: {
          type: string;
          source: string;
          registeredAt: string;
        }[];
      };
    };
    isAttentionRequired: boolean;
    nvComment: NVComment;
  };
  community: {
    main: {
      id: CommunityId;
      name: string;
    };
    belong: {
      id: CommunityId;
      name: string;
    } | null;
  } | null;
  easyComment: {
    phrases: {
      text: string;
      nicodic: {
        title: string;
        viewTitle: string;
        summary: string;
        link: string;
      } | null;
    }[];
  };
  external: null;
  genre: {
    key: string;
    label: string;
    isImmoral: boolean;
    isDisabled: boolean;
    isNotSet: boolean;
  };
  marquee: null;
  media: {
    domand: {
      videos: {
        id: string;
        isAvailable: boolean;
        label: string;
        bitRate: number;
        width: number;
        height: number;
        qualityLevel: number;
        recommendedHighestAudioQualityLevel: number;
      }[];
      audios: {
        id: string;
        isAvailable: boolean;
        bitRate: number;
        samplingRate: number;
        integratedLoudness: number;
        truePeak: number;
        qualityLevel: number;
        loudnessCollection: {
          type: string;
          value: number;
        }[];
      }[];
      isStoryboardAvailable: boolean;
      accessRightKey: string;
    } | null;
    delivery: {
      recipeId: string;
      encryption: unknown;
      movie: {
        contentId: string;
        audios: {
          id: string;
          isAvailable: boolean;
          metadata: {
            bitrate: number;
            samplingRate: number;
            loudness: {
              integratedLoudness: number;
              truePeak: number;
            };
            levelIndex: number;
            loudnessCollection: {
              type: string;
              value: number;
            }[];
          };
        }[];
        videos: {
          id: string;
          isAvailable: boolean;
          metadata: {
            label: string;
            bitrate: number;
            resolution: {
              width: number;
              height: number;
            };
            levelIndex: number;
            recommendedHighestAudioLevelIndex: number;
          };
        }[];
        session: {
          recipeId: string;
          playerId: string;
          videos: string[];
          audios: string[];
          movies: unknown[];
          protocols: string[];
          authTypes: {
            http: string;
            hls: string;
          };
          serviceUserId: string;
          token: string;
          signature: string;
          contentId: string;
          heartbeatLifetime: number;
          contentKeyTimeout: number;
          priority: number;
          transferPresets: unknown[];
          urls: {
            url: string;
            isWellKnownPort: boolean;
            isSsl: boolean;
          }[];
        };
      };
      storyboard: {
        session: {
          recipeId: string;
          playerId: string;
          videos: string[];
          authTypes: {
            storyboard: string;
          };
          serviceUserId: string;
          token: string;
          signature: string;
          contentId: string;
          heartbeatLifetime: number;
          contentKeyTimeout: number;
          priority: number;
          urls: {
            url: string;
            isWellKnownPort: boolean;
            isSsl: boolean;
          }[];
        };
      } | null;
      trackingId: string;
    } | null;
    deliveryLegacy: null;
  };
  okReason: string;
  owner: OwnerInfo | null;
  payments: {
    video: {
      isPpv: boolean;
      isAdmission: boolean;
      isContinuationBenefit: boolean;
      isPremium: boolean;
      watchableUserType: string;
      commentableUserType: string;
      billingType: string;
    };
    preview: {
      ppv: {
        isEnabled: boolean;
      };
      admission: {
        isEnabled: boolean;
      };
      continuationBenefit: {
        isEnabled: boolean;
      };
      premium: {
        isEnabled: boolean;
      };
    };
  };
  pcWatchPage: null;
  player: {
    initialPlayback: {
      type: string;
      position: number;
    } | null;
    comment: {
      isDefaultInvisible: boolean;
    };
    layerMode: number;
  };
  ppv: null;
  ranking: {
    genre: {
      rank: number;
      genre: string;
      dateTime: string;
    };
    popularTag: {
      tag: string;
      regularizedTag: string;
      rank: number;
      genre: string;
      dateTime: string;
    }[];
  };
  series: SeriesInfo | null;
  smartphone: null;
  system: {
    serverTime: string;
    isPeakTime: boolean;
    isStellaAlive: boolean;
  };
  tag: Tag;
  video: VideoInfo;
  videoAds: {
    additionalParams: {
      videoId: VideoId;
      videoDuration: number;
      isAdultRatingNG: boolean;
      isAuthenticationRequired: boolean;
      isR18: boolean;
      nicosid: string;
      lang: string;
      watchTrackId: string;
      genre: string;
      gender: string;
      age: number;
    };
    items: {
      type: string;
      timingMs: unknown;
      additionalParams: {
        linearType: string;
        adIdx: number;
        skipType: number;
        skippableType: number;
        pod: number;
      };
    }[];
    reason: string;
  };
  videoLive: unknown;
  viewer: {
    id: number;
    nickname: string;
    isPremium: boolean;
    allowSensitiveContents: boolean;
    existence: {
      age: number;
      prefecture: string;
      sex: string;
    };
  };
  waku: {
    information: unknown;
    bgImages: unknown[];
    addContents: unknown;
    addVideo: unknown;
    tagRelatedBanner: {
      title: string;
      imageUrl: string;
      description: string;
      isEvent: boolean;
      linkUrl: string;
      linkType: string;
      linkOrigin: string;
      isNewWindow: boolean;
    };
    tagRelatedMarquee: unknown;
  };
}
