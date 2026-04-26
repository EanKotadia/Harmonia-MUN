import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Shield, Loader2, AlertCircle, KeyRound, Mail } from 'lucide-react';

interface LoginFormProps {
  onSuccess: () => void;
  onBack: () => void;
}

export default function LoginForm({ onSuccess, onBack }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
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
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-danger/10 border border-danger/20 rounded-2xl flex gap-3 text-danger">
              <AlertCircle size={18} className="shrink-0" />
              <p className="text-xs font-bold uppercase tracking-widest">{error}</p>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-5 flex items-center justify-center gap-3 relative overflow-hidden group"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
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
              className="w-full py-4 text-[10px] font-bold uppercase tracking-widest text-muted hover:text-white transition-colors"
            >
              Return to Website
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
