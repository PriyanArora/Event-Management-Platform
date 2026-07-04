import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthShell } from './AuthShell';
import { Button } from '../../components/ui/Button';
import { Field, Input } from '../../components/ui/Field';
import { useAuth } from '../../lib/auth';
import { ApiError } from '../../lib/api';

interface LocationState {
  from?: string;
}

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as LocationState | null)?.from;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await login(email, password);
      const dest = from ?? (user.role === 'ORGANIZER' ? '/organizer' : '/events');
      navigate(dest, { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle={
        <>
          New to Qeue?{' '}
          <Link to="/signup" className="font-medium text-accent hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        {error && (
          <div className="rounded border border-red-200 bg-red-50 px-3.5 py-2.5 text-[13px] text-red-800">
            {error}
          </div>
        )}
        <Field label="Email" htmlFor="email" required>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>
        <Field label="Password" htmlFor="password" required>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Field>
        <Button type="submit" loading={loading} className="w-full" size="lg">
          Sign in
        </Button>
      </form>

      <div className="mt-6 rounded border border-zinc-200 bg-zinc-50 p-3.5 text-[12px] leading-relaxed text-zinc-500">
        <p className="microlabel">Local demo accounts</p>
        <p className="mt-2 font-mono text-[12px]">
          Organizer — <span className="text-zinc-700">organizer@qeue.local</span>
          <br />
          Attendee — <span className="text-zinc-700">attendee@qeue.local</span>
          <br />
          Password — <span className="text-zinc-700">LocalDevPassword1!</span>
        </p>
      </div>
    </AuthShell>
  );
}
