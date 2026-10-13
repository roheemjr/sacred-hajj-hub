import { createFileRoute } from '@tanstack/react-router';
import { PackagePage } from '@/components/package-page';
import { pageHead } from '@/lib/travel';
export const Route = createFileRoute('/hajj-packages')({ head: () => pageHead('Hajj Packages', 'Enquire about available Hajj packages, prices and travel arrangements with AVDUL TRAVELS AND TOUR LTD in Kano, Nigeria.', '/hajj-packages'), component: Hajj });
function Hajj() { return <PackagePage type="Hajj"/>; }