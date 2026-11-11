import { ArrowUpRight, Check, MessageCircle } from 'lucide-react';
import { PageIntro, EnquiryButton, PackageCard } from './travel-ui';
import { EnquiryForm } from './enquiry-form';
import { Button } from './ui/button';
import { whatsappLink, umrahSeasons } from '@/lib/travel';

function UmrahSeasons() {
  return <section className="section season-section"><div className="site-container">
    <div className="section-heading"><div><span className="eyebrow">UMRAH BY SEASON</span><h2>Umrah packages<br/>by season.</h2></div><p>Our Umrah packages are arranged by season.<br/>Speak with our team to confirm the current options.</p></div>
    <div className="season-grid">{umrahSeasons.map(item => <article className="season-card" key={item.season}>
      <div className="season-head"><h3>{item.season}</h3><p>{item.period}</p></div>
      {item.options.length ? <div className="season-options">{item.options.map(option => <div className="season-option" key={option.tier}><span className="season-tier">{option.tier}</span><strong className="season-price">{option.price}</strong><span className="season-hotel">{option.hotel}</span></div>)}</div> : <p className="season-contact">Contact us for available packages and prices.</p>}
      <EnquiryButton service="Umrah" variant="ghost" className="text-enquire">Enquire about {item.season} <ArrowUpRight/></EnquiryButton>
    </article>)}</div>
    <p className="season-note">Prices are in Nigerian Naira. Hotel arrangements, dates, inclusions and availability are confirmed with our team before booking.</p>
  </div></section>;
}

export function PackagePage({ type }: { type: 'Hajj' | 'Umrah' }) { return <main className="package-page"><PageIntro eyebrow={`${type.toUpperCase()} TRAVEL ARRANGEMENTS`} title={type === 'Hajj' ? 'A pillar of faith. A journey of a lifetime.' : 'Make time for a sacred journey.'} text={`Explore ${type} travel arrangements with our Kano-based team.`}/><section className="section"><div className="site-container package-detail-grid"><PackageCard type={type}/><div><span className="eyebrow">LET’S FIND YOUR NEXT STEP</span><h2>Contact us for available<br/>packages and prices.</h2><p>Our team can discuss the current {type} options based on your plans. Package information will be shared and confirmed before you make a booking.</p><h3>Details to discuss with our team</h3><ul className="package-checklist">{['Package name and price', 'Duration and departure date', 'Hotel details and accommodation arrangements', 'Included and excluded services', 'Current availability and booking terms'].map(t => <li key={t}><Check size={17}/>{t}</li>)}</ul><EnquiryButton service={type}>Enquire about {type}</EnquiryButton> <Button variant="ghost" asChild><a href={whatsappLink(`Assalamu alaikum. I would like to enquire about your ${type} packages and prices.`)} target="_blank" rel="noreferrer"><MessageCircle/>WhatsApp our team</a></Button></div></div></section>{type === 'Umrah' && <UmrahSeasons/>}<section className="section enquiry-section"><div className="site-container enquiry-layout"><div><span className="eyebrow">BEGIN WITH AN ENQUIRY</span><h2>Tell us about<br/>your {type} plans.</h2><p>Share your preferences and contact details. Sending an enquiry does not confirm a booking or guarantee availability.</p></div><EnquiryForm service={type}/></div></section></main>; }
