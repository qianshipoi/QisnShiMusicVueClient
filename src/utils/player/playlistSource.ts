import { Song } from "../neteasecloudmusicapi"
import { detail } from "@/api/playlist"
import { getMP3, getLyric } from '@/api/track'

interface IPlaylistSource {
  type: 'playlist' | 'album' | 'songs' | 'fm'
  id: number,
  tracks: Song[]
}

abstract class AbsPlaylistSource implements IPlaylistSource {
  type: 'playlist' | 'album' | 'songs' | 'fm'
  id: number
  tracks: Song[] = []
  constructor(type: 'playlist' | 'album' | 'songs' | 'fm', id: number) {
    this.type = type
    this.id = id
    this._init();
  }

  private _init() {
    this.fetchTracks().then(tracks => {
      this.tracks = tracks
    })
  }

  private async _getTrackUrl(index: number): Promise<string> {
    const track = this.tracks[index]
    const res = await getMP3(track.id.toString())
    return res.data.data[0].url
  }

  private async _getTrackLyric(index: number): Promise<string> {
    const track = this.tracks[index]
    const res = await getLyric(track.id)
    return res.data.lrc.lyric
  }

  protected abstract fetchTracks(): Promise<Song[]>
}

class PlaylistSource extends AbsPlaylistSource {
  constructor(id: number) {
    super("playlist", id);
  }

  fetchTracks(): Promise<Song[]> {
    return new Promise((resolve, reject) => {
      detail(this.id).then(res => {
        const tracks = res.data.playlist.tracks
        resolve(tracks)
      }).catch(reject)
    })
  }
}


