'use strict';

import DIFFICULTY from "./difficulty";
import FIELD_SIZE from "./fieldSize";

export const MINES_COUNT = {
    [DIFFICULTY.EASY]: Math.round((FIELD_SIZE[DIFFICULTY.EASY] ** 2) / 5),
    [DIFFICULTY.MEDIUM]: (FIELD_SIZE[DIFFICULTY.MEDIUM] ** 2) / 2,
    [DIFFICULTY.HARD]: (FIELD_SIZE[DIFFICULTY.HARD] ** 2) / 2
} as const;

export type MINES_COUNT = (typeof MINES_COUNT)[keyof typeof MINES_COUNT];

export default MINES_COUNT;