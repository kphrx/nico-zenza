import {NotFoundInitialDataError} from "./error";

export interface TopPageDataEnvironment {
  baseURL: {[key: string]: string};
  language: string;
  locale: string;
}

export interface TopPageData {
  environment: {
    _raw: TopPageDataEnvironment;
    language: string;
    locale: string;
  };
}

export function parseTopPageData(): TopPageData {
  const initialData = document.getElementById("js-initial-top-page-data");
  if (initialData == null || initialData.dataset.environment == null) {
    throw new NotFoundInitialDataError("TopPage");
  }
  const environment = JSON.parse(
    initialData.dataset.environment,
  ) as TopPageDataEnvironment;
  const {language, locale} = environment;

  return {
    environment: {
      _raw: environment,
      language,
      locale,
    },
  };
}
