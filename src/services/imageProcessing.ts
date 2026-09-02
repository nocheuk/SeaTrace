import * as ImageManipulator from 'expo-image-manipulator';
import { config } from '@/config/env';

export async function compressImage(uri: string): Promise<{ uri: string; width: number; height: number }> {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: config.limits.maxImageWidth } }],
    {
      compress: config.limits.imageCompressQuality,
      format: ImageManipulator.SaveFormat.JPEG,
    },
  );

  return {
    uri: result.uri,
    width: result.width,
    height: result.height,
  };
}

export function validateImageSize(sizeBytes: number): boolean {
  return sizeBytes <= config.limits.maxImageSizeBytes;
}
