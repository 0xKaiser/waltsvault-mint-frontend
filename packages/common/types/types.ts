/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />
import { EventDispatcher } from 'three';

declare global {
  interface Window {
    eventDispatcher: EventDispatcher;
    virtualScrollY: number;
    virtualScrollX: number;
  }
}

export enum AppEventsType {
  'onVirtualScroll' = 'ON_VIRTUAL_SCROLL',
  'onVirtualScrollNavigationContainer' = 'ON_VIRTUAL_SCROLL_NAVIGATION_CONTAINER',
}

export interface AppScrollEvent {
  type: AppEventsType;
  scrollY: number;
  scrollX: number;
  scrollXDelta: number;
  scrollYDelta: number;
}

export type ArrElement<ArrType> = ArrType extends readonly (infer ElementType)[] ? ElementType : never;

export interface TheaterDefaultProps {
  theatreKey: string;
  visible?: boolean | 'editor';
}
