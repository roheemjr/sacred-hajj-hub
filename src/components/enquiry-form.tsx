import { useState, type FormEvent } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { CheckCircle2, ArrowUpRight, Loader2, LockKeyhole } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { enquirySchema, serviceOptions, whatsappLink } from '@/lib/travel';
import { submitEnquiry } from '@/lib/enquiries.functions';

export function EnquiryForm({ service = 'Umrah' }: { service?: string }) {
  const submit = useServerFn(submitEnquiry);
  const [state, setState] = useState<'idle' | 'sending' | 'success'>('idle');
  const [error, setError] = useState('');
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parsed = enquirySchema.safeParse({ full_name: form.get('full_name'), phone: form.get('phone'), email: form.get('email') ?? '', service: form.get('service'), travellers: form.get('travellers'), travel_date: form.get('travel_date'), message: form.get('message'), consent: form.get('consent') === 'on', website: form.get('website') });
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? 'Please check your details.'); return; }
    setError(''); setState('sending');
    try { const result = await submit({ data: parsed.data }); if (!result.ok) { setError(result.error ?? 'Please try again.'); setState('idle'); return; } setState('success'); }
    catch { setError('Your enquiry was not sent. Please try again or use WhatsApp.'); setState('idle'); }
  }
  if (state === 'success') return <div className="enquiry-success" role="status"><CheckCircle2 size={44}/><h3>Thank you, we will contact you shortly</h3><p>Your enquiry has been received by AVDUL TRAVELS AND TOUR LTD. You can also reach us directly on WhatsApp.</p><Button asChild><a href={whatsappLink()} target="_blank" rel="noreferrer">Continue on WhatsApp <ArrowUpRight/></a></Button><Button variant="ghost" onClick={() => setState('idle')}>Send another enquiry</Button></div>;
  return <form onSubmit={handleSubmit} className="enquiry-form">
    <div className="form-grid"><label>Full name <span>*</span><input name="full_name" autoComplete="name" placeholder="Your full name" required minLength={2} maxLength={100}/></label><label>Phone number <span>*</span><input name="phone" autoComplete="tel" type="tel" placeholder="e.g. 08012345678" required minLength={7} maxLength={25}/></label><label>Preferred service <span>*</span><select name="service" defaultValue={service}>{serviceOptions.map(s => <option key={s}>{s}</option>)}</select></label><label>Number of travellers <span>*</span><input name="travellers" type="number" defaultValue={1} min={1} max={100} required/></label><label>Preferred travel date <small>(optional)</small><input name="travel_date" type="date"/></label></div>
    <label>Additional message <small>(optional)</small><textarea name="message" placeholder="Tell us about your travel plans…" rows={4} maxLength={2000}/></label>
    <div className="honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
    <label className="consent"><input type="checkbox" name="consent" required/><span>I agree that AVDUL TRAVELS AND TOUR LTD may securely store my details and contact me about this enquiry. This is not a confirmed booking.</span></label>
    {error && <p role="alert" className="form-error">{error}</p>}
    <Button disabled={state === 'sending'} className="submit-button" type="submit">{state === 'sending' ? <><Loader2 className="animate-spin"/>Sending enquiry…</> : <>Send booking enquiry <ArrowUpRight/></>}</Button>
    <p className="privacy-note"><LockKeyhole size={13}/> Your details are used to handle your enquiry, not for public display. Contact us to request correction or deletion.</p>
  </form>;
}