import { Game } from "./game";

/**
 * Represents the camera in the game, defining how the game world is rendered.
 */
export class Camera {
    game: Game;

    /**
     * The position of the camera in the game world.
     */
    position: { x: number, y: number } = { x: 0, y: 0 };

    /**
     * The scale of the camera, where 1 is the default scale.
     */
    scale: number = 1;
    
    /**
     * Defines the screen-space range that the camera displays to.
     */
    output: { x: number, y: number, width: number, height: number } = { x: 0, y: 0, width: 0, height: 0 };

    /**
     * A value between 0 and 1 to represent where along the screen the camera is centered.
     */
    center: { x: number, y: number } = { x: 0, y: 0 };
    
    /**
     * Creates a new Camera instance.
     * @param game The game instance to which this camera is attached.
     */
    constructor(game: Game) {
        this.game = game;
    }


}