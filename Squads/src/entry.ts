import { app } from './core/app';
import { engine } from './core/engine';
import { Game } from './main/game';

(() => {
    const entry = document.getElementById('entry');

    if (!entry) return;

    app.resizeTo = entry.parentElement!;
    entry.appendChild(app.view);

    const game = new Game(app, engine);
    game.start();
})();