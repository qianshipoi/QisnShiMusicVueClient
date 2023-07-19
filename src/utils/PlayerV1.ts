import { getAlbum } from '@/api/album'
import { getArtist } from '@/api/artist'
import { fmTrash, personalFM } from '@/api/others'
import { getPlaylistDetail, intelligencePlaylist } from '@/api/playlist'
import { getMP3, getTrackDetail } from '@/api/track'
import { Howl, Howler } from 'howler'
import shuffle from 'lodash/shuffle'
import { isAccountLoggedIn } from './auth'
import { getTrackSource } from './db'

type RepeatMode = 'off' | 'on' | 'one'

type Track = {
  id: number,
  dt: number,
  name: string,
  ar?: {
    name: string
  }[],
  al?: {
    name: string
    picUrl: string
  }
}

const PLAY_PAUSE_FADE_DURATION = 200;

enum UNPLAYABLE_CONDITION {
  PLAY_NEXT_TRACK,
  PLAY_PREV_TRACK
}

const delay = (ms: number) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve('');
    }, ms);
  });

const excludeSaveKeys = [
  '_playing',
  '_personalFMLoading',
  '_personalFMNextLoading',
];

export default class {
  [key: string]: any
  private _playing: boolean
  private _progress: number
  private _enable: boolean
  private _repeatMode: RepeatMode
  private _shuffle: boolean
  private _volume: number
  private _volumeBeforeMuted: number
  private _personalFMLoading: boolean
  private _personalFMNextLoading: boolean
  private _list: number[]
  private _current: number
  private _shuffledList: number[]
  private _shuffledCurrent: number
  private _playlistSource: { type: string; id: number }
  private _currentTrack: Track
  private _playNextList: number[]
  private _isPersonalFM: boolean
  private _personalFMTrack: Track
  private _personalFMNextTrack: Track | undefined
  private createdBlobRecords: string[]
  private _howler: null | Howl
  constructor() {
    this._playing = false
    this._progress = 0
    this._enable = false
    this._repeatMode = 'off'
    this._shuffle = false
    this._volume = 1
    this._volumeBeforeMuted = 1
    this._personalFMLoading = false
    this._personalFMNextLoading = false

    this._list = []
    this._current = 0
    this._shuffledList = []
    this._shuffledCurrent = 0;
    this._playlistSource = { type: 'album', id: 123 }
    this._currentTrack = { id: 86827685, dt: 0, name: '' }
    this._playNextList = []
    this._isPersonalFM = false
    this._personalFMTrack = { id: 0, dt: 0, name: '' }
    this._personalFMNextTrack = { id: 0, dt: 0, name: '' }

    this.createdBlobRecords = []

    this._howler = null
    Object.defineProperty(this, '_howler', {
      enumerable: false
    })

    this._init()

    window.qianshimusic = {
      player: this
    }

  }

  get repeatMode() {
    return this._repeatMode
  }

  set repeatMode(mode: RepeatMode) {
    if (this._isPersonalFM) return
    this._repeatMode = mode
  }

  get shuffle() {
    return this._shuffle
  }

  set shuffle(shuffle: boolean) {
    if (this._isPersonalFM) return
    this._shuffle = shuffle

    if (shuffle) {
      this._shuffleTheList()
    }
  }

  get volume() {
    return this._volume
  }

  set volume(volume: number) {
    this._volume = volume
    this._howler?.volume(volume)
  }

  get list() {
    return this._shuffle ? this._shuffledList : this._list
  }

  set list(list) {
    this._list = list
  }

  get current() {
    return this._shuffle ? this._shuffledCurrent : this._current
  }

