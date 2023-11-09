import { Application } from '@pixi/app';

export const app = new Application<HTMLCanvasElement>({
    backgroundColor: 0x1099bb,
    resolution: 1,
    antialias: true,
    autoStart: false
});