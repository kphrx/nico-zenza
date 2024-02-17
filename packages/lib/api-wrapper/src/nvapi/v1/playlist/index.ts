import type {ApiEndpoints} from "../../../types";
import {Series} from "./series";
import {ChannelUploaded} from "./channel-uploaded";
import {UserUploaded} from "./user-uploaded";
import {Mylist} from "./mylist";
import {WatchLater} from "./watch-later";

export class Playlist implements ApiEndpoints {
  endpoint: URL;

  series: Series;
  channelUploaded: ChannelUploaded;
  userUploaded: UserUploaded;
  mylist: Mylist;
  watchLater: WatchLater;

  constructor(baseURL: URL | string) {
    this.endpoint = new URL("playlist/", baseURL);

    this.series = new Series(this.endpoint);
    this.channelUploaded = new ChannelUploaded(this.endpoint);
    this.userUploaded = new UserUploaded(this.endpoint);
    this.mylist = new Mylist(this.endpoint);
    this.watchLater = new WatchLater(this.endpoint);
  }
}
