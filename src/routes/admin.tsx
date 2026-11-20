import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { CheckCircle2, Loader2, LogOut, LockKeyhole, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { business, isAdminEmail, pageHead } from '@/lib/travel';
import { listAdminEnquiries } from '@/lib/admin-enquiries.functions';

export const Route = createFileRoute('/admin')({
  head: () => pageHead('Admin Enquiries', 'Private enquiry inbox for AVDUL TRAVELS AND TOUR LTD.', '/admin'),
  component: AdminPage,
});

type Enquiry = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  service: string;
  travel_date: string | null;
  travellers: number;
  message: string;
  submitted_at: string;
  status: string;
};

function AdminPage() {
  const getEnquiries = useServerFn(listAdminEnquiries);
  const [view, setView] = useState<'checking' | 'signed-out' | 'pending' | 'dashboard' | 'denied'>('checking');
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [email, setEmail] = useState(business.email);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const refreshEnquiries = useCallback(async () => {
    try {
      const result = await getEnquiries();
      if (!result.ok) {
        setEnquiries([]);
        setView('denied');
        return;
      }
      setEnquiries(result.enquiries as Enquiry[]);
      setView('dashboard');
    } catch {
      setEnquiries([]);
      setView('denied');
    }
  }, [getEnquiries]);

  useEffect(() => {
    let active = true;
    void supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      if (data.user) void refreshEnquiries();
      else setView('signed-out');
    }).catch(() => {
      if (active) setView('signed-out');
    });
    return () => { active = false; };
  }, [refreshEnquiries]);

  async function handleAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    if (!isAdminEmail(email)) {
      setError(`Only ${business.email} can access the admin inbox.`);
      return;
    }
    if (password.length < 12) {
      setError('Use a password with at least 12 characters.');
      return;
    }

    setBusy(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signInError) setError('We could not sign you in. Check your email confirmation and password.');
      else await refreshEnquiries();
    } catch {
      setError('We could not complete that request. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setEnquiries([]);
    setView('signed-out');
    setPassword('');
    setNotice('');
  }

  if (view === 'checking') {
    return <main className="admin-page"><section className="admin-shell"><Loader2 className="animate-spin" aria-label="Checking sign-in"/></section></main>;
  }

  if (view === 'denied') {
    return <main className="admin-page"><section className="admin-shell"><div className="admin-title"><LockKeyhole/><span>PRIVATE ADMIN</span></div><h1>Admin access only</h1><p>This account cannot view the private enquiry inbox.</p><Button variant="outline" onClick={signOut}><LogOut/>Sign out</Button></section></main>;
  }

  if (view === 'dashboard') {
    return <main className="admin-page"><section className="admin-dashboard">
      <header className="admin-dashboard-header"><div><div className="admin-title"><LockKeyhole/><span>AVDUL TRAVELS & TOUR LTD</span></div><h1>Enquiries</h1><p>{enquiries.length} most recent enquiries</p></div><div className="admin-actions"><Button variant="outline" onClick={() => void refreshEnquiries()} aria-label="Refresh enquiries"><RefreshCw/>Refresh</Button><Button variant="ghost" onClick={signOut}><LogOut/>Sign out</Button></div></header>
      {enquiries.length === 0 ? <div className="admin-empty"><CheckCircle2/><h2>No enquiries yet</h2><p>New website enquiries will appear here.</p></div> : <div className="admin-enquiry-list">{enquiries.map(enquiry => <article className="admin-enquiry" key={enquiry.id}>
        <div className="admin-enquiry-heading"><div><span className="admin-service">{enquiry.service}</span><h2>{enquiry.name}</h2></div><time dateTime={enquiry.submitted_at}>{new Date(enquiry.submitted_at).toLocaleString()}</time></div>
        <dl><div><dt>Phone</dt><dd><a href={`tel:${enquiry.phone}`}>{enquiry.phone}</a></dd></div><div><dt>Travel date</dt><dd>{enquiry.travel_date || 'Not provided'}</dd></div><div><dt>Travellers</dt><dd>{enquiry.travellers}</dd></div>{enquiry.email && <div><dt>Email</dt><dd><a href={`mailto:${enquiry.email}`}>{enquiry.email}</a></dd></div>}</dl>
        {enquiry.message && <p className="admin-message">{enquiry.message}</p>}
      </article>)}</div>}
    </section></main>;
  }

  return <main className="admin-page"><section className="admin-shell">
    <div className="admin-title"><LockKeyhole/><span>PRIVATE ADMIN</span></div>
    <h1>Enquiry inbox</h1>
    <p>Sign in to view enquiries for {business.name}.</p>
    <form className="admin-form" onSubmit={handleAuth}>
      <label>Email address<input name="email" type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} required maxLength={255}/></label>
      <label>Password<input name="password" type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required minLength={12} maxLength={72}/></label>
      {error && <p role="alert" className="form-error">{error}</p>}
      <Button className="admin-submit" type="submit" disabled={busy}>{busy && <Loader2 className="animate-spin"/>}Sign in</Button>
    </form>
  </section></main>;
}