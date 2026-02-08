/**
 * Explicit errors for ImageAssetManager.
 * @see specs/phase_5_7_image_asset_contracts.md — Error Types
 */

function unsupportedImageFormat(contentType) {
  return { code: "UNSUPPORTED_IMAGE_FORMAT", message: `Unsupported image format: ${contentType}` };
}

function imageTooLarge(sizeInBytes, maxBytes) {
  return { code: "IMAGE_TOO_LARGE", message: `Image too large: ${sizeInBytes} bytes (max ${maxBytes})` };
}

function missingMandatoryImage() {
  return { code: "MISSING_MANDATORY_IMAGE", message: "At least one image is required" };
}

function missingAttributionMetadata() {
  return { code: "MISSING_ATTRIBUTION_METADATA", message: "Attribution metadata is required" };
}

function corruptedImage(reason) {
  return { code: "CORRUPTED_IMAGE", message: reason ? `Corrupted image: ${reason}` : "Corrupted image" };
}

module.exports = {
  unsupportedImageFormat,
  imageTooLarge,
  missingMandatoryImage,
  missingAttributionMetadata,
  corruptedImage,
};