  set current(current) {
    if (this._shuffle) {
      this._shuffledCurrent = current
    } else {
      this._current = current
    }
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

  get playNextList() {
    return this._playNextList
  }

  get isPersonalFM() {
    return this._isPersonalFM
  }

  get personalFMTrack() {
    return this._personalFMNextTrack
  }
  get currentTrackDuration() {
    const trackDuration = this._currentTrack.dt || 1000
    let duration = ~~(trackDuration / 1000)
    return duration > 1 ? duration - 1 : duration
  }

  get progress() {
    return this._progress
  }

  set progress(value: number) {
    this._progress = value
  }

  private _init() {
    this._loadSelfFromLocalStorage()
    this._howler?.volume(this.volume)

    if (this._enable) {
      this._replaceCurrentTrack(this.currentTrackId, false).then(() => {
        this._howler?.seek(Number(localStorage.getItem('playerCurrentTrackTime') ?? '0'))
      })
      this._initMediaSession()
    }

    this._setIntervals()

    if (this._personalFMTrack.id === 0 ||
      this._personalFMNextTrack?.id === 0 ||
      this._personalFMTrack.id === this._personalFMNextTrack?.id) {
      personalFM().then(result => {
        this._personalFMTrack = result.data[0]
        this._personalFMNextTrack = result.data[1]
        return this._personalFMTrack
      })
    }
  }

  private _setPlaying(isPlaying: boolean) {
    this._playing = isPlaying
  }

  // 同步播放进度
  private _setIntervals() {
    setInterval(() => {
      if (this._howler === null) return
      this._progress = this._howler.seek()
      localStorage.setItem('playerCurrentTrackTime', this._progress.toString())
    }, 1000)
  }

  private _getNextTrack() {
    const next = this._current + 1
    if (this._playNextList.length > 0) {
      let trackId = this._playNextList.shift()
      return [trackId, this.current]
    }

    if (this.repeatMode === 'on') {
      return [this.list[0], 0]
    }

    return [this.list[next], next]
  }

  private _getPrevTrack() {
    const next = this.current - 1

    if (this.repeatMode === 'on') {
      return [this.list[this.list.length - 1], this.list.length - 1]
    }

    return [this.list[next], next]
  }

  private _initMediaSession() {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => {
        this.play();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        this.pause();
      });
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        this.playPrevTrack();
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        this._playNextTrack(this.isPersonalFM);
      });
      navigator.mediaSession.setActionHandler('stop', () => {
        this.pause();
      });
      navigator.mediaSession.setActionHandler('seekto', event => {
        this.seek(event.seekTime);
        this._updateMediaSessionPositionState();
      });
      navigator.mediaSession.setActionHandler('seekbackward', event => {
        this.seek(this.seek() - (event.seekOffset || 10));
        this._updateMediaSessionPositionState();
      });
      navigator.mediaSession.setActionHandler('seekforward', event => {
        this.seek(this.seek() + (event.seekOffset || 10));
        this._updateMediaSessionPositionState();
      });
    }
  }

  private _loadSelfFromLocalStorage() {
    const player = JSON.parse(localStorage.getItem('player') || '')
    if (!player) return
    for (const [key, value] of Object.entries(player)) {
      this[key] = value
    }
  }

  private _shuffleTheList(firstTrackId: number | 'first' = this.currentTrackId) {
    let list = this._list.filter(tid => tid !== firstTrackId)

    if (firstTrackId === 'first') {
      list = this._list
    }
    this._shuffledList = shuffle(list)

    if (firstTrackId !== 'first') {
      this._shuffledList.unshift(firstTrackId)
    }
  }

  private _playAudioSource(source: string, autoplay = true) {
    Howler.unload()
    this._howler = new Howl({
      src: [source],
      html5: true,
      preload: true,
      format: ['mp3', 'flac'],
      onend: () => {
        this._nextTrackCallback()
      }
    })
    this._howler.on('loaderror', (_, errCode) => {
      if (errCode === 3) {
        this._playNextTrack(this._isPersonalFM)
      } else {
        const t = this.progress
        this._replaceCurrentTrackAudio(this.currentTrack, false, false).then(replaced => {
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
    this.setOutputDevice()
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

  private _getAudioSourceFromNetease(track: Track): Promise<string> {
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

  private _getAudioSource(track: Track) {
    return this._getAudioSourceFromCache(track.id).then(source => {
      return source ?? this._getAudioSourceFromNetease(track)
    })
  }


  private _replaceCurrentTrack(id: number, autoplay: boolean = true, ifUnplayableThen: UNPLAYABLE_CONDITION = UNPLAYABLE_CONDITION.PLAY_NEXT_TRACK) {

    return getTrackDetail(String(id)).then(data => {
      const track = (data as any).songs[0]
      this._currentTrack = track
      this._updateMediaSessionMetaData(track)
      return this._replaceCurrentTrackAudio(track, autoplay, true, ifUnplayableThen)
    })
  }

  private _replaceCurrentTrackAudio(track: Track, autoplay: boolean, isCanNextTrack: boolean, ifUnplayableThen: UNPLAYABLE_CONDITION = UNPLAYABLE_CONDITION.PLAY_NEXT_TRACK) {
    return this._getAudioSource(track).then(source => {
      if (source) {
        let replaced = false
        if (track.id === this.currentTrackId) {
          this._playAudioSource(source, autoplay)
          replaced = true
        }
        if (isCanNextTrack) {
          this._cacheNextTrack()
        }
        return replaced
      } else {
        switch (ifUnplayableThen) {
          case UNPLAYABLE_CONDITION.PLAY_NEXT_TRACK:
            this._playNextTrack(this.isPersonalFM)
            break;
          case UNPLAYABLE_CONDITION.PLAY_PREV_TRACK:
            this.playPrevTrack()
            break;
          default:

            break;
        }
        return false
      }
    })
  }

  private _cacheNextTrack() {
    let nextTrackId = this._isPersonalFM ? this._personalFMTrack?.id ?? 0 : this._getNextTrack()[0]
    if (!nextTrackId) {
      return
    }
    if (this._personalFMTrack.id === nextTrackId) return
    getTrackDetail(String(nextTrackId)).then(response => {
      const data = response.data;
      let track = data.songs[0]
      this._getAudioSource(track)
    })
  }

  private _updateMediaSessionMetaData(track: Track) {
    if ('mediaSession' in navigator === false) {
      return;
    }
    let artists = track.ar!.map(a => a.name);
    const metadata = {
      title: track.name,
      artist: artists.join(','),
      album: track.al!.name,
      artwork: [
        {
          src: track.al!.picUrl + '?param=224y224',
          type: 'image/jpg',
          sizes: '224x224',
        },
        {
          src: track.al!.picUrl + '?param=512y512',
          type: 'image/jpg',
          sizes: '512x512',
        },
      ],
      length: this.currentTrackDuration,
      trackId: this.current,
    };

    navigator.mediaSession.metadata = new window.MediaMetadata(metadata);
  }

  private _updateMediaSessionPositionState() {
    if ('mediaSession' in navigator === false) {
      return;
    }
    if ('setPositionState' in navigator.mediaSession) {
      navigator.mediaSession.setPositionState({
        duration: ~~(this.currentTrack.dt / 1000),
        playbackRate: 1.0,
        position: this.seek(),
      });
    }
  }

  private _playNextTrack(isPersonal: boolean) {
    if (isPersonal) {
      this.playNextFMTrack();
    } else {
      this.playNextTrack();
    }
  }

  appendTrack(trackID: number) {
    this.list.push(trackID);
  }

  private _nextTrackCallback() {
    this._scrobble(this._currentTrack, 0, true);
    if (!this.isPersonalFM && this.repeatMode === 'one') {
      this._replaceCurrentTrack(this.currentTrackID);
    } else {
      this._playNextTrack(this.isPersonalFM);
    }
  }

  private _loadPersonalFMNextTrack() {
    if (this._personalFMNextLoading) {
      return [false, undefined];
    }
    this._personalFMNextLoading = true;
    return personalFM()
      .then(result => {
        if (!result || !result.data) {
          this._personalFMNextTrack = undefined;
        } else {
          this._personalFMNextTrack = result.data[0];
          this._cacheNextTrack(); // cache next track
        }
        this._personalFMNextLoading = false;
        return [true, this._personalFMNextTrack];
      })
      .catch(() => {
        this._personalFMNextTrack = undefined;
        this._personalFMNextLoading = false;
        return [false, this._personalFMNextTrack];
      });
  }

  playNextTrack() {
    // TODO: 切换歌曲时增加加载中的状态
    const [trackID, index] = this._getNextTrack();
    if (trackID === undefined) {
      this._howler?.stop();
      this._setPlaying(false);
      return false;
    }
    this.current = index as number;
    this._replaceCurrentTrack(trackID);
    return true;
  }

  async playNextFMTrack() {
    if (this._personalFMLoading) {
      return false;
    }

    this._isPersonalFM = true;
    if (!this._personalFMNextTrack) {
      this._personalFMLoading = true;
      let result = null;
      let retryCount = 5;
      for (;retryCount >= 0;retryCount--) {
        result = await personalFM().catch(() => null);
        if (!result) {
          this._personalFMLoading = false;
          return false;
        }
        if (result.data?.length > 0) {
          break;
        } else if (retryCount > 0) {
          await delay(1000);
        }
      }
      this._personalFMLoading = false;

      if (retryCount < 0) {
        let content = '获取私人FM数据时重试次数过多，请手动切换下一首';
        console.log(content);
        return false;
      }
      // 这里只能拿到一条数据
      this._personalFMTrack = result!.data[0];
    } else {
      if (this._personalFMNextTrack.id === this._personalFMTrack.id) {
        return false;
      }
      this._personalFMTrack = this._personalFMNextTrack;
    }
    if (this._isPersonalFM) {
      this._replaceCurrentTrack(this._personalFMTrack.id);
    }
    this._loadPersonalFMNextTrack();
    return true;
  }

  playPrevTrack() {
    const [trackID, index] = this._getPrevTrack();
    if (trackID === undefined) return false;
    this.current = index;
    this._replaceCurrentTrack(
      trackID,
      true,
      UNPLAYABLE_CONDITION.PLAY_PREV_TRACK
    );
    return true;
  }

  saveSelfToLocalStorage() {
    let player: {
      [key: string]: any
    } = {};
    for (let [key, value] of Object.entries(this)) {
      if (excludeSaveKeys.includes(key)) continue;
      player[key] = value;
    }

    localStorage.setItem('player', JSON.stringify(player));
  }

  pause() {
    this._howler?.fade(this.volume, 0, PLAY_PAUSE_FADE_DURATION);

    this._howler?.once('fade', () => {
      this._howler?.pause();
      this._setPlaying(false);
      this._pauseDiscordPresence(this._currentTrack);
    });
  }

  play() {
    if (this._howler?.playing()) return;

    this._howler?.play();

    this._howler?.once('play', () => {
      this._howler?.fade(0, this.volume, PLAY_PAUSE_FADE_DURATION);

      this._setPlaying(true);
      if (this._currentTrack.name) {
        // setTitle(this._currentTrack);
      }
      this._playDiscordPresence(this._currentTrack, this.seek());
      // if (store.state.lastfm.key !== undefined) {
      //   trackUpdateNowPlaying({
      //     artist: this.currentTrack.ar[0].name,
      //     track: this.currentTrack.name,
      //     album: this.currentTrack.al.name,
      //     trackNumber: this.currentTrack.no,
      //     duration: ~~(this.currentTrack.dt / 1000),
      //   });
      // }
    });
  }

  playOrPause() {
    if (this._howler?.playing()) {
      this.pause();
    } else {
      this.play();
    }
  }

  seek(time: number | null = null) {
    if (time !== null) {
      this._howler?.seek(time);
      if (this._playing)
        this._playDiscordPresence(this._currentTrack, this.seek());
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

  setOutputDevice() {
    // if (this._howler?._sounds.length <= 0 || !this._howler?._sounds[0]._node) {
    //   return;
    // }
    // this._howler?._sounds[0]._node.setSinkId(store.state.settings.outputDevice);
  }

  replacePlaylist(
    trackIDs: number[],
    playlistSourceID: number,
    playlistSourceType: string,
    autoPlayTrackID: 'first' | number = 'first'
  ) {
    this._isPersonalFM = false;
    if (!this._enabled) this._enabled = true;
    this.list = trackIDs;
    this.current = 0;
    this._playlistSource = {
      type: playlistSourceType,
      id: playlistSourceID,
    };
    if (this.shuffle) this._shuffleTheList(autoPlayTrackID);
    if (autoPlayTrackID === 'first') {
      this._replaceCurrentTrack(this.list[0]);
    } else {
      this.current = trackIDs.indexOf(autoPlayTrackID);
      this._replaceCurrentTrack(autoPlayTrackID);
    }
  }

  playAlbumByID(id: number, trackID: 'first' | number = 'first') {
    getAlbum(id).then(data => {
      let trackIDs = (data.songs as { id: number }[]).map(t => t.id);
      this.replacePlaylist(trackIDs, id, 'album', trackID);
    });
  }

  playPlaylistByID(id: number, trackID: 'first' | number = 'first', noCache = false) {
    console.debug(
      `[debug][Player.js] playPlaylistByID 👉 id:${id} trackID:${trackID} noCache:${noCache}`
    );
    getPlaylistDetail(id, noCache).then(data => {
      let trackIDs = (data.data.playlist.trackIds as { id: number }[]).map(t => t.id);
      this.replacePlaylist(trackIDs, id, 'playlist', trackID);
    });
  }

  playArtistByID(id: number, trackID: number | 'first' = 'first') {
    getArtist(id).then(data => {
      let trackIDs = (data.data.hotSongs as { id: number }[]).map(t => t.id);
      this.replacePlaylist(trackIDs, id, 'artist', trackID);
    });
  }

  playTrackOnListByID(id: number, listName = 'default') {
    if (listName === 'default') {
      this._current = this._list.findIndex(t => t === id);
    }
    this._replaceCurrentTrack(id);
  }

  playIntelligenceListById(id: number, trackID: number | 'first' = 'first', noCache = false) {
    getPlaylistDetail(id, noCache).then(data => {
      const randomId = Math.floor(
        Math.random() * (data.data.playlist.trackIds.length + 1)
      );
      const songId = data.data.playlist.trackIds[randomId].id;
      intelligencePlaylist({ id: songId, pid: id }).then(result => {
        let trackIDs = (result.data as { id: number }[]).map(t => t.id);
        this.replacePlaylist(trackIDs, id, 'playlist', trackID);
      });
    });
  }

  addTrackToPlayNext(trackID: number, playNow = false) {
    this._playNextList.push(trackID);
    if (playNow) {
      this.playNextTrack();
    }
  }

  playPersonalFM() {
    this._isPersonalFM = true;
    if (!this._enabled) this._enabled = true;
    if (this.currentTrackID !== this._personalFMTrack.id) {
      this._replaceCurrentTrack(this._personalFMTrack.id, true);
    } else {
      this.playOrPause();
    }
  }

  async moveToFMTrash() {
    this._isPersonalFM = true;
    let id = this._personalFMTrack.id;
    if (await this.playNextFMTrack()) {
      fmTrash(id);
    }
  }

  sendSelfToIpcMain() {
    // if (process.env.IS_ELECTRON !== true) return false;
    // let liked = store.state.liked.songs.includes(this.currentTrack.id);
    // ipcRenderer?.send('player', {
    //   playing: this.playing,
    //   likedCurrentTrack: liked,
    // });
    // setTrayLikeState(liked);
  }

  switchRepeatMode() {
    if (this._repeatMode === 'on') {
      this.repeatMode = 'one';
    } else if (this._repeatMode === 'one') {
      this.repeatMode = 'off';
    } else {
      this.repeatMode = 'on';
    }
    // if (isCreateMpris) {
    //   ipcRenderer?.send('switchRepeatMode', this.repeatMode);
    // }
  }

  switchShuffle() {
    this.shuffle = !this.shuffle;
    // if (isCreateMpris) {
    //   ipcRenderer?.send('switchShuffle', this.shuffle);
    // }
  }

  switchReversed() {
    this.reversed = !this.reversed;
  }

  clearPlayNextList() {
    this._playNextList = [];
  }

  removeTrackFromQueue(index: number) {
    this._playNextList.splice(index, 1);
  }
}
