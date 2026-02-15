import { imageAssetErrors } from '../../src/images/imageAssetErrors';
import { ImageAssetManager, MAX_SIZE_BYTES } from '../../src/images/ImageAssetManager';

describe('ImageAssetManager', () => {
  const validFile = {
    filename: 'test-image.png',
    contentType: 'image/png',
    sizeInBytes: 1024 * 1024 // 1MB
  };

  const validMetadata = {
    source: 'publisher',
    attribution: 'Artist Name'
  };

  test('should validate a valid image and return descriptor', () => {
    const descriptor = ImageAssetManager.validateAndCreateDescriptor(validFile, validMetadata);
    expect(descriptor.id).toBe('test-image');
    expect(descriptor.attribution).toBe('Artist Name');
    expect(descriptor.source).toBe('publisher');
  });

  test('should throw error for unsupported format', () => {
    const invalidFile = { ...validFile, contentType: 'application/pdf' };
    expect(() => ImageAssetManager.validateAndCreateDescriptor(invalidFile, validMetadata))
      .toThrow(imageAssetErrors.unsupportedImageFormat('application/pdf').message);
  });

  test('should throw error for image too large', () => {
    const hugeFile = { ...validFile, sizeInBytes: MAX_SIZE_BYTES + 1 };
    expect(() => ImageAssetManager.validateAndCreateDescriptor(hugeFile, validMetadata))
      .toThrow(imageAssetErrors.imageTooLarge(MAX_SIZE_BYTES + 1, MAX_SIZE_BYTES).message);
  });

  test('should throw error for missing attribution', () => {
    const missingAttrMetadata = { ...validMetadata, attribution: '' };
    expect(() => ImageAssetManager.validateAndCreateDescriptor(validFile, missingAttrMetadata))
      .toThrow(imageAssetErrors.missingAttributionMetadata().message);
    
    expect(() => ImageAssetManager.validateAndCreateDescriptor(validFile, null))
      .toThrow(imageAssetErrors.missingAttributionMetadata().message);
  });

  test('should generate stable ID from filename', () => {
    const file = { ...validFile, filename: 'my_awesome_game_cover.webp', contentType: 'image/webp' };
    const descriptor = ImageAssetManager.validateAndCreateDescriptor(file, validMetadata);
    expect(descriptor.id).toBe('my_awesome_game_cover');
  });
});
