export type Hand = 'left' | 'right';
export type Vertical = 'above' | 'below';

export type HandPosition<T extends string = Hand> = {
    side: T;
    vertical: Vertical;
    position: { x: number, y: number }
}

type Anim<T extends string = Hand> = {
    side: T;
    start: number;
    duration: number;
    easing: (t: number) => number;
}

export type LinearAnimation<T extends string = Hand> = Anim<T> & {
    type: 'linear';
    target: { x: number, y: number };
}

export type CircularAnimation<T extends string = Hand> = Anim<T> & {
    type: 'circular';
    center: { x: number, y: number };
    radius: number;
    angle: number;
    clockwise: boolean;
}

export type Animation<T extends string = Hand> = (LinearAnimation<T> | CircularAnimation<T>) & {
    next?: Animation<T>;
}

export type DualHandPosition = {
    left: HandPosition<'left'>;
    right: HandPosition<'right'>;
}

export type DualAnimation = {
    left: Animation<'left'>;
    right: Animation<'right'>;
}