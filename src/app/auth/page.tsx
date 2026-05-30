'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/supabase';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const supabase = createClient();

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
    }

    router.push('/');
    router.refresh();
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Enter your email first');
      return;
    }
    setError('');
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess('Password reset link sent — check your email');
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-8 bg-bg-primary">
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <motion.div
            className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </motion.div>
          <h1 className="text-2xl font-semibold">HealthMate</h1>
          <p className="text-text-secondary text-sm mt-1">Track your calories with natural language</p>
        </div>

        {/* Toggle */}
        <div className="flex bg-bg-secondary rounded-xl p-1 mb-6">
          {['Sign In', 'Sign Up'].map((label, i) => {
            const active = i === 0 ? !isSignUp : isSignUp;
            return (
              <button
                key={label}
                onClick={() => { setIsSignUp(i === 1); setError(''); setSuccess(''); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium border-none cursor-pointer transition-all ${
                  active
                    ? 'bg-bg-primary text-text-primary shadow-sm'
                    : 'bg-transparent text-text-secondary'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Error */}
        {error && (
          <motion.div
            className="bg-destructive/10 text-destructive text-sm rounded-xl px-4 py-3 mb-4"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        {/* Success */}
        {success && (
          <motion.div
            className="bg-accent/10 text-accent text-sm rounded-xl px-4 py-3 mb-4"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {success}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-bg-secondary border-none rounded-xl px-4 py-3.5 text-base text-text-primary outline-none placeholder:text-text-tertiary focus:ring-2 focus:ring-accent/25 transition-shadow"
            required
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-bg-secondary border-none rounded-xl px-4 py-3.5 pr-11 text-base text-text-primary outline-none placeholder:text-text-tertiary focus:ring-2 focus:ring-accent/25 transition-shadow"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-0.5 text-text-tertiary"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <AnimatePresence initial={false}>
            {isSignUp && (
              <motion.div
                key="confirm-password"
                className="relative overflow-hidden"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
              >
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-bg-secondary border-none rounded-xl px-4 py-3.5 pr-11 text-base text-text-primary outline-none placeholder:text-text-tertiary focus:ring-2 focus:ring-accent/25 transition-shadow"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-0.5 text-text-tertiary"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-white border-none rounded-xl py-3.5 text-base font-medium cursor-pointer mt-2 disabled:opacity-60"
            whileTap={{ scale: 0.97 }}
          >
            {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
          </motion.button>
        </form>

        <AnimatePresence initial={false}>
          {!isSignUp && (
            <motion.div
              key="forgot-password"
              className="overflow-hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              <button
                onClick={handleForgotPassword}
                disabled={loading}
                className="w-full text-center text-sm text-text-secondary bg-transparent border-none cursor-pointer mt-4 hover:text-accent transition-colors disabled:opacity-60"
              >
                Forgot password?
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
