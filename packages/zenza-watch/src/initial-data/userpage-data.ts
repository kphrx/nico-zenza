import {NotFoundInitialDataError} from "./error";

export interface MypageDataEnvironment {
  baseURL: {[key: string]: string};
  csrfToken: number;
  cssUrl: {[key: string]: string};
  frontendId: number;
  frontendVersion: string;
  language: string;
  locale: string;
  pageType: string;
  userId: number;
  viewer: {
    description: string;
    icons: {
      small: string;
      large: string;
    };
    id: number;
    isPremium: boolean;
    nickname: string;
    strippedDescription: string;
    type: string;
  };
}

export interface UserpageDataEnvironment {
  userDetails: {
    userDetails: {
      followStatus: {
        isFollowing: boolean;
      };
      type: "user";
      user: {
        description: string;
        followeeCount: number;
        followerCount: number;
        icons: {
          small: string;
          large: string;
        };
        id: number;
        isNicorepoReadable: true;
        isPremium: boolean;
        nickname: string;
        registeredVersion: string;
        strippedDescription: string;
        sns: {
          iconUrl: string;
          label: string;
          screenName: string;
          type: string;
          url: string;
        }[];
        userChannel: {
          description: string;
          id: string;
          name: string;
          thumbnailSmallUrl: string;
          thumbnailUrl: string;
        } | null;
        userLevel: {
          currentLevel: number;
          currentLevelExperience: number;
          nextLevelThresholdExperience: number;
          nextLevelExperience: number;
        };
      };
    };
  };
}

export interface MypageData {
  environment: {
    _raw: MypageDataEnvironment;
    csrfToken: number;
    frontendId: number;
    frontendVersion: string;
    language: string;
    locale: string;
  };
}

export interface UserpageData {
  environment: {
    _raw: UserpageDataEnvironment;
  };
}

export function parseUserpageData(): MypageData | UserpageData {
  const initialData = document.getElementById("js-initial-userpage-data");
  if (initialData == null || initialData.dataset.environment == null) {
    throw new NotFoundInitialDataError("UserpageData");
  }
  const environment = JSON.parse(initialData.dataset.environment) as
    | MypageDataEnvironment
    | UserpageDataEnvironment;

  if ("userDetails" in environment) {
    return {
      environment: {
        _raw: environment,
      },
    };
  }

  const {csrfToken, frontendId, frontendVersion, language, locale} =
    environment;

  return {
    environment: {
      _raw: environment,
      csrfToken,
      frontendId,
      frontendVersion,
      language,
      locale,
    },
  };
}
