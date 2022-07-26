export interface PlaylistTag {
  id: number
  name: string,
  playlists: Array<Playlist> | undefined
}

export interface Playlist {
  id: number,
  name: string,
  coverImgUrl: string
}


export interface PlaylistDetail {
  id: number,
  name: string,
  coverImgUrl: string
}
