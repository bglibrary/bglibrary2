/**
 * ImageAssetManager tests.
 * @see specs/phase_4_8_image_asset_manager.md — Test Strategy
 */
const { validateImage, SUPPORTED_CONTENT_TYPES, MAX_SIZE_BYTES } = require("../../src/images/ImageAssetManager");

function validImageFile(overrides = {}) {
  return {
    filename: "photo.jpg",
    contentType: "image/jpeg",
    sizeInBytes: 1000,
    ...overrides,
  };
}

describe("ImageAssetManager", () => {
  describe("validateImage", () => {
    it("returns descriptor for valid image", () => {
      const file = validImageFile();
      const desc = validateImage(file);
      expect(desc).toMatchObject({ id: "photo" });
    });
    it("includes source and attribution when provided", () => {
      const file = validImageFile();
      const desc = validateImage(file, { source: "https://example.com", attribution: "© Author" });
      expect(desc.source).toBe("https://example.com");
      expect(desc.attribution).toBe("© Author");
    });
    it("accepts image/png and image/webp", () => {
      expect(validateImage(validImageFile({ filename: "a.png", contentType: "image/png" })).id).toBe("a");
      expect(validateImage(validImageFile({ filename: "b.webp", contentType: "image/webp" })).id).toBe("b");
    });
    it("throws UNSUPPORTED_IMAGE_FORMAT for unsupported type", () => {
      expect(() => validateImage(validImageFile({ contentType: "image/gif" }))).toThrow(/UNSUPPORTED_IMAGE_FORMAT|Unsupported/);
    });
    it("throws IMAGE_TOO_LARGE when size exceeds max", () => {
      expect(() =>
        validateImage(validImageFile({ sizeInBytes: MAX_SIZE_BYTES + 1 }))
      ).toThrow(/IMAGE_TOO_LARGE|too large/);
    });
    it("throws when requireAttribution true and attribution missing", () => {
      expect(() =>
        validateImage(validImageFile(), {}, { requireAttribution: true })
      ).toThrow(/MISSING_ATTRIBUTION_METADATA|Attribution/);
    });
    it("accepts when requireAttribution true and attribution provided", () => {
      const desc = validateImage(
        validImageFile(),
        { attribution: "© Me" },
        { requireAttribution: true }
      );
      expect(desc.attribution).toBe("© Me");
    });
    it("throws CORRUPTED_IMAGE when file is null", () => {
      expect(() => validateImage(null)).toThrow(/CORRUPTED_IMAGE|Corrupted/);
    });
    it("throws when filename is missing", () => {
      expect(() => validateImage(validImageFile({ filename: "" }))).toThrow(/Corrupted/);
    });
  });
});
