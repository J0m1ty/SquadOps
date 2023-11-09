export const map = (value: number, min1: number, max1: number, min2: number, max2: number) => {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

export const clamp = (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max);
}