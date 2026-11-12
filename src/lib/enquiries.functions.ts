import { createServerFn } from '@tanstack/react-start';
import { enquirySchema, toEnquiryRecord } from './travel';

export const submitEnquiry = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => enquirySchema.parse(input))
  .handler(async ({ data }) => {
    // This public endpoint allows only validated, insert-only enquiries. No personal data is returned.
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const cutoff = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { count, error: countError } = await supabaseAdmin.from('enquiries').select('id', { count: 'exact', head: true }).eq('phone', data.phone.replace(/[\s()-]/g, '')).gte('submitted_at', cutoff);
    if (countError) return { ok: false, error: 'We could not send your enquiry. Please try again or contact us on WhatsApp.' };
    if ((count ?? 0) >= 3) return { ok: false, error: 'Please wait a few minutes before sending another enquiry, or contact us on WhatsApp.' };
    const { website: _website, ...enquiry } = data;
    const { error } = await supabaseAdmin.from('enquiries').insert(toEnquiryRecord(enquiry));
    if (error) return { ok: false, error: 'We could not send your enquiry. Please try again or contact us on WhatsApp.' };
    return { ok: true, error: null };
  });