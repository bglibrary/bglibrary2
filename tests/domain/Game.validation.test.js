/**
 * Game domain validation tests.
 * @see specs/phase_5_2_game_domain_model.md — Invariants, Error Conditions
 */

const { validateGame, createGame } = require("../../src/domain/Game");
const { PlayDuration, FirstPlayComplexity, AgeRange } = require("../../src/domain/types");

function validGameOverrides(overrides = {}) {
  return {
    id: "game-1",
    title: "Test Game",
    description: "A test game",
    minPlayers: 2,
    maxPlayers: 4,
    playDuration: PlayDuration.MEDIUM,
    ageRecommendation: AgeRange.AGE_10_PLUS,
    firstPlayComplexity: FirstPlayComplexity.MEDIUM,
    categories: ["Strategy"],
    mechanics: ["Dice"],
    awards: [],
    favorite: false,
    archived: false,
    images: [{ id: "img-1" }],
    ...overrides,
  };
}

describe("validateGame", () => {
  it("returns empty array for a valid game", () => {
    const errors = validateGame(validGameOverrides());
    expect(errors).toEqual([]);
  });

  it("returns error for missing id", () => {
    const errors = validateGame(validGameOverrides({ id: "" }));
    expect(errors.some((e) => e.code === "MISSING_MANDATORY_FIELD" && e.field === "id")).toBe(true);
  });

  it("returns error for missing title", () => {
    const errors = validateGame(validGameOverrides({ title: "" }));
    expect(errors.some((e) => e.code === "MISSING_MANDATORY_FIELD" && e.field === "title")).toBe(true);
  });

  it("returns error for invalid playDuration", () => {
    const errors = validateGame(validGameOverrides({ playDuration: "INVALID" }));
    expect(errors.some((e) => e.code === "INVALID_ENUM_VALUE" && e.field === "playDuration")).toBe(true);
  });

  it("returns error when minPlayers > maxPlayers", () => {
    const errors = validateGame(validGameOverrides({ minPlayers: 5, maxPlayers: 2 }));
    expect(errors.some((e) => e.code === "INVALID_PLAYER_RANGE")).toBe(true);
  });

  it("returns error when images array is empty", () => {
    const errors = validateGame(validGameOverrides({ images: [] }));
    expect(errors.some((e) => e.code === "AT_LEAST_ONE_IMAGE_REQUIRED")).toBe(true);
  });

  it("returns error when images is missing", () => {
    const g = validGameOverrides();
    delete g.images;
    const errors = validateGame(g);
    expect(errors.some((e) => e.code === "AT_LEAST_ONE_IMAGE_REQUIRED")).toBe(true);
  });

  it("returns error for null input", () => {
    const errors = validateGame(null);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.field === "id")).toBe(true);
  });

  it("accepts valid awards with optional year", () => {
    const errors = validateGame(
      validGameOverrides({ awards: [{ name: "Spiel des Jahres" }, { name: "Other", year: 2023 }] })
    );
    expect(errors).toEqual([]);
  });
});

describe("createGame", () => {
  it("returns the game object when valid", () => {
    const raw = validGameOverrides();
    const game = createGame(raw);
    expect(game.id).toBe(raw.id);
    expect(game.title).toBe(raw.title);
  });

  it("throws when validation fails", () => {
    expect(() => createGame(validGameOverrides({ id: "" }))).toThrow(/Game validation failed/);
    expect(() => createGame(validGameOverrides({ minPlayers: 10, maxPlayers: 2 }))).toThrow(
      /INVALID_PLAYER_RANGE/
    );
  });
});
