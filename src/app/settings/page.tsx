'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Target, LogOut, ChevronRight } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/components/AuthProvider';
import { createClient } from '@/lib/supabase';
import { fetchProfile } from '@/lib/supabase-data';
import { Profile } from '@/lib/types';

interface GoalRowProps {
  label: string;
  value: number;
  unit: string;
}

function GoalRow({ label, value, unit }: GoalRowProps) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-bg-tertiary/50 last:border-b-0">
      <span className="text-[15px]">{label}</span>
      <span className="text-[15px] text-text-secondary">{value}{unit}</span>
    </div>
  );
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [signingOut, setSigningOut] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    fetchProfile(user.id).then(p => { if (p) setProfile(p); });
  }, [user]);

  const handleSignOut = async () => {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth');
    router.refresh();
  };

  return (
    <div className="absolute inset-0 overflow-y-auto scrollbar-none">
      <div className="px-4 pb-[120px]">
        {/* Header */}
        <motion.div
          className="pt-14 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className="text-[22px] font-semibold">Settings</span>
        </motion.div>

        {/* Profile section */}
        <motion.div
          className="bg-bg-secondary rounded-2xl px-4 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="text-xs font-medium text-text-secondary uppercase tracking-wide pt-3 pb-2">Profile</div>
          <div className="flex justify-between items-center py-3 border-b border-bg-tertiary/50">
            <span className="text-[15px] flex items-center gap-2">
              <User size={16} className="text-text-secondary" />
              Display Name
            </span>
            <div className="flex items-center gap-1">
              <span className="text-[15px] text-text-secondary">{profile?.display_name || 'Not set'}</span>
              <ChevronRight size={16} className="text-text-tertiary" />
            </div>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-[15px]">Email</span>
            <span className="text-[15px] text-text-secondary">{user?.email ?? '—'}</span>
          </div>
        </motion.div>

        {/* Goals section */}
        {profile && (
          <motion.div
            className="bg-bg-secondary rounded-2xl px-4 mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-xs font-medium text-text-secondary uppercase tracking-wide pt-3 pb-2 flex items-center gap-1.5">
              <Target size={12} />
              Daily Goals
            </div>
            <GoalRow label="Calories" value={profile.daily_calorie_goal} unit=" cal" />
            <GoalRow label="Protein" value={profile.daily_protein_goal} unit="g" />
            <GoalRow label="Carbs" value={profile.daily_carbs_goal} unit="g" />
            <GoalRow label="Fat" value={profile.daily_fat_goal} unit="g" />
            <GoalRow label="Fibre" value={profile.daily_fibre_goal} unit="g" />
          </motion.div>
        )}

        {/* Sign Out */}
        <motion.div
          className="bg-bg-secondary rounded-2xl px-4 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="w-full flex items-center justify-center gap-2 py-3.5 text-destructive text-[15px] font-medium bg-transparent border-none cursor-pointer disabled:opacity-60"
          >
            <LogOut size={16} />
            {signingOut ? 'Signing out...' : 'Sign Out'}
          </button>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
