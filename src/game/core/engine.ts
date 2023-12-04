import { Engine } from 'matter-js';

export const engine = Engine.create({
    positionIterations: 10,
    gravity: {
        scale: 0
    }
});