import { regionToBounds } from '@/utils/mapBounds';

describe('regionToBounds', () => {
  it('converts map region to bounding box', () => {
    const bounds = regionToBounds({
      latitude: 50.7192,
      longitude: -1.8808,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    });

    expect(bounds.minLat).toBeCloseTo(50.6692, 4);
    expect(bounds.maxLat).toBeCloseTo(50.7692, 4);
    expect(bounds.minLng).toBeCloseTo(-1.9308, 4);
    expect(bounds.maxLng).toBeCloseTo(-1.8308, 4);
  });
});
