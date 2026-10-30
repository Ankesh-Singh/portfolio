/**
 * Converts any image File (PNG, JPG, BMP, GIF, WebP) to an optimized WebP File
 * using HTML5 Canvas client-side encoding prior to upload.
 */
export async function convertToWebP(
  file: File,
  quality = 0.85,
  maxWidth = 1920
): Promise<File> {
  if (!file.type.startsWith('image/')) return file;

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }

          const baseName = file.name.replace(/\.[^/.]+$/, '');
          const webpName = `${baseName}.webp`;
          const webpFile = new File([blob], webpName, {
            type: 'image/webp',
            lastModified: Date.now(),
          });

          resolve(webpFile);
        },
        'image/webp',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}

/**
 * Client-side upload helper that automatically compresses and converts any image
 * to WebP before POSTing to /api/upload.
 */
export async function uploadImageWithWebp(
  file: File,
  type = 'general'
): Promise<{ publicUrl: string; filename: string }> {
  // Client-side canvas conversion to WebP
  const processedFile = await convertToWebP(file);

  const formData = new FormData();
  formData.append('file', processedFile);
  formData.append('type', type);

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  const data = (await res.json()) as { publicUrl?: string; filename?: string; error?: string };
  if (!res.ok) {
    throw new Error(data.error || 'Upload failed');
  }

  return {
    publicUrl: data.publicUrl || '',
    filename: data.filename || '',
  };
}
