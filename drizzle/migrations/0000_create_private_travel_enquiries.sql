CREATE TABLE public.travel_enquiries (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 created_at timestamptz NOT NULL DEFAULT now(),
 full_name text NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 100),
 phone text NOT NULL CHECK (char_length(phone) BETWEEN 7 AND 25),
 email text CHECK (char_length(email) <= 255),
 service text NOT NULL CHECK (service IN ('Hajj','Umrah','Visa assistance','Flight arrangements','Accommodation','Other travel services')),
 travellers integer NOT NULL CHECK (travellers BETWEEN 1 AND 100),
 travel_date date,
 message text NOT NULL DEFAULT '' CHECK (char_length(message) <= 2000),
 consent boolean NOT NULL CHECK (consent = true),
 status text NOT NULL DEFAULT 'new'
);
GRANT ALL ON public.travel_enquiries TO service_role;
ALTER TABLE public.travel_enquiries ENABLE ROW LEVEL SECURITY;
CREATE INDEX travel_enquiries_phone_created_idx ON public.travel_enquiries (phone, created_at DESC);
COMMENT ON TABLE public.travel_enquiries IS 'Private booking enquiries. Review in Lovable Cloud. No visitor read or direct-write access; validated server-only submissions.';