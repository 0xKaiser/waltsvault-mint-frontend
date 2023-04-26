export enum AppEventsType {
  'onVirtualScroll' = 'ON_VIRTUAL_SCROLL',
  'onVirtualScrollNavigationContainer' = 'ON_VIRTUAL_SCROLL_NAVIGATION_CONTAINER',
  'onPassengersScrollProgress' = 'ON_PASSENGERS_SCROLL_PROGRESS',
}

export interface AppScrollEvent {
  type: AppEventsType;
  scrollY: number;
  scrollX: number;
  scrollXDelta: number;
  scrollYDelta: number;
}
