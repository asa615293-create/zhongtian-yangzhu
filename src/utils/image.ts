const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export const compressImage = (base64Data: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;
      const MAX_DIMENSION = 1920;
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve(base64Data); return; }
      ctx.drawImage(img, 0, 0, width, height);
      let quality = 0.8;
      let result = canvas.toDataURL('image/jpeg', quality);
      while (result.length > MAX_FILE_SIZE && quality > 0.1) {
        quality -= 0.1;
        result = canvas.toDataURL('image/jpeg', quality);
      }
      resolve(result);
    };
    img.onerror = () => resolve(base64Data);
    img.src = base64Data;
  });
};

// 生成缩略图：最大宽度 300px，质量 0.6，用于列表展示
export const generateThumbnail = (base64Data: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;
      const MAX_WIDTH = 300;
      if (width > MAX_WIDTH) {
        const ratio = MAX_WIDTH / width;
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve(base64Data); return; }
      ctx.drawImage(img, 0, 0, width, height);
      const result = canvas.toDataURL('image/jpeg', 0.6);
      resolve(result);
    };
    img.onerror = () => resolve(base64Data);
    img.src = base64Data;
  });
};
