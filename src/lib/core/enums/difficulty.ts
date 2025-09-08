'use strict';

/**
 * Numeric difficulty values. Use `DIFFICULTY.EASY`, `DIFFICULTY.MEDIUM`, `DIFFICULTY.HARD`.
 * Implemented as a const object (no runtime enum syntax) to satisfy
 * the project's TypeScript configuration.
 */
export const DIFFICULTY = {
	EASY: 0,
	MEDIUM: 1,
	HARD: 2
} as const;

export type DIFFICULTY = (typeof DIFFICULTY)[keyof typeof DIFFICULTY];

export default DIFFICULTY;
