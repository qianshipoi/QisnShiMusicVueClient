import { Request } from './request';

declare type SearchType =
  | 1
  | 10
  | 100
  | 1000
  | 1002
  | 1004
  | 1006
  | 1009
  | 1014
  | 1018
  | 2000;

class api {
  public static playlist = {
    hot: () => Request.get('/playlist/hot'),
    topPlaylistHighquality: (
      cat: string,
      limit: number = 50,
      before: number | undefined = undefined
    ) => Request.get('/top/playlist/highquality', { cat, limit, before }),
    detail: (id: number) => Request.get('/playlist/detail', { id }),
    search: (
      keywords: string,
      type: number,
      limit: number = 30,
      offset: number = 0
    ) => Request.get('/cloudsearch', { keywords, limit, offset, type }),
    catlist: () => Request.get('/playlist/catlist'),
    topArtists: ({ limit = 30, offset = 0 }) =>
      Request.get('/top/artists', { limit, offset }),
    topSong: (type: number) => Request.get('/top/song', { type })
  };
}

export { api };
