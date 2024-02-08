import type {VideoId, VideoListItem} from "../../../types";

export interface PlaylistItem {
  watchId: VideoId;
  content: VideoListItem;
}

export interface Playlist {
  id: {
    type: string;
    value: string;
  };
  meta: {
    title: string;
    ownerName: string;
  };
  totalCount: number;
  items: PlaylistItem[];
}
