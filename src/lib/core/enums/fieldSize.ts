import DIFFICULTY from "./difficulty";

export const FIELD_SIZE = {
    [DIFFICULTY.EASY]: 8,
    [DIFFICULTY.MEDIUM]: 12,
    [DIFFICULTY.HARD]: 16
} as const;

export type FIELD_SIZE = (typeof FIELD_SIZE)[keyof typeof FIELD_SIZE];

export default FIELD_SIZE;