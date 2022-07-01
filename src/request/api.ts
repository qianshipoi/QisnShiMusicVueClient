import { Request } from "./request";

class api {
  public static playlist = {
    hot: () => Request.get('/playlist/hot')
  }
}

export {
  api
}
