export type Item = 'melee' | 'gun' | 'grenade';
export type Hand = 'left' | 'right';
export type Vertical = 'above' | 'below';

export type HandAnimation = {
    side: Hand;
    vertical: Vertical;
    target: { x: number, y: number }
    start: number;
    duration: number;
    next?: "back" | HandAnimation;
}

export type LeftHandAnimation = HandAnimation & {
    side: 'left';
}

export type RightHandAnimation = HandAnimation & {
    side: 'right';
}

export type DuelHandAnimation = {
    left: LeftHandAnimation;
    right: RightHandAnimation;
}