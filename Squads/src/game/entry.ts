import { app } from './core/app';
import { engine } from './core/engine';
import { Game } from './main/game';
import { AssetList } from './basic/assets';

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
    
    const game = new Game(app, engine, {
        load: AssetList,
        onUpdate: (update) => {
            progressText.innerText = update;
        },
        onProgress: (value) => {
            progress.style.width = `${value * 100}%`;
        },
        onComplete: () => {
            load.style.display = 'none';
            game.start();
        }
    });
})();