import { getMP3, getTrackDetail } from "@/api/track"
import { Howl } from "howler"
import { isAccountLoggedIn } from "./auth"
import { getTrackSource } from "./db"
import { Song } from "./neteasecloudmusicapi"

class Dispatcher {
  handlers: Array<any>
  constructor() {
    this.handlers = []
  }

  listen(hander: any) {
    this.handlers.push(hander);
  }

  emit(...args: any) {
    this.handlers.forEach(hander => {
      hander(...args)
    })
  }
}


interface ITrack {
  id: number
  dt: number
  name: string
}

interface PlaylistSource {
  type: string
  id: number
}

enum UNPLAYABLE_CONDITION {
  PLAY_NEXT_TRACK,
  PLAY_PREV_TRACK
}


type RepeatMode = 'on' | 'off' | 'one'

const PLAY_PAUSE_FADE_DURATION = 200

export default class {
  private _playing: boolean
  private _progress: number
  private _enable: boolean
  private _volume: number
  private _volumeBeforeMuted: number
  private _list: ITrack[]
  private _current: number
  private _playlistSource: PlaylistSource
  private _howler: null | Howl
  private _currentTrack: null | ITrack
  private _repeatMode: RepeatMode
  private createdBlobRecords: string[]
  onPlayingChanged: Dispatcher

  constructor() {
    this._playing = false
    this._progress = 0
    this._enable = false
    this._volume = 1
    this._volumeBeforeMuted = 1
    this._list = []
    this._current = 0
    this._playlistSource = { type: 'album', id: 0 }
    this._currentTrack = null
    this._repeatMode = 'on'
    this.createdBlobRecords = []

    this._howler = null
    Object.defineProperty(this, '_howler', {
      enumerable: false
    })
    this.onPlayingChanged = new Dispatcher()

    this._setIntervals()
  }
  private _setIntervals() {
    setInterval(() => {
      if (this._howler === null) {
        return
      }

      this._progress = this._howler.seek()
    }, 1000)
  }

  get volume() {
    return this._volume
  }

  set volume(volume: number) {
    this._volume = volume
    this._howler?.volume(volume)
  }

  get list() {
    return this._list
  }

  set list(list) {
    this._list = list
  }

  get current() {
    return this._current
  }
  set current(current) {
    this._current = current
  }

  get enable() {
    return this._enable
  }

  get playing() {
    return this._playing
  }
  get currentTrack() {
    return this._currentTrack
  }

  get currentTrackId() {
    return this._currentTrack?.id ?? 0
  }

  get playlistSource() {
    return this._playlistSource
  }

  get currentTrackDuration() {
    const trackDuration = this._currentTrack?.dt || 1000
    let duration = ~~(trackDuration / 1000)
    return duration > 1 ? duration - 1 : duration
  }

  get progress() {
    return this._progress
  }

  set progress(value: number) {
    if (this._howler) {
      this._howler.seek(value);
    }
  }

  get repeatMode(): RepeatMode {
    return this._repeatMode
  }
  set repeatMode(value: RepeatMode) {
    this._repeatMode = value
  }

  private _setPlaying(isPlaying: boolean) {

    if (this._playing !== isPlaying) {
      this._playing = isPlaying
      this.onPlayingChanged.emit(this)
    }
  }

  play() {
    if (this._howler?.playing()) return;

    this._howler?.play()

    this._howler?.once('play', () => {
      this._howler?.fade(0, this.volume, PLAY_PAUSE_FADE_DURATION)
      this._setPlaying(true)
    })
  }
  playOrPause() {
    if (this._howler?.playing()) {
      this.pause();
    } else {
      this.play();
    }
  }
  pause() {
    this._howler?.fade(this.volume, 0, PLAY_PAUSE_FADE_DURATION);

    this._howler?.once('fade', () => {
      this._howler?.pause();
      this._setPlaying(false);
    });
  }
  seek(time: number | null = null) {
    if (time !== null) {
      this._howler?.seek(time);
    }
    return this._howler === null ? 0 : this._howler.seek();
  }
  mute() {
    if (this.volume === 0) {
      this.volume = this._volumeBeforeMuted;
    } else {
      this._volumeBeforeMuted = this.volume;
      this.volume = 0;
    }
  }

  _analyser: AnalyserNode | null = null
  _bufferLength: number = 0
  _dataArray: Uint8Array | null = null

