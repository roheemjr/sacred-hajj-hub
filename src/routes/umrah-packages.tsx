import { createFileRoute } from '@tanstack/react-router';
import { PackagePage } from '@/components/package-page';
import { pageHead } from '@/lib/travel';
export const Route = createFileRoute('/umrah-packages')({ head: () => pageHead('Umrah Packages', 'Contact AVDUL TRAVELS AND TOUR LTD for available Umrah packages, prices, flights and accommodation arrangements from Kano.', '/umrah-packages'), component: Umrah });
function Umrah() { return <PackagePage type="Umrah"/>; }