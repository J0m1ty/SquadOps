import { BitmapText, Container, Graphics, Text } from "pixi.js";
import { DynamicComponent } from "../basic/component";
import { Game } from "./game";

export class Debug implements DynamicComponent {
    game: Game;

    data: Map<string, {
        value: string,
        timestamp: number
    }> = new Map();

    constructor(game: Game) {
        this.game = game;
    }
    
    set(key: string, value: string) {
        if (this.data.size >= 3) return;
        this.data.set(key, {
            value,
            timestamp: Date.now()
        });
    }

    update(delta: number) {
        let text = "";

        this.data.forEach(({ value }, k) => {
            text += `${k}: ${value}` + "\n";
        });

        this.game.gui.builder.debug.text = text;
    }

    reset() {
        this.data.forEach((v, k) => {
            if (Date.now() - v.timestamp > 5000) {
                this.data.delete(k);
            }
        });
    }
}