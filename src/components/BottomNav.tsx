'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/AuthProvider';
import { fetchProfile } from '@/lib/supabase-data';

function getInitial(name?: string | null, email?: string | null): string {
  if (name) return name.trim()[0].toUpperCase();
  if (email) return email[0].toUpperCase();
  return '?';
}

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchProfile(user.id).then(p => {
      if (p) {
        setAvatarUrl(p.avatar_url);
        setDisplayName(p.display_name);
      }
    });
  }, [user, pathname]);

  const isHomeActive = pathname === '/';
  const isAccountActive = pathname === '/settings';
  const initial = getInitial(displayName ?? user?.user_metadata?.display_name, user?.email);

  return (
    <nav className="flex-shrink-0 pb-[max(8px,env(safe-area-inset-bottom))] bg-bg-primary flex items-start justify-around pt-1.5 z-10 shadow-[0_-2px_8px_rgba(0,0,0,0.06)]" style={{ touchAction: 'manipulation', position: 'sticky', bottom: 0 }}>
      <motion.button
        onClick={() => router.push('/')}
        className={`flex flex-col items-center gap-0.5 bg-transparent border-none cursor-pointer px-4 py-1 ${
          isHomeActive ? 'text-accent' : 'text-text-secondary'
        }`}
        whileTap={{ scale: 0.9 }}
      >
        <Home size={24} />
        <span className="text-xs font-medium">Home</span>
      </motion.button>

      <motion.button
        onClick={() => router.push('/settings')}
        className={`flex flex-col items-center gap-0.5 bg-transparent border-none cursor-pointer px-4 py-1 ${
          isAccountActive ? 'text-accent' : 'text-text-secondary'
        }`}
        whileTap={{ scale: 0.9 }}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt=""
            className={`w-6 h-6 rounded-full object-cover ${
              isAccountActive ? 'ring-[1.5px] ring-accent' : ''
            }`}
          />
        ) : (
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold ${
            isAccountActive
              ? 'bg-accent text-white'
              : 'bg-bg-tertiary text-text-secondary'
          }`}>
            {initial}
          </div>
        )}
        <span className="text-xs font-medium">Account</span>
      </motion.button>
    </nav>
  );
}
