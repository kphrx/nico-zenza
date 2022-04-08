interface CommonHeader {
  commonHeaderBaseUrl: string;
  initConfig: {
    baseURL: {[key: string]: string};
    customization: {
      cmnhdRef: {
        page: string;
      };
      logoutNextUrl: string;
      nextUrl: string;
      size: {
        hMargin: string;
        maxWidth: string;
        minWidth: string;
      };
      userPanelLinks: {
        href: string;
        label: string;
      }[];
    };
    debug: {
      showAppeal: boolean;
    };
    frontendId: number;
    frontendVersion: string;
    site: string;
    user:
      | {
          iconUrl: string;
          id: number;
          isLogin: true;
          isPremium: boolean;
          nickname: string;
        }
      | {
          isLogin: false;
        };
  };
  language: string;
}

export class NotFoundCommonHeaderError extends Error {}

export const parseCommonHeader = () => {
  const commonHeaderElement = document.getElementById("CommonHeader");
  if (
    commonHeaderElement == null ||
    commonHeaderElement.dataset.commonHeader == null
  ) {
    throw new NotFoundCommonHeaderError();
  }
  const commonHeader = JSON.parse(
    commonHeaderElement.dataset.commonHeader,
  ) as CommonHeader;
  const {
    initConfig: {frontendId, frontendVersion, user},
  } = commonHeader;

  const {isLogin} = user;

  return {
    _raw: commonHeader,
    frontendId,
    frontendVersion,
    isLogin,
    isPremium: isLogin && user.isPremium,
  };
};