  private _playAudioSource(source: string, autoplay = true) {
    Howler.unload()
    this._howler = new Howl({
      src: [source],
      preload: true,
      format: ['mp3', 'flac'],
      onend: () => {
        this._nextTrackCallback()
      },
      onplay: () => {
        this._analyser = Howler.ctx.createAnalyser()
        Howler.masterGain.connect(this._analyser)
        this._analyser.connect(Howler.ctx.destination)
        this._analyser.fftSize = 2048
        this._analyser.minDecibels = -90
        this._analyser.maxDecibels = -10
        this._analyser.smoothingTimeConstant = 0.85
        this._bufferLength = this._analyser.frequencyBinCount
        this._dataArray = new Uint8Array(this._bufferLength)
        setInterval(() => {
          this._test()
        }, 1000);
      }
    })

    this._howler.on('loaderror', (_, errCode) => {
      if (errCode === 3) {
        this.playNextTrack()
      } else {
        const t = this.progress
        this._replaceCurrentTrackAudio(this.currentTrack!, false, false).then(replaced => {
          if (replaced) {
            this._howler?.seek(t)
            this.play()
          }
        })
      }
    })

    if (autoplay) {
      this.play()
    }
  }

  private _test() {
    if (this._analyser === null) return
    this._analyser.getByteTimeDomainData(this._dataArray!)
    console.log(this._dataArray);
  }

  private _nextTrackCallback() {
    if (this.repeatMode === 'one') {
      this._replaceCurrentTrack(this.currentTrack?.id!)

    } else {
      this.playNextTrack()
    }
  }

  playNextTrack() {
    const [trackId, index] = this._getNextTrack()
    if (trackId === undefined) {
      this._howler?.stop()
      this._setPlaying(false)
      return false
    }

    this.current = index
    this._replaceCurrentTrack(trackId.id)
  }

  playPrevTrack() {
    const [trackID, index] = this._getPrevTrack();
    if (trackID === undefined) return false;
    this.current = index;
    this._replaceCurrentTrack(
      trackID.id,
      true,
      UNPLAYABLE_CONDITION.PLAY_PREV_TRACK
    );
    return true;
  }

  private _replaceCurrentTrack(
    id: number,
    autoplay = true,
    ifUnplayableThen = UNPLAYABLE_CONDITION.PLAY_NEXT_TRACK) {
    return getTrackDetail(String(id)).then(data => {
      const track = data.songs[0];
      this._currentTrack = track;
      return this._replaceCurrentTrackAudio(
        track,
        autoplay,
        true,
        ifUnplayableThen
      );
    });
  }

  _replaceCurrentTrackAudio(
    track: ITrack,
    autoplay: boolean,
    arg2: boolean,
    ifUnplayableThen = UNPLAYABLE_CONDITION.PLAY_NEXT_TRACK) {

    return this._getAudioSource(track).then(source => {
      if (source) {
        let replaced = false;
        if (track.id === this.currentTrack?.id) {
          this._playAudioSource(source, autoplay);
          replaced = true;
        }
        return replaced;
      } else {
        console.error(`无法播放 ${track.name}`);
        switch (ifUnplayableThen) {
          case UNPLAYABLE_CONDITION.PLAY_NEXT_TRACK:
            this.playNextTrack()
            break;
          case UNPLAYABLE_CONDITION.PLAY_PREV_TRACK:
            this.playPrevTrack();
            break;
          default:
            console.error(`undefined Unplayable condition: ${ifUnplayableThen}`);
            break;
        }
        return false;
      }
    });
  }


  private _getAudioSourceBlobURL(data: ArrayBuffer) {
    const source = URL.createObjectURL(new Blob([data]))

    for (const url in this.createdBlobRecords) {
      URL.revokeObjectURL(url)
    }

    this.createdBlobRecords = [source]

    return source
  }

  private _getAudioSourceFromCache(id: number) {
    return getTrackSource(id).then(t => {
      if (!t) return null
      return this._getAudioSourceBlobURL(t.source)
    })
  }

  private _getAudioSourceFromNetease(track: ITrack): Promise<string> {
    if (isAccountLoggedIn()) {
      return getMP3(track.id.toString()).then(result => {
        if (!result.data[0]) return
        if (!result.data[0].url) return
        // 试听
        if (result.data[0].freeTrialInfo !== null) return null
        const source = result.data[0].url.replace(/^http:/, 'https:')
        return source
      })
    } else {
      return new Promise(resolve => {
        resolve(`https://music.163.com/song/media/outer/url?id=${track.id}`)
      })
    }
  }

  private _getAudioSource(track: ITrack) {
    return this._getAudioSourceFromCache(track.id).then(source => {
      return source ?? this._getAudioSourceFromNetease(track)
    })
  }


  private _getNextTrack(): [ITrack | undefined, number] {
    const next = this.current + 1

    if (this.repeatMode === 'on') {
      if (this.list.length === next) {
        return [this.list[0], 0]
      }
    }

    return [this.list[next], next]
  }

  private _getPrevTrack(): [ITrack | undefined, number] {
    const next = this.current - 1

    if (this.repeatMode === 'on') {
      if (this.current === 0) {
        return [this.list[this.list.length - 1], this.list.length - 1]
      }
    }

    return [this.list[next], next]
  }
}
