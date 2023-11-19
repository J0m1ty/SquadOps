import { Assets } from './assets/builder';
import { app } from './core/app';
import { engine } from './core/engine';
import { Game } from './main/game';

(() => {
    const entry = document.getElementById('entry');
    const load = document.getElementById('load');
    const progress = document.getElementById('progress');
    const progressText = document.getElementById('progress-text');

    if (!entry || !load || !progress || !progressText) {
        throw new Error(`Missing entry elements!`);
    }

    app.resizeTo = entry.parentElement!;
    entry.appendChild(app.view);
    
    const game = new Game(app, engine);

    game.loader.load(Assets, (update) => {
        progressText.innerText = update;
    }, (value) => {
        progress.style.width = `${value * 100}%`;
    }, () => {
        load.style.display = 'none';
        game.start();
    });
})();