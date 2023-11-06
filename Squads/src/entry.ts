import { Application } from '@pixi/app';

const app = new Application<HTMLCanvasElement>({
    backgroundColor: 0x1099bb,
    resolution: 1,
    antialias: true
});

document.addEventListener('DOMContentLoaded', () => {
    const entry = document.getElementById('entry');

    if (!entry) return;

    app.resizeTo = entry.parentElement!;
    entry.appendChild(app.view);
});