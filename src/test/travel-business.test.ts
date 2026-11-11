import { describe, expect, it } from 'vitest';
import { business, packageInclusions, umrahSeasons } from '@/lib/travel';

describe('Confirmed travel information', () => {
  it('preserves the confirmed office address', () => {
    expect(business.address).toBe('No. 57 Mai Kassu Plaza, Adjacent INEC Office, Hajj Camp Roundabout, Kano State, Nigeria.');
  });
  it('preserves the call and WhatsApp numbers', () => {
    expect(business.phone).toBe('09020778435');
    expect(business.whatsapp).toBe('2349065862009');
  });
  it('preserves Ramadan package prices and hotel descriptions', () => {
    expect(umrahSeasons[0]?.options).toEqual([
      { tier: 'Economy', price: '₦4,800,000', hotel: 'Premium hotel' },
      { tier: 'Deluxe', price: '₦5,500,000', hotel: '3-star hotel' },
    ]);
  });
  it('does not supply unconfirmed normal Umrah prices', () => {
    expect(umrahSeasons[1]?.options).toEqual([]);
  });
  it('offers the requested inclusions for confirmation on enquiry', () => {
    expect(packageInclusions).toEqual(['Visa assistance', 'Flights', 'Accommodation', 'Ground transport in Saudi Arabia', 'Guidance']);
  });
});