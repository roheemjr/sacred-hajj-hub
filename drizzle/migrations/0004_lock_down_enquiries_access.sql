REVOKE ALL ON TABLE public.enquiries FROM PUBLIC, anon, authenticated;
GRANT INSERT ON TABLE public.enquiries TO anon;
GRANT SELECT ON TABLE public.enquiries TO authenticated;
CREATE POLICY "Public may submit enquiries" ON public.enquiries FOR INSERT TO anon WITH CHECK (true);
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT _user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = _user_id AND role = _role
    )
$$;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
REVOKE ALL ON FUNCTION public.handle_new_admin_user() FROM PUBLIC, anon, authenticated;