interface Lrc {
  lrc?: {
    lyric: string
  }
  tlyric?: {
    lyric: string
  }
  lyricUser?: any
  transUser?: any
  time: any
  rawTime: string
  content: string
}

export function lyricParser(lrc: Lrc) {
  return {
    lyric: parseLyric(lrc?.lrc?.lyric || ''),
    tlyric: parseLyric(lrc?.tlyric?.lyric || ''),
    lyricuser: lrc.lyricUser,
    transuser: lrc.transUser,
  };
}

// regexr.com/6e52n
const extractLrcRegex =
  /^(?<lyricTimestamps>(?:\[.+?\])+)(?!\[)(?<content>.+)$/gm;
const extractTimestampRegex =
  /\[(?<min>\d+):(?<sec>\d+)(?:\.|:)*(?<ms>\d+)*\]/g;

/**
 * @typedef {{time: number, rawTime: string, content: string}} ParsedLyric
 */

/**
 * Parse the lyric string.
 *
 * @param {string} lrc The `lrc` input.
 * @returns {ParsedLyric[]} The parsed lyric.
 * @example parseLyric("[00:00.00] Hello, World!\n[00:00.10] Test\n");
 */
function parseLyric(lrc: string) {
  /**
   * A sorted list of parsed lyric and its timestamp.
   *
   * @type {ParsedLyric[]}
   * @see binarySearch
   */
  const parsedLyrics = new Array<Lrc>();

  /**
   * Find the appropriate index to push our parsed lyric.
   * @param {ParsedLyric} lyric
   */
  const binarySearch = (lyric: Lrc) => {
    let time = lyric.time;

    let low = 0;
    let high = parsedLyrics.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const midTime = parsedLyrics[mid].time;
      if (midTime === time) {
        return mid;
      } else if (midTime < time) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    return low;
  };

  for (const line of lrc.trim().matchAll(extractLrcRegex)) {
    const lyricTimestamps = line.groups!['lyricTimestamps']
    const content = line.groups!['content']

    for (const timestamp of lyricTimestamps.matchAll(extractTimestampRegex)) {
      const min = timestamp.groups!['min']
      const sec = timestamp.groups!['sec']
      const ms = timestamp.groups!['ms']
      const rawTime = timestamp[0];
      const time = Number(min) * 60 + Number(sec) + Number(ms ?? 0) * 0.001;

      /** @type {ParsedLyric} */
      const parsedLyric = { rawTime, time, content: trimContent(content) };
      parsedLyrics.splice(binarySearch(parsedLyric), 0, parsedLyric);
    }
  }

  return parsedLyrics;
}

/**
 * @param {string} content
 * @returns {string}
 */
function trimContent(content: string) {
  let t = content.trim();
  return t.length < 1 ? content : t;
}
