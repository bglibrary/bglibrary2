/**
 * ImageAssetManager — validates image files and metadata.
 * @see specs/phase_4_8_image_asset_manager.md, phase_5_7_image_asset_contracts.md
 */
const { unsupportedImageFormat, imageTooLarge, missingAttributionMetadata, corruptedImage } = require("./imageAssetErrors");

const SUPPORTED_CONTENT_TYPES = Object.freeze(["image/jpeg", "image/png", "image/webp"]);
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const REQUIRE_ATTRIBUTION = false; // configurable per spec

/**
 * Generates a stable id for an image (e.g. from filename or hash). For tests we use filename-based.
 * @param {string} filename
 * @returns {string}
 */
function generateImageId(filename) {
  const base = filename.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9-_]/g, "_");
  return base || `img_${Date.now()}`;
}

/**
 * Validates an image file and optional metadata. Returns ImageDescriptor or throws.
 * @param {{ filename: string, contentType: string, sizeInBytes: number }} imageFile
 * @param {{ source?: string, attribution?: string }} [metadata]
 * @param {{ requireAttribution?: boolean, maxSizeBytes?: number }} [options]
 * @returns {{ id: string, source?: string, attribution?: string }}
 */
function validateImage(imageFile, metadata = {}, options = {}) {
  const requireAttribution = options.requireAttribution ?? REQUIRE_ATTRIBUTION;
  const maxSizeBytes = options.maxSizeBytes ?? MAX_SIZE_BYTES;

  if (!imageFile || typeof imageFile !== "object") {
    throw Object.assign(new Error(corruptedImage("missing file").message), { code: "CORRUPTED_IMAGE" });
  }
  if (typeof imageFile.filename !== "string" || imageFile.filename.trim() === "") {
    throw Object.assign(new Error(corruptedImage("missing filename").message), { code: "CORRUPTED_IMAGE" });
  }
  if (!SUPPORTED_CONTENT_TYPES.includes(imageFile.contentType)) {
    throw Object.assign(new Error(unsupportedImageFormat(imageFile.contentType).message), {
      code: "UNSUPPORTED_IMAGE_FORMAT",
    });
  }
  const size = imageFile.sizeInBytes;
  if (typeof size !== "number" || !Number.isFinite(size) || size < 0 || size > maxSizeBytes) {
    if (typeof size === "number" && size > maxSizeBytes) {
      throw Object.assign(new Error(imageTooLarge(size, maxSizeBytes).message), { code: "IMAGE_TOO_LARGE" });
    }
    throw Object.assign(new Error(corruptedImage("invalid size").message), { code: "CORRUPTED_IMAGE" });
  }
  if (requireAttribution && (!metadata || typeof metadata.attribution !== "string" || metadata.attribution.trim() === "")) {
    throw Object.assign(new Error(missingAttributionMetadata().message), { code: "MISSING_ATTRIBUTION_METADATA" });
  }

  const id = generateImageId(imageFile.filename);
  const descriptor = { id };
  if (metadata?.source != null && typeof metadata.source === "string") descriptor.source = metadata.source;
  if (metadata?.attribution != null && typeof metadata.attribution === "string") descriptor.attribution = metadata.attribution;
  return descriptor;
}

module.exports = {
  validateImage,
  generateImageId,
  SUPPORTED_CONTENT_TYPES,
  MAX_SIZE_BYTES,
};
