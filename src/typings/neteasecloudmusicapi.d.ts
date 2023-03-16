import { List } from 'lodash';
import { boolean, number } from 'yargs';

export interface PlaylistTag {
  id: number;
  name: string;
  playlists: Array<Playlist> | undefined;
}

export interface Playlist {
  id: number;
  name: string;
  coverImgUrl: string;
  desceiption: string;
  trackCount: number;
}

export interface PlaylistDetail {
  id: number;
  name: string;
  coverImgUrl: string;
  description: string;
  creator: Creator;
  playCount: number;
  shareCount: number;
  subscribedCount: number;
  subscribers: Array<Creator>;
  tag: Array<string>;
  trackCount: number;
  trackIds: Array<TrackId>;
  trackNumberUpdateTime: number;
  trackUpdateTime: number;
  tracks: Array<Song>;
}

export interface Artist {
  img1v1Id: number;
  topicPerson: number;
  picId: number;
  trans: string;
  albumSize: number;
  img1v1Url: string;
  picUrl: string;
  followed: boolean;
  briefDesc: string;
  alias: Array<string>;
  musicSize: number;
  name: string;
  id: number;
  img1v1Id_str: string;
  accountId: number;
  identityIconUrl: string;
  alg: string;
  info: string;
  mvSize: number | undefined;
}

export interface Quality {
  br: number;
  fid: number;
  size: number;
  sr: number;
  vd: number;
}

export interface Privilege {
  cp: number;
  cs: boolean;
  dl: number;
  fee: number;
  fl: number;
  flag: number;
  id: number;
  maxbr: number;
  payed: number;
  pl: number;
  preSell: boolean;
  sp: number;
  st: number;
  subp: number;
  toast: boolean;
}

export interface Song {
  album: Album;
  al: Album;
  alia: Array<string> | undefined;
  artists: Array<Artist>;
  cd: string | undefined;
  cf: string | undefined;
  copyright: number;
  cp: number;
  djId: number;
  duration: number;
  dt: number;
  fee: number;
  ftype: number;
  h: Quality | undefined;
  hr: Quality | undefined;
  id: number;
  l: Quality | undefined;
  m: Quality | undefined;
  sq: Quality | undefined;
  mark: number;
  mst: number;
  mv: number;
  name: string;
  no: number;
  originCoverType: number;
  pop: number;
  privilege: Privilege | undefined;
  pst: number;
  publishTime: number;
  resourceState: boolean;
  rt: string;
  rtUrls: Array<string>;
  rtype: number;
  s_id: number;
  single: number;
  st: number;
  t: number;
  tns: Array<string>;
  v: number;
  version: number;
}

export interface Album {
  id: number;
  name: string;
  type: string;
  size: number;
  picUrl: string;
  description: string;
  tags: string;
  artist: Artist;
  artists: Array<Artist>;
  PublishTime: number;
  Alg: string;
  Alias: Array<string>;
  BlurPicUrl: string;
  BriefDesc: string | undefined;
  CommentThreadId: string | undefined;
  Company: string;
  CompanyId: number;
  ContainedSong: string;
  CopyrightId: number;
  Mark: number;
  OnSale: boolean;
  Paid: boolean;
  PicId: number;
  songs: Array<Song> | undefined;
  status: number;
  tns: Array<string>;
  msg: Array<string>;
  subtime: number;
  transNames: Array<string>;
}

export interface TrackId {
  at: number;
  id: number;
  uid: number;
  v: number;
}

export interface Creator {
  avatarUrl: string;
  backgroundUrl: string;
  defaultAvatar: boolean;
  expertTags: Array<string>;
  followed: boolean;
  nickname: string;
}
