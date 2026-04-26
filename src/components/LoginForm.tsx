import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Shield, Loader2, AlertCircle, KeyRound, Mail, CheckCircle2 } from 'lucide-react';

interface LoginFormProps {
  onSuccess: () => void;
  onBack: () => void;
}

export default function LoginForm({ onSuccess, onBack }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!supabase) throw new Error('Supabase client not initialized');

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (signInError) {
        if (signInError.message === 'Invalid login credentials') {
          throw new Error('Invalid email or password. Please try again.');
        }
        throw signInError;
      }

      if (data?.user) {
        setSuccess(true);
        // Small delay to show success state
        setTimeout(() => {
          onSuccess();
        }, 800);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to sign in. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-accent/10 text-accent rounded-3xl flex items-center justify-center mx-auto border border-accent/20">
            <Shield size={40} />
          </div>
          <h2 className="text-4xl font-display text-white uppercase tracking-tight">Admin Access</h2>
          <p className="font-ui text-[10px] font-bold uppercase tracking-[0.4em] text-muted">Secure Authorization Required</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors">
                <Mail size={18} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Admin Email"
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-accent/40 outline-none transition-all font-sans"
                required
                disabled={loading || success}
              />
            </div>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors">
                <KeyRound size={18} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Access Password"
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-accent/40 outline-none transition-all font-sans"
                required
                disabled={loading || success}
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-danger/10 border border-danger/20 rounded-2xl flex gap-3 text-danger animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={18} className="shrink-0" />
              <p className="text-xs font-bold uppercase tracking-widest">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-4 bg-success/10 border border-success/20 rounded-2xl flex gap-3 text-success animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 size={18} className="shrink-0" />
              <p className="text-xs font-bold uppercase tracking-widest">Login successful! Redirecting...</p>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <button
              type="submit"
              disabled={loading || success}
              className="w-full btn-primary py-5 flex items-center justify-center gap-3 relative overflow-hidden group disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : success ? (
                <CheckCircle2 size={20} />
              ) : (
                <>
                  <span className="relative z-10">Authenticate</span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onBack}
              disabled={loading || success}
              className="w-full py-4 text-[10px] font-bold uppercase tracking-widest text-muted hover:text-white transition-colors disabled:opacity-30"
            >
              Return to Website
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
