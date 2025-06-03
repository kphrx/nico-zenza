import type {FetchFunc} from "../../../types";
import {Series} from "./series";
import {ChannelUploaded} from "./channel-uploaded";
import {UserUploaded} from "./user-uploaded";
import {Mylist} from "./mylist";
import {WatchLater} from "./watch-later";

export class Playlist {
  series: Series;
  channelUploaded: ChannelUploaded;
  userUploaded: UserUploaded;
  mylist: Mylist;
  watchLater: WatchLater;

  constructor(baseURL: URL | string, customFetch: FetchFunc) {
    const endpoint = new URL("playlist/", baseURL);

    this.series = new Series(endpoint, customFetch);
    this.channelUploaded = new ChannelUploaded(endpoint, customFetch);
    this.userUploaded = new UserUploaded(endpoint, customFetch);
    this.mylist = new Mylist(endpoint, customFetch);
    this.watchLater = new WatchLater(endpoint, customFetch);
  }
}
