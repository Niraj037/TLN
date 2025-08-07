// Video URLs hosted on AWS S3
export const VIDEO_URLS = {
  hero: 'https://tln-vids.s3.ap-south-1.amazonaws.com/drumkit-optimized-v2.mp4',
  guitar: 'https://tln-vids.s3.ap-south-1.amazonaws.com/guitar-optimized.mp4',
  vinyl1: 'https://tln-vids.s3.ap-south-1.amazonaws.com/vinyl1-optimized.mp4',
  vinyl2: 'https://tln-vids.s3.ap-south-1.amazonaws.com/vinyl2-optimized-v2.mp4',
  drumcym: 'https://tln-vids.s3.ap-south-1.amazonaws.com/drumcym-optimized.mp4'
} as const;

export type VideoKey = keyof typeof VIDEO_URLS;

// Video metadata for optimization
export const VIDEO_METADATA = {
  hero: { size: '10.04 MB', priority: true },
  guitar: { size: '12.38 MB', priority: false },
  vinyl1: { size: '11.89 MB', priority: false },
  vinyl2: { size: '12.49 MB', priority: false },
  drumcym: { size: '12.38 MB', priority: false }
} as const;
