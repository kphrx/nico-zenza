export interface AccessRights {
  contentUrl: string;
  createTime: string;
  expireTime: string;
}

export interface AccessRightsOptions {
  params: {
    actionTrackId: string;
  };
  accessRightKey: string;
}
