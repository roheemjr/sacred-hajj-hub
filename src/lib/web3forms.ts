import type { Enquiry } from './travel';

export type EnquiryNotification = Omit<Enquiry, 'website'>;

export function createWeb3FormsPayload(enquiry: EnquiryNotification, accessKey: string) {
  return {
    access_key: accessKey,
    name: enquiry.full_name,
    phone: enquiry.phone,
    email: enquiry.email,
    service: enquiry.service,
    travellers: enquiry.travellers,
    travel_date: enquiry.travel_date,
    message: enquiry.message,
    subject: `New enquiry: ${enquiry.service} - ${enquiry.full_name}`,
    from_name: 'AVDUL TRAVELS AND TOUR LTD',
  };
}

export async function sendWeb3FormsNotification(
  enquiry: EnquiryNotification,
  accessKey: string,
): Promise<boolean> {
  if (!accessKey) return false;

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(createWeb3FormsPayload(enquiry, accessKey)),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return false;
    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch {
    return false;
  }
}