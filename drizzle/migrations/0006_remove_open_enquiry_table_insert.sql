REVOKE INSERT ON TABLE public.enquiries FROM PUBLIC, anon;
DROP POLICY "Public may submit enquiries" ON public.enquiries;