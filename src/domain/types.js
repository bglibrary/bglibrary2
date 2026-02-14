/**
 * Domain types and enumerations.
 * @see specs/phase_5_2_game_domain_model.md
 */

const PLAY_DURATION = Object.freeze({
  SHORT: "SHORT",
  MEDIUM: "MEDIUM",
  LONG: "LONG",
});

const PLAY_DURATION_VALUES = Object.values(PLAY_DURATION);

const FIRST_PLAY_COMPLEXITY = Object.freeze({
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
});

const FIRST_PLAY_COMPLEXITY_VALUES = Object.values(FIRST_PLAY_COMPLEXITY);

const AGE_RANGE = Object.freeze([
  "3+",
  "6+",
  "8+",
  "10+",
  "12+",
  "14+",
  "16+",
  "18+",
]);

const CATEGORIES = Object.freeze([
  "Stratégie",
  "Famille",
  "Abstrait",
  "Ambiance",
  "Coopératif",
  "Expert",
  "Petit jeu",
  "Négociation",
  "Autre",
]);

const MECHANICS = Object.freeze([
  "Jet de dés",
  "Draft",
  "Placement d'ouvriers",
  "Pattern Building",
  "Collecte de ressources",
  "Construction de routes",
  "Majorité",
  "Gestion de main",
  "Autre",
]);

const AWARD_NAMES = Object.freeze([
  "Spiel des Jahres",
  "Kennerspiel des Jahres",
  "As d'Or",
  "Golden Geek",
  "Autre",
]);

module.exports = {
  PLAY_DURATION,
  PLAY_DURATION_VALUES,
  FIRST_PLAY_COMPLEXITY,
  FIRST_PLAY_COMPLEXITY_VALUES,
  AGE_RANGE,
  CATEGORIES,
  MECHANICS,
  AWARD_NAMES,
};
