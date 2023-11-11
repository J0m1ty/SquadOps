import { Game } from "../main/game";

export interface StaticComponent {
    game: Game;
}

export interface Component extends StaticComponent {
    update(delta: number): void;

    resize?(): void;

    reset?(): void;
}