import { describe, expect, it } from 'vitest';
import { createWeb3FormsPayload, type EnquiryNotification } from '@/lib/web3forms';

const enquiry: EnquiryNotification = {
  full_name: 'Aisha Bello',
  phone: '08012345678',
  email: 'aisha@example.com',
  service: 'Umrah',
  travellers: 3,
  travel_date: '2027-02-14',
  message: 'Please share the available options.',
  consent: true,
};

describe('Web3Forms enquiry notification', () => {
  it('includes every requested enquiry detail and the specified subject', () => {
    expect(createWeb3FormsPayload(enquiry, 'public-access-key')).toEqual({
      access_key: 'public-access-key',
      name: 'Aisha Bello',
      phone: '08012345678',
      email: 'aisha@example.com',
      service: 'Umrah',
      travellers: 3,
      travel_date: '2027-02-14',
      message: 'Please share the available options.',
      subject: 'New enquiry: Umrah - Aisha Bello',
      from_name: 'AVDUL TRAVELS AND TOUR LTD',
    });
  });
});