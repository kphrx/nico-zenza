import {NotFoundInitialDataError} from "./error";

export interface WatchDataEnvironment {
  baseURL: {[key: string]: string};
  frontendId: number;
  frontendVersion: string;
  i18n: {
    area: string;
    footer: {
      availableLanguageList: {
        language: string;
        label: string;
      }[];
      setcountryToken: string;
      setcountryURL: string;
    };
    language: string;
    locale: string;
  };
  isMonitoringLogUser: boolean;
  newPlaylistRate: number;
  newRelatedVideos: boolean;
  playlistToken: string;
  urls: {
    playerHelp: string;
  };
}

export interface WatchData {
  environment: {
    _raw: WatchDataEnvironment;
    frontendId: number;
    frontendVersion: string;
    language: string;
    locale: string;
  };
}

export function parseWatchData(): WatchData {
  const initialData = document.getElementById("js-initial-watch-data");
  if (initialData == null || initialData.dataset.environment == null) {
    throw new NotFoundInitialDataError("WatchData");
  }
  const environment = JSON.parse(
    initialData.dataset.environment,
  ) as WatchDataEnvironment;

  const {
    frontendId,
    frontendVersion,
    i18n: {language, locale},
  } = environment;

  return {
    environment: {
      _raw: environment,
      frontendId,
      frontendVersion,
      language,
      locale,
    },
  };
}
