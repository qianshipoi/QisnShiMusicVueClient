declare module 'wow.js' {
  type WowOptions = {
    boxClass?: string,      // default
    animateClass?: string, // default
    offset?: number,          // default
    mobile?: boolean,       // default
    live?: boolean,        // default
    callback?: (box: HTMLElement) => void,
    scrollContainer?: string,
    resetAnimation?: boolean
  }
  export default class WOW {
    constructor(options?: WowOptions)
    init()
  }
}
