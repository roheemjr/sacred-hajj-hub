import { business, mapEmbedUrl, mapLink } from '@/lib/travel';

export function OfficeMap() {
  return <div className="office-map">
    <iframe title={`Map showing the ${business.name} office at ${business.address}`} src={mapEmbedUrl()} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen/>
    <a className="office-map-link" href={mapLink} target="_blank" rel="noreferrer">Open this location in Google Maps</a>
  </div>;
}
