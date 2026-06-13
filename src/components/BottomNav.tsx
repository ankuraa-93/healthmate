'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const isHomeActive = pathname === '/';
  const isAccountActive = pathname === '/settings';

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
        <User size={24} />
        <span className="text-xs font-medium">Account</span>
      </motion.button>
    </nav>
  );
}
