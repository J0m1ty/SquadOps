export type Point = { x: number, y: number };
export type Rectangle = { x: number, y: number, width: number, height: number };
export type Update = 'loop' | 'resize';
export type Layer = 'background' | 'surface' | 'player' | 'ui' | 'debug';