import { describe, it, expect } from 'vitest';
import { officeLocation, mapLink, mapEmbedUrl } from '@/lib/travel';

describe('Office map location', () => {
  it('points at the exact coordinates from the shared Google Maps link', () => {
    expect(officeLocation.latitude).toBe(12.0277674);
    expect(officeLocation.longitude).toBe(8.5231178);
  });
  it('links to the shared Google Maps location', () => {
    expect(mapLink).toBe('https://maps.app.goo.gl/QWF4AdCmgRDCcVaU6');
  });
  it('embeds the same office coordinates in the map frame', () => {
    expect(mapEmbedUrl()).toContain('12.0277674');
    expect(mapEmbedUrl()).toContain('8.5231178');
  });
});
