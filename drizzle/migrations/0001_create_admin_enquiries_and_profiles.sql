CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL CHECK (char_length(display_name) BETWEEN 1 AND 100),
  email text NOT NULL CHECK (char_length(email) <= 255),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can create their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
CREATE TABLE public.enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 100),
  phone text NOT NULL CHECK (char_length(phone) BETWEEN 7 AND 25),
  service text NOT NULL CHECK (service IN ('Hajj','Umrah','Visa assistance','Flight arrangements','Accommodation','Other travel services')),
  travel_date date,
  travellers integer NOT NULL CHECK (travellers BETWEEN 1 AND 100),
  message text NOT NULL DEFAULT '' CHECK (char_length(message) <= 2000),
  submitted_at timestamptz NOT NULL DEFAULT now(),
  email text CHECK (email IS NULL OR char_length(email) <= 255),
  consent boolean NOT NULL DEFAULT true CHECK (consent = true),
  status text NOT NULL DEFAULT 'new'
);
GRANT ALL ON public.enquiries TO service_role;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read all enquiries" ON public.enquiries FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE INDEX enquiries_submitted_at_idx ON public.enquiries (submitted_at DESC);
INSERT INTO public.enquiries (id, name, phone, service, travel_date, travellers, message, submitted_at, email, consent, status)
SELECT id, full_name, phone, service, travel_date, travellers, message, created_at, email, consent, status FROM public.travel_enquiries;
CREATE OR REPLACE FUNCTION public.handle_new_admin_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF lower(NEW.email) = 'avdultravelsandtourltd@gmail.com' THEN
    INSERT INTO public.profiles (id, display_name, email)
    VALUES (NEW.id, COALESCE(NULLIF(NEW.raw_user_meta_data ->> 'display_name', ''), split_part(NEW.email, '@', 1)), NEW.email)
    ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin'::public.app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created_admin_profile
AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_admin_user();