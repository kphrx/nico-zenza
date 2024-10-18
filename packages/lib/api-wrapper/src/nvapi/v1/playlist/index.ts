import type {ApiEndpoints, FetchFunc} from "../../../types";
import {Series} from "./series";
import {ChannelUploaded} from "./channel-uploaded";
import {UserUploaded} from "./user-uploaded";
import {Mylist} from "./mylist";
import {WatchLater} from "./watch-later";

export class Playlist implements ApiEndpoints {
  fetch: FetchFunc;
  endpoint: URL;

  series: Series;
  channelUploaded: ChannelUploaded;
  userUploaded: UserUploaded;
  mylist: Mylist;
  watchLater: WatchLater;

  constructor(baseURL: URL | string, customFetch?: FetchFunc) {
    this.fetch = customFetch ?? fetch;
    this.endpoint = new URL("playlist/", baseURL);

    this.series = new Series(this.endpoint, this.fetch);
    this.channelUploaded = new ChannelUploaded(this.endpoint, this.fetch);
    this.userUploaded = new UserUploaded(this.endpoint, this.fetch);
    this.mylist = new Mylist(this.endpoint, this.fetch);
    this.watchLater = new WatchLater(this.endpoint, this.fetch);
  }
}
