export type HandType = 'left' | 'right';

export type Vertical = 'above' | 'below';

export type MeleeHolding = HandType | 'both';
export type GunHolding = 'both' | 'dual';
export type Holding = MeleeHolding | GunHolding;

export type HandPosition<T extends string = HandType> = {
    side: T;
    vertical: Vertical;
    position: { x: number, y: number };
}

export type Animation<T extends HandType | 'none'> = {
    duration: number;
    easing: (t: number) => number;
    curve: (t: number, origin: { x: number, y: number }) => { x: number, y: number, r?: number };
    next?: Animation<T>;
} & (T extends 'none' ? {} : { 
    pivot?: "hand" | "body";
    side: T;
});

export type GameAnimation = Animation<HandType | 'none'>;

export type DualHandPosition = {
    left: HandPosition<'left'>;
    right: HandPosition<'right'>;
}

export type DualAnimation = {
    dual: true;
    left: Animation<'left'> | null;
    right: Animation<'right'> | null;
}