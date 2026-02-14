const { validateGame, createGame } = require("../../src/domain/Game");

describe("Game Domain", () => {
  const validGame = {
    id: "catan",
    title: "Catan",
    description: "Un jeu de stratégie",
    minPlayers: 3,
    maxPlayers: 4,
    playDuration: "MEDIUM",
    ageRecommendation: "10+",
    firstPlayComplexity: "MEDIUM",
    categories: ["Stratégie"],
    mechanics: ["Jet de dés"],
    images: [{ id: "img1" }],
  };

  test("should validate a valid game", () => {
    const errors = validateGame(validGame);
    expect(errors).toHaveLength(0);
  });

  test("should catch missing mandatory fields", () => {
    const errors = validateGame({ ...validGame, title: "" });
    expect(errors).toContainEqual(expect.objectContaining({ code: "MISSING_MANDATORY_FIELD", field: "title" }));
  });

  test("should catch invalid enum values", () => {
    const errors = validateGame({ ...validGame, playDuration: "INVALID" });
    expect(errors).toContainEqual(expect.objectContaining({ code: "INVALID_ENUM_VALUE", field: "playDuration" }));
  });

  test("should catch invalid player range", () => {
    const errors = validateGame({ ...validGame, minPlayers: 5, maxPlayers: 2 });
    expect(errors).toContainEqual(expect.objectContaining({ code: "INVALID_PLAYER_RANGE" }));
  });

  test("should catch missing images", () => {
    const errors = validateGame({ ...validGame, images: [] });
    expect(errors).toContainEqual(expect.objectContaining({ code: "MISSING_MANDATORY_FIELD", field: "images" }));
  });

  test("createGame should return an immutable game object", () => {
    const game = createGame(validGame);
    expect(game.title).toBe("Catan");
    expect(() => { game.title = "New Title"; }).toThrow();
  });

  test("createGame should throw on invalid data", () => {
    expect(() => createGame({ ...validGame, title: "" })).toThrow("Invalid Game data");
  });
});
