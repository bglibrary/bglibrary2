/**
 * Domain types and enums for the Game model.
 * @see specs/phase_5_2_game_domain_model.md
 */

/** @readonly */
const PlayDuration = Object.freeze({
  SHORT: "SHORT",
  MEDIUM: "MEDIUM",
  LONG: "LONG",
});

/** @readonly */
const FirstPlayComplexity = Object.freeze({
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
});

/**
 * Age recommendation buckets (discrete typical values).
 * @readonly
 */
const AgeRange = Object.freeze({
  AGE_6_PLUS: "AGE_6_PLUS",
  AGE_8_PLUS: "AGE_8_PLUS",
  AGE_10_PLUS: "AGE_10_PLUS",
  AGE_12_PLUS: "AGE_12_PLUS",
  AGE_14_PLUS: "AGE_14_PLUS",
});

const PLAY_DURATION_VALUES = Object.values(PlayDuration);
const FIRST_PLAY_COMPLEXITY_VALUES = Object.values(FirstPlayComplexity);
const AGE_RANGE_VALUES = Object.values(AgeRange);

/**
 * @typedef {{ name: string, year?: number }} Award
 */

/**
 * @typedef {{ id: string, source?: string, attribution?: string }} ImageDescriptor
 */

module.exports = {
  PlayDuration,
  FirstPlayComplexity,
  AgeRange,
  PLAY_DURATION_VALUES,
  FIRST_PLAY_COMPLEXITY_VALUES,
  AGE_RANGE_VALUES,
};
