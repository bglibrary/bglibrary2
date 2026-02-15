export const imageAssetErrors = {
  unsupportedImageFormat: (format) => ({
    message: `Format d'image non supporté : ${format}`,
    type: 'UnsupportedImageFormat'
  }),
  imageTooLarge: (size, maxSize) => ({
    message: `L'image est trop volumineuse (${(size / 1024 / 1024).toFixed(2)} Mo). Le maximum autorisé est de ${(maxSize / 1024 / 1024).toFixed(2)} Mo.`,
    type: 'ImageTooLarge'
  }),
  missingAttributionMetadata: () => ({
    message: "L'attribution de l'image est obligatoire.",
    type: 'MissingAttributionMetadata'
  }),
  corruptedImage: () => ({
    message: "L'image semble corrompue.",
    type: 'CorruptedImage'
  })
};
