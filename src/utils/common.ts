import { isAccountLoggedIn } from "./auth";
import { refreshCookie } from "@/api/auth";
import { dailySignin } from "@/api/user";
import dayjs from 'dayjs'
import { useStore } from "@/store";

export function isTrackPlayable(track: any) {
  let result = {
    playable: true,
    reason: ''
  }

  if (track?.privilege?.pl > 0) {
    return result
  }

  if (isAccountLoggedIn() && track?.privilege?.cs) {
    return result
  }

  if (track.fee === 1 || track.private?.fee === 1) {
    if (isAccountLoggedIn() && useStore().user.vipType === 11) {
      result.playable = true
    } else {
      result.playable = false
      result.reason = 'VIP Only'
    }
  } else if (track.fee === 4 || track.private?.fee === 4) {
    result.playable = false;
    result.reason = '付费专辑';
  } else if (
    track.noCopyrightRcmd !== null &&
    track.noCopyrightRcmd !== undefined
  ) {
    result.playable = false;
    result.reason = '无版权';
  } else if (track.privilege?.st < 0 && isAccountLoggedIn()) {
    result.playable = false;
    result.reason = '已下架';
  }
  return result;
}

export function mapTrackPlayableStatus(tracks: any[], privileges: any[] = []) {
  if (tracks?.length === undefined) return tracks
  return tracks.map(t => {
    const privilege = privileges.find(item => item.id === t.id) || {}
    if (t.privilege) {
      Object.assign(t.privilege, privilege)
    } else {
      t.privilege = privilege
    }
    let result = isTrackPlayable(t)
    t.playable = result.playable
    t.reason = result.reason
    return t
  })
}

export function randomNum(minNum: number, maxNum: number) {
  switch (arguments.length) {
    case 1:
      return Math.random() * minNum + 1;
    case 2:
      return Math.random() * (maxNum - minNum + 1) + minNum;
    default:
      return 0;
  }
}

type stringKey = Record<string, any>

export function shuffleAList(list: any[]) {
  let sortsList = list.map(t => t.sort);
  for (let i = 1;i < sortsList.length;i++) {
    const random = Math.floor(Math.random() * (i + 1));
    [sortsList[i], sortsList[random]] = [sortsList[random], sortsList[i]];
  }
  let newSorts: stringKey = {};
  list.map(track => {
    newSorts[track.id] = sortsList.pop();
  });
  return newSorts;
}

export function throttle(fn: any, time: number) {
  let isRun = false;
  return function (this: any, ...args: any[]) {
    if (isRun) return;
    isRun = true;
    fn.apply(this, args);
    setTimeout(() => {
      isRun = false;
    }, time);
  };
}

export function updateHttps(url: string) {
  if (!url) return '';
  return url.replace(/^http:/, 'https:');
}

export function splitSoundtrackAlbumTitle(title: string) {
  let keywords = [
    'Music from the Original Motion Picture Score',
    'The Original Motion Picture Soundtrack',
    'Original MGM Motion Picture Soundtrack',
    'Complete Original Motion Picture Score',
    'Original Music From The Motion Picture',
    'Music From The Disney+ Original Movie',
    'Original Music From The Netflix Film',
    'Original Score to the Motion Picture',
    'Original Motion Picture Soundtrack',
    'Soundtrack from the Motion Picture',
    'Original Television Soundtrack',
    'Original Motion Picture Score',
    'Music From the Motion Picture',
    'Music From The Motion Picture',
    'Complete Motion Picture Score',
    'Music from the Motion Picture',
    'Original Videogame Soundtrack',
    'La Bande Originale du Film',
    'Music from the Miniseries',
    'Bande Originale du Film',
    'Die Original Filmmusik',
    'Original Soundtrack',
    'Complete Score',
    'Original Score',
  ];
  for (let keyword of keywords) {
    if (title.includes(keyword) === false) continue;
    return {
      title: title
        .replace(`(${keyword})`, '')
        .replace(`: ${keyword}`, '')
        .replace(`[${keyword}]`, '')
        .replace(`- ${keyword}`, '')
        .replace(`${keyword}`, ''),
      subtitle: keyword,
    };
  }
  return {
    title: title,
    subtitle: '',
  };
}

export function splitAlbumTitle(title: string) {
  let keywords = [
    'Bonus Tracks Edition',
    'Complete Edition',
    'Deluxe Edition',
    'Deluxe Version',
    'Tour Edition',
  ];
  for (let keyword of keywords) {
    if (title.includes(keyword) === false) continue;
    return {
      title: title
        .replace(`(${keyword})`, '')
        .replace(`: ${keyword}`, '')
        .replace(`[${keyword}]`, '')
        .replace(`- ${keyword}`, '')
        .replace(`${keyword}`, ''),
      subtitle: keyword,
    };
  }
  return {
    title: title,
    subtitle: '',
  };
}

export function formatTrackTime(value: number) {
  if (!value) return '';
  let min = ~~((value / 60) % 60);
  let sec = (~~(value % 60)).toString().padStart(2, '0');
  return `${min}:${sec}`;
}


