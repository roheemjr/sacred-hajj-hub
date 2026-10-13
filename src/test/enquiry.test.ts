import { describe, it, expect } from 'vitest';
import { enquirySchema, whatsappLink } from '@/lib/travel';
const valid = { full_name: 'Test Traveller', phone: '08012345678', email: '', service: 'Hajj', travellers: 2, travel_date: '', message: '', consent: true, website: '' };
describe('Travel enquiry validation', () => {
 it('accepts optional email and date', () => expect(enquirySchema.safeParse(valid).success).toBe(true));
 it('requires consent', () => expect(enquirySchema.safeParse({ ...valid, consent: false }).success).toBe(false));
 it('rejects invalid email, phone, traveller count and services', () => {
  for (const change of [{ email: 'invalid' }, { phone: '<script>' }, { travellers: 0 }, { travellers: 101 }, { service: 'fake' }, { website: 'spam' }]) expect(enquirySchema.safeParse({ ...valid, ...change }).success).toBe(false);
 });
 it('rejects past dates and excessively long messages', () => {
  expect(enquirySchema.safeParse({ ...valid, travel_date: '2000-01-01' }).success).toBe(false);
  expect(enquirySchema.safeParse({ ...valid, message: 'a'.repeat(2001) }).success).toBe(false);
 });
 it('uses the Nigerian international WhatsApp number and encoded text', () => expect(whatsappLink('A & B')).toBe('https://wa.me/2349065862009?text=A%20%26%20B'));
});