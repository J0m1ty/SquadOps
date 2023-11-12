import { BitmapFont } from "pixi.js";
import { Game } from "../main/game";
import { StaticComponent } from "./component";

export class Fonts implements StaticComponent {
    game: Game;

    constructor(game: Game) {
        this.game = game;
        
        BitmapFont.from("DebugFont", {
            fill: 0xffffff,
            fontSize: 12,
            fontFamily: "monospace",
        }, {
            chars: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,!?-+/():;%&`'*#=[]\" ",
        });
    }
}