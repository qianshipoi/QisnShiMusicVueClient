import axios from 'axios'
import Dexie from 'dexie'
import { useStore } from '@/store'
import { Privilege, Song } from '@/utils/neteasecloudmusicapi'


const db = new Dexie('qianshimusic')

db.version(1).stores({
  trackSources: '&id, createTime',
  trackDetail: '&id, updateTime',
  lyric: '&id, updateTime',
  album: '&id, updateTime',
})

let tracksCacheBytes = 0

async function deleteExcessCache() {
  try {
    const delCache = await db.table('trackSources').orderBy('createTime').first();
    await db.table('trackSources').delete(delCache.id);
    tracksCacheBytes -= delCache.source.byteLength;
    console.debug(
      `[debug][db.js] deleteExcessCacheSucces, track: ${delCache.name}, size: ${delCache.source.byteLength}, cacheSize:${tracksCacheBytes}`
    );
    deleteExcessCache();
  } catch (error) {
    console.debug('[debug][db.js] deleteExcessCacheFailed', error);
  }
}

export function cacheTrackSource(trackInfo: Song, url: string, bitRate: number, from = 'netease') {
  const name = trackInfo.name
  const artist = (trackInfo.artists && trackInfo.ar[0]?.name) || (trackInfo.artists && trackInfo.artists[0]?.name) || 'Unknown'
  let cover = trackInfo.al.picUrl
  if (cover.slice(0, 5) !== 'https') {
    cover = 'https' + cover.slice(4);
  }
  axios.get(`${cover}?param=512y512`)
  axios.get(`${cover}?param=224y224`)
  axios.get(`${cover}?param=1024y1024`)
  return axios.get(url, {
    responseType: 'arraybuffer'
  })
    .then(response => {
      db.table('trackSources').put({
        id: trackInfo.id,
        source: response.data,
        bitRate,
        from,
        name,
        artist,
        createTime: new Date().getTime()
      })

      tracksCacheBytes += response.data.byteLength

      return { trackId: trackInfo.id, source: response.data, bitRate }
    })
}

export function getTrackSource(id: number) {
  return db.table('trackSources').get(Number(id)).then(track => {
    if (!track) return null;
    console.debug(
      `[debug][db.js] get track from cache 👉 ${track.name} by ${track.artist}`
    );
    return track;
  });
}

export function cacheTrackDetail(track: Song, privileges: Privilege) {
  db.table('trackDetail').put({
    id: track.id,
    detail: track,
    privileges: privileges,
    updateTime: new Date().getTime(),
  });
}

export function getTrackDetailFromCache(ids: Array<string>) {
  return db.table('trackDetail')
    .filter(track => {
      return ids.includes(String(track.id));
    })
    .toArray()
    .then(tracks => {
      const result = { songs: new Array<Song>, privileges: new Array<Privilege> };
      ids.map(id => {
        const one = (tracks as Array<{ id: number, detail: Song, privileges: Privilege }>).find(t => String(t.id) === id);
        if (one) {
          result.songs.push(one.detail);
          result.privileges.push(one.privileges);
        }
      });
      return result;
    });
}

export function cacheLyric(id: number, lyrics: string) {
  db.table('lyric').put({
    id,
    lyrics,
    updateTime: new Date().getTime(),
  });
}

export function getLyricFromCache(id: number) {
  return db.table('lyric').get(Number(id)).then(result => {
    if (!result) return undefined;
    return result.lyrics;
  });
}

export function cacheAlbum(id: number, album: any) {
  db.table('album').put({
    id: Number(id),
    album,
    updateTime: new Date().getTime(),
  });
}

export function getAlbumFromCache(id: number) {
  return db.table('album').get(Number(id)).then(result => {
    if (!result) return undefined;
    return result.album;
  });
}

export function countDBSize() {
  const trackSizes = new Array<number>;
  return db.table('trackSources')
    .each(track => {
      trackSizes.push(track.source.byteLength as number);
    })
    .then(() => {
      const res = {
        bytes: trackSizes.reduce((s1, s2) => s1 + s2, 0),
        length: trackSizes.length,
      };
      tracksCacheBytes = res.bytes;
      console.debug(
        `[debug][db.js] load tracksCacheBytes: ${tracksCacheBytes}`
      );
      return res;
    });
}

export function clearDB() {
  return new Promise(resolve => {
    db.tables.forEach(function (table) {
      table.clear();
    });
    resolve(null);
  });
}
