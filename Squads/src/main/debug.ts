import { BitmapText, Container, Graphics, Text } from "pixi.js";
import { DynamicComponent } from "../basic/component";
import { Game } from "./game";

export class Debug implements DynamicComponent {
    game: Game;

    data: Map<string, {
        value: string,
        timestamp: number
    }> = new Map();

    container: Container = new Container();
    background: Graphics = new Graphics();
    text: BitmapText;

    constructor(game: Game) {
        this.game = game;

        this.text = new BitmapText("", {
            fontName: "DebugFont",
            align: "left",
        });

        this.container.addChild(this.background);
        this.container.addChild(this.text);

        this.game.layers.debug.addChild(this.container);
    }
    
    set(key: string, value: string) {
        if (this.data.size > 10) return;
        this.data.set(key, {
            value,
            timestamp: Date.now()
        });
    }

    update(delta: number) {
        const height = this.data.size * 15;

        this.background.clear();
        this.background.beginFill(0x000000, 0.5);
        this.background.drawRoundedRect(20, this.game.height - height - 30, 200, height + 10, 10);
        this.background.endFill();

        let text = "";

        this.data.forEach(({ value }, k) => {
            text += `${k}: ${value}` + "\n";
        });

        this.text.text = text;

        this.text.position.set(30, this.game.height - height - 20);
    }

    reset() {
        this.data.forEach((v, k) => {
            if (Date.now() - v.timestamp > 5000) {
                this.data.delete(k);
            }
        });
    }
}