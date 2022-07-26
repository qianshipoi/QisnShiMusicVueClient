import { Request } from "./request";

class api {
  public static playlist = {
    hot: () => Request.get('/playlist/hot'),
    topPlaylistHighquality: (cat: string, limit: number = 50, before: number | undefined) => Request.get('/top/playlist/highquality', { cat, limit, before })
  }
}

export {
  api
}
