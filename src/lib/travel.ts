import { z } from 'zod';
import { Landmark, Plane, FileCheck, Hotel, Bus, Compass, Globe, MapPin } from 'lucide-react';

export const business = { name: 'AVDUL TRAVELS AND TOUR LTD', email: 'avdultravelsandtourltd@gmail.com', phone: '09020778435', telephone: '+2349020778435', whatsapp: '2349065862009', address: 'No. 57 Mai Kassu Plaza, Adjacent INEC Office, Hajj Camp Roundabout, Kano State, Nigeria.' };
export const serviceOptions = ['Hajj', 'Umrah', 'Visa assistance', 'Flight arrangements', 'Accommodation', 'Other travel services'] as const;
export const enquirySchema = z.object({
  full_name: z.string().trim().min(2, 'Please enter your full name.').max(100),
  phone: z.string().trim().min(7, 'Please enter a valid phone number.').max(25).regex(/^\+?[0-9\s()-]+$/, 'Please enter a valid phone number.'),
  email: z.union([z.literal(''), z.string().trim().email('Please enter a valid email address.').max(255)]),
  service: z.enum(serviceOptions),
  travellers: z.coerce.number().int().min(1).max(100),
  travel_date: z.string().refine(v => !v || (/^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v)) && v >= new Date().toISOString().slice(0,10)), 'Choose today or a future travel date.'),
  message: z.string().trim().max(2000),
  consent: z.boolean().refine(v => v, 'Please agree to being contacted about your enquiry.'),
  website: z.string().max(0),
});
export type Enquiry = z.infer<typeof enquirySchema>;
export function whatsappLink(message = 'Assalamu alaikum. I would like to enquire about your Hajj and Umrah travel services.') { return `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(message.slice(0,4000))}`; }
export const officeLocation = { latitude: 12.0277674, longitude: 8.5231178 };
export const mapLink = 'https://maps.app.goo.gl/QWF4AdCmgRDCcVaU6';
export function mapEmbedUrl() {
  const key = import.meta.env['VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY'];
  const { latitude, longitude } = officeLocation;
  return key
    ? `https://www.google.com/maps/embed/v1/place?key=${key}&q=${latitude},${longitude}&zoom=16&maptype=roadmap`
    : `https://www.google.com/maps?q=${latitude},${longitude}&z=16&output=embed`;
}
export const services = [
  { name: 'Hajj Packages', icon: Landmark, description: 'Travel arrangements for your journey to fulfil the sacred pillar of Hajj.', service: 'Hajj' },
  { name: 'Umrah Packages', icon: Compass, description: 'Plan your visit to the holy cities of Makkah and Madinah.', service: 'Umrah' },
  { name: 'Visa Processing', icon: FileCheck, description: 'Assistance with visa requirements, documents and processing.', service: 'Visa assistance' },
  { name: 'Flight Arrangements', icon: Plane, description: 'Flight options coordinated around your pilgrimage plans.', service: 'Flight arrangements' },
  { name: 'Hotel & Accommodation', icon: Hotel, description: 'Discuss accommodation options suited to your travel needs.', service: 'Accommodation' },
  { name: 'Transportation in Saudi Arabia', icon: Bus, description: 'Enquire about transfers and transportation during your stay.', service: 'Other travel services' },
  { name: 'Professional Guidance', icon: Compass, description: 'Support with planning and preparing for your sacred journey.', service: 'Other travel services' },
  { name: 'Local Flights Within Nigeria', icon: MapPin, description: 'Domestic flight bookings for journeys within Nigeria.', service: 'Flight arrangements' },
  { name: 'International Flight Bookings', icon: Globe, description: 'International flight enquiries for your next destination.', service: 'Flight arrangements' },
];
export type UmrahOption = { tier: string; price: string; hotel: string };
export const umrahSeasons: { season: string; period: string; options: UmrahOption[] }[] = [
  { season: 'Ramadan Umrah', period: 'Arranged for the Ramadan season.', options: [
    { tier: 'Economy', price: '₦4,800,000', hotel: 'Premium hotel' },
    { tier: 'Deluxe', price: '₦5,500,000', hotel: '3-star hotel' },
  ] },
  { season: 'Maulud or Normal Umrah', period: 'Tell us your preferred dates and our team will share the available options.', options: [] },
];
export function pageHead(title: string, description: string, path: string) { return { meta: [{ title: `${title} | AVDUL Travels & Tour Ltd` }, { name: 'description', content: description }, { property: 'og:title', content: `${title} | AVDUL Travels & Tour Ltd` }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { property: 'og:url', content: path }, { name: 'twitter:card', content: 'summary_large_image' }], links: [{ rel: 'canonical', href: path }] }; }