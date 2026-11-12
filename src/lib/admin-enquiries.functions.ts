import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';

export const listAdminEnquiries = createServerFn({ method: 'GET' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin, error: roleError } = await context.supabase.rpc('has_role', {
      _user_id: context.userId,
      _role: 'admin',
    });
    if (roleError || !isAdmin) return { ok: false as const, enquiries: [] };

    const { data, error } = await context.supabase
      .from('enquiries')
      .select('id, name, phone, email, service, travel_date, travellers, message, submitted_at, status')
      .order('submitted_at', { ascending: false })
      .limit(500);
    if (error) return { ok: false as const, enquiries: [] };
    return { ok: true as const, enquiries: data ?? [] };
  });