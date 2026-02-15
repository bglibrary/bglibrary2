import { imageAssetErrors } from './imageAssetErrors';

export const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
export const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];
export const REQUIRE_ATTRIBUTION = true;

/**
 * ImageAssetManager handles image validation and descriptor generation.
 */
export const ImageAssetManager = {
  /**
   * Validates an image file and its metadata.
   * 
   * @param {Object} file - The file object (browser File API or mock)
   * @param {Object} metadata - Image metadata (source, attribution)
   * @returns {Object} Validated ImageDescriptor
   * @throws {Error} Specific image asset error if validation fails
   */
  validateAndCreateDescriptor: (file, metadata) => {
    // 1. Validate format
    if (!SUPPORTED_FORMATS.includes(file.contentType)) {
      throw imageAssetErrors.unsupportedImageFormat(file.contentType);
    }

    // 2. Validate size
    if (file.sizeInBytes > MAX_SIZE_BYTES) {
      throw imageAssetErrors.imageTooLarge(file.sizeInBytes, MAX_SIZE_BYTES);
    }

    // 3. Validate attribution
    if (REQUIRE_ATTRIBUTION && (!metadata || !metadata.attribution || metadata.attribution.trim() === '')) {
      throw imageAssetErrors.missingAttributionMetadata();
    }

    // 4. Generate stable ID from filename (simplified for MVP)
    const id = file.filename.split('.')[0];

    return Object.freeze({
      id,
      source: metadata.source || 'user',
      attribution: metadata.attribution
    });
  }
};
