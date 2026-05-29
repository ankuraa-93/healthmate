'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const tabs = [
  { label: 'Home', icon: Home, path: '/' },
  { label: 'Settings', icon: Settings, path: '/settings' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="flex-shrink-0 pb-[max(8px,env(safe-area-inset-bottom))] bg-bg-primary border-t border-bg-tertiary/50 flex items-start justify-around pt-1.5 z-10">
      {tabs.map((tab) => {
        const isActive = pathname === tab.path;
        return (
          <motion.button
            key={tab.path}
            onClick={() => router.push(tab.path)}
            className={`flex flex-col items-center gap-0.5 bg-transparent border-none cursor-pointer px-4 py-1 ${
              isActive ? 'text-accent' : 'text-text-secondary'
            }`}
            whileTap={{ scale: 0.9 }}
          >
            <tab.icon size={24} />
            <span className="text-xs font-medium">{tab.label}</span>
          </motion.button>
        );
      })}
    </nav>
  );
}
