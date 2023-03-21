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

interface Song {
  url: string | null,
  offset: number,
  start: number | null,
  source: AudioBufferSourceNode | null,
  buffer: AudioBuffer | null
}

class NetworkPlayer {
  audioContext: AudioContext
  playList: Array<Song>
  playIndex: number
  emptyNode: Song
  onPlay: Dispatcher
  onPause: Dispatcher
  onChange: Dispatcher
  onReady: Dispatcher

  constructor() {
    this.audioContext = new AudioContext();
    this.playList = []
    this.playIndex = 0;

    this.emptyNode = {
      url: null,
      offset: 0,
      start: null,
      source: null,
      buffer: null
    }

    this.onPlay = new Dispatcher()
    this.onPause = new Dispatcher()
    this.onChange = new Dispatcher()
    this.onReady = new Dispatcher()
  }

  async readAudioBuffer(file: File): Promise<AudioBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = async evt => {
        this.audioContext
          .decodeAudioData(reader.result as ArrayBuffer)
          .then(resolve, reject)
      }
      reader.onerror = reject
      reader.readAsArrayBuffer(file)
    })
  }

  async append(url: string) {
    const isEmpty = this.isEmpty
    this.playList.push({
      url: url,
      offset: 0,
      start: null,
      source: null,
      buffer: await this.readAudioBuffer(url)
    })

    if (isEmpty) {
      this.onReady.emit(this)
    }
  }

  play() {
    if (!this.playList.length || this.current.source) {
      return
    }

    const source = this.audioContext.createBufferSource()
    source.buffer = this.current.buffer
    source.onended = this.next.bind(this)
    source.connect(this.audioContext.destination)
    source.start(0, this.current.offset)
    this.current.source = source
    this.current.start = this.audioContext.currentTime

    this.onPlay.emit(this)
  }

  pause() {
    if (!this.playList.length || !this.current.source) {
      return
    }

    this.current.source.stop(0)
    this.current.source.disconnect(0)
    this.current.source.onended = null
    this.current.source = null
    this.current.offset = this.position
    this.current.start = null

    this.onPause.emit(this)
  }

  stop() {
    this.pause()
    this.current.offset = 0
    this.current.start = null
  }

  next() {
    this.stop()
    this.playIndex++
    if (this.playIndex >= this.playList.length) {
      this.playIndex = 0
    }
    this.play()
    this.onChange.emit(this)
  }

  prev() {
    this.stop()
    this.playIndex--
    if (this.playIndex < 0) {
      this.playIndex = Math.max(this.playList.length - 1, 0)
    }
    this.play()
    this.onChange.emit(this)
  }

  get isEmpty(): boolean {
    return this.current === this.emptyNode
  }

  get current(): Song {
    return this.playList[this, this.playIndex] || this.emptyNode
  }

  get position(): number {
    if (!this.playList.length) {
      return 0
    }
    return (this.current.offset + (this.current.start !== null ? this.audioContext.currentTime - this.current.start : 0))
  }

  set position(val: number) {
    if (!this.playList.length) {
      return
    }
    this.stop()
    this.current.offset = val
    this.current.start = null
    this.play()
  }

  get duration(): number {
    return this.current.buffer ? this.current.buffer.duration : 0.001
  }
}

export const networkPlayer = new NetworkPlayer();
