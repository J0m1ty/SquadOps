import { Container, Graphics, Text } from "pixi.js";
import { Component } from "../basic/component";
import { Game } from "./game";

export class Debug implements Component {
    game: Game;

    data: Map<string, {
        value: string,
        timestamp: number
    }> = new Map();

    container: Container = new Container();
    background: Graphics = new Graphics();
    textContainer: Container = new Container();

    constructor(game: Game) {
        this.game = game;

        this.container.addChild(this.background);
        this.container.addChild(this.textContainer);

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
        this.background.drawRoundedRect(20, this.game.height - height - 40, 200, height + 20, 10);
        this.background.endFill();

        this.textContainer.removeChildren();

        this.data.forEach(({ value }, k) => {
            const text = new Text(`${k}: ${value}`, {
                align: "left",
                fill: 0xffffff,
                fontSize: 12
            });
            text.position.set(30, this.game.height - height - 30 + 15 * this.textContainer.children.length);
            this.textContainer.addChild(text);
        });
    }

    reset() {
        this.data.forEach((v, k) => {
            if (Date.now() - v.timestamp > 5000) {
                this.data.delete(k);
            }
        });
    }
}