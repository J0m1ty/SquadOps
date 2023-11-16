export type Point = { x: number, y: number };
export type Rectangle = { x: number, y: number, width: number, height: number };
export type Update = 'loop' | 'resize';
export type Layer = 'background' | 'surface' | 'player' | 'ui' | 'debug';
export type InteractionMode = 'hold' | 'toggle';
export type Hand = 'left' | 'right';
export type Anchor = { w: number, h: number };