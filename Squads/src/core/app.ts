import { Application } from 'pixi.js';

export const app = new Application<HTMLCanvasElement>({
    backgroundColor: 0x1099bb,
    antialias: true,
    autoStart: false,
    resizeTo: window
});