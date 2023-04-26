/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />
/// <reference types="stats.js" />

declare global {
  interface Window {
    eventDispatcher: EventDispatcher;
    virtualScrollY: number;
    virtualScrollX: number;
  }
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}
declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.glsl' {
  const value: string;
  export default value;
}
