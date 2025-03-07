export const getOptimizedImageUrl = (url: string | null, quality: number = 80): string | null => {
    if (!url) return null;
    
    return url.includes('?') 
      ? `${url}&quality=${quality}` 
      : `${url}?quality=${quality}`;
  };