'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { PawPrint } from 'lucide-react';
import { signIn } from '@/app/actions';
import { LineCat } from '@/app/_components/icons';

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(signIn, undefined);

  return (
    <div className="login-page">
      <form className="login-card" action={formAction}>
        <Link className="brand login-brand" href="/" aria-label="Snuggle Cat Sitter home">
          <LineCat className="brand-cat" />
          <span>
            <strong>Snuggle</strong>
            <small>Cat Sitter</small>
          </span>
        </Link>

        <h1>Admin Login</h1>
        <p>Sign in to view and manage booking requests.</p>

        <label className="form-field" htmlFor="email">
          <span>Email</span>
          <input id="email" name="email" type="email" placeholder="you@example.com" required autoComplete="email" />
        </label>
        <label className="form-field" htmlFor="password">
          <span>Password</span>
          <input id="password" name="password" type="password" placeholder="••••••••" required autoComplete="current-password" />
        </label>

        {state?.error && <p className="field-error">{state.error}</p>}

        <button className="primary-button" type="submit" disabled={pending}>
          <PawPrint aria-hidden="true" size={18} />
          {pending ? 'Signing in…' : 'Sign In'}
        </button>

        <Link className="login-back" href="/">← Back to website</Link>
      </form>
    </div>
  );
}
