export type Item = 'melee' | 'gun' | 'grenade';
export type Hand = 'left' | 'right';

export type HandAnimation = {
    side: Hand;
    target: { x: number, y: number }
    start: number;
    duration: number;
    next?: "back" | HandAnimation;
}

export type LeftHandAnimation = HandAnimation & {
    side: 'left';
    target: { x: number, y: number }
    start: number;
    duration: number;
    next?: "back" | HandAnimation;
}

export type RightHandAnimation = HandAnimation & {
    side: 'right';
    target: { x: number, y: number }
    start: number;
    duration: number;
    next?: "back" | HandAnimation;
}

export type DuelHandAnimation = {
    left: LeftHandAnimation;
    right: RightHandAnimation;
}