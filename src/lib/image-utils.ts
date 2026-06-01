const THUMBNAIL_MAX_WIDTH = 800;
const THUMBNAIL_QUALITY = 0.8;

export interface ProcessedImage {
  originalBase64: string;
  mimeType: string;
  thumbnailBlob: Blob;
  thumbnailUrl: string;
}

function rotateCanvas(img: HTMLImageElement, degrees: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const swap = degrees === 90 || degrees === 270;
  canvas.width = swap ? img.height : img.width;
  canvas.height = swap ? img.width : img.height;
  const ctx = canvas.getContext('2d')!;
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((degrees * Math.PI) / 180);
  ctx.drawImage(img, -img.width / 2, -img.height / 2);
  return canvas;
}

export function applyRotation(processed: ProcessedImage, degrees: number): Promise<ProcessedImage> {
  if (degrees === 0) return Promise.resolve(processed);

  return new Promise((resolve, reject) => {
    const thumbImg = new Image();
    thumbImg.onload = () => {
      const thumbCanvas = rotateCanvas(thumbImg, degrees);

      let { width, height } = thumbCanvas;
      if (width > THUMBNAIL_MAX_WIDTH) {
        const ratio = THUMBNAIL_MAX_WIDTH / width;
        width = THUMBNAIL_MAX_WIDTH;
        height = Math.round(height * ratio);
      }
      const resized = document.createElement('canvas');
      resized.width = width;
      resized.height = height;
      resized.getContext('2d')!.drawImage(thumbCanvas, 0, 0, width, height);

      resized.toBlob(
        (blob) => {
          if (!blob) { reject(new Error('Failed to rotate thumbnail')); return; }

          const origImg = new Image();
          origImg.onload = () => {
            const origCanvas = rotateCanvas(origImg, degrees);
            const origBase64 = origCanvas.toDataURL(processed.mimeType || 'image/jpeg', 0.92).split(',')[1];

            URL.revokeObjectURL(processed.thumbnailUrl);
            resolve({
              originalBase64: origBase64,
              mimeType: processed.mimeType,
              thumbnailBlob: blob,
              thumbnailUrl: URL.createObjectURL(blob),
            });
          };
          origImg.onerror = () => reject(new Error('Failed to load original for rotation'));
          origImg.src = `data:${processed.mimeType};base64,${processed.originalBase64}`;
        },
        'image/jpeg',
        THUMBNAIL_QUALITY
      );
    };
    thumbImg.onerror = () => reject(new Error('Failed to load thumbnail for rotation'));
    thumbImg.src = processed.thumbnailUrl;
  });
}

export function processImage(file: File): Promise<ProcessedImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(',')[1];
      const mimeType = file.type || 'image/jpeg';

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        if (width > THUMBNAIL_MAX_WIDTH) {
          height = Math.round((height * THUMBNAIL_MAX_WIDTH) / width);
          width = THUMBNAIL_MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to create thumbnail'));
              return;
            }
            resolve({
              originalBase64: base64,
              mimeType,
              thumbnailBlob: blob,
              thumbnailUrl: URL.createObjectURL(blob),
            });
          },
          'image/jpeg',
          THUMBNAIL_QUALITY
        );
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = dataUrl;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
