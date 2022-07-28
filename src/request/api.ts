import { Request } from "./request";

class api {
  public static playlist = {
    hot: () => Request.get('/playlist/hot'),
    topPlaylistHighquality: (cat: string, limit: number = 50, before: number | undefined) => Request.get('/top/playlist/highquality', { cat, limit, before }),
    detail: (id: number) => Request.get('/playlist/detail', { id }),
  }
}

export {
  api
}
