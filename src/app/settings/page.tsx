'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, UserRound, Target, LogOut, ChevronRight, Pencil } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import DefaultGoalsSuggestion from '@/components/DefaultGoalsSuggestion';
import { useAuth } from '@/components/AuthProvider';
import { createClient } from '@/lib/supabase';
import { fetchProfile } from '@/lib/supabase-data';
import { Profile } from '@/lib/types';

interface GoalRowProps {
  label: string;
  value: number;
  unit: string;
  noBorder?: boolean;
}

function GoalRow({ label, value, unit, noBorder }: GoalRowProps) {
  return (
    <div className={`flex justify-between items-center py-3 ${noBorder ? '' : 'border-b border-bg-tertiary/50 last:border-b-0'}`}>
      <span className="text-[15px]">{label}</span>
      <span className="text-[15px] text-text-secondary">{value}{unit}</span>
    </div>
  );
}

function AboutRow({ label, value, noBorder }: { label: string; value: string; noBorder?: boolean }) {
  return (
    <div className={`flex justify-between items-center py-3 ${noBorder ? '' : 'border-b border-bg-tertiary/50'}`}>
      <span className="text-[15px]">{label}</span>
      <span className="text-[15px] text-text-secondary">{value}</span>
    </div>
  );
}

const cap = (s?: string | null) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '—');

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function formatDob(d?: string | null) {
  if (!d) return '—';
  const [y, m, day] = d.split('-').map(Number);
  return `${day} ${MONTHS[m - 1]} ${y}`;
}

// Map the stored TDEE activity factor back to a human label for display.
function activityLevelLabel(factor?: number | null) {
  if (factor == null) return '—';
  const bands: [number, string][] = [
    [1.2, 'Sedentary'],
    [1.375, 'Lightly active'],
    [1.55, 'Moderately active'],
    [1.725, 'Very active'],
    [1.9, 'Extra active'],
  ];
  return bands.reduce((best, b) => (Math.abs(b[0] - factor) < Math.abs(best[0] - factor) ? b : best))[1];
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
    <div className="absolute inset-0 flex flex-col">
      <div className="flex-1 overflow-y-auto scrollbar-none px-4 pb-8">
        {/* Header */}
        <motion.div
          className="pt-14 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className="text-[22px] font-medium">Settings</span>
        </motion.div>

        {/* Profile section */}
        <motion.div
          className="bg-bg-secondary rounded-2xl px-4 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="text-xs font-medium text-text-secondary uppercase tracking-wide pt-3 pb-2 flex items-center gap-1.5">
            <User size={12} />
            Profile
          </div>
          <div className="flex justify-between items-center py-3 border-b border-bg-tertiary/50">
            <span className="text-[15px]">Display Name</span>
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

        {/* About You — the personalization inputs; edit here re-runs the form */}
        {profile && profile.goals_mode === 'personalized' && (
          <motion.div
            className="bg-bg-secondary rounded-2xl px-4 mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
          >
            <div className="text-xs font-medium text-text-secondary uppercase tracking-wide pt-3 pb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <UserRound size={12} />
                About You
              </span>
              <button
                onClick={() => router.push('/onboarding?from=settings&mode=personalize')}
                className="bg-transparent border-none cursor-pointer p-0 flex items-center"
                aria-label="Edit about you"
              >
                <Pencil size={14} className="text-text-secondary" />
              </button>
            </div>
            <AboutRow label="Sex" value={cap(profile.sex)} />
            <AboutRow label="Date of birth" value={formatDob(profile.birth_date)} />
            <AboutRow label="Height" value={profile.height_cm != null ? `${Math.round(profile.height_cm)} cm` : '—'} />
            <AboutRow label="Weight" value={profile.weight_kg != null ? `${profile.weight_kg} kg` : '—'} />
            <AboutRow label="Weight goal" value={cap(profile.goal_type)} />
            {profile.goal_type && profile.goal_type !== 'maintain' && (
              <AboutRow
                label={`Target ${profile.goal_type === 'lose' ? 'loss' : 'gain'}`}
                value={`${profile.goal_pace_kg_per_month} kg/mo`}
              />
            )}
            <AboutRow label="Weekly activity" value={activityLevelLabel(profile.activity_factor)} noBorder />
          </motion.div>
        )}

        {/* Goals section */}
        {profile && (
          <motion.div
            className="bg-bg-secondary rounded-2xl px-4 mb-4 overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-xs font-medium text-text-secondary uppercase tracking-wide pt-3 pb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Target size={12} />
                Daily Goals
              </span>
              {profile.goals_mode === 'personalized' && (
                <button
                  onClick={() => router.push('/onboarding?from=settings&mode=goals')}
                  className="bg-transparent border-none cursor-pointer p-0 flex items-center"
                  aria-label="Edit daily goals"
                >
                  <Pencil size={14} className="text-text-secondary" />
                </button>
              )}
            </div>
            <GoalRow label="Calories" value={profile.daily_calorie_goal} unit=" cal" />
            <GoalRow label="Protein" value={profile.daily_protein_goal} unit="g" />
            <GoalRow label="Carbs" value={profile.daily_carbs_goal} unit="g" />
            <GoalRow label="Fat" value={profile.daily_fat_goal} unit="g" />
            <GoalRow label="Fibre" value={profile.daily_fibre_goal} unit="g" noBorder />

            {/* Suggestion: only while on defaults. Edge-to-edge band joined to
                the bottom of the card (-mx-4 cancels the card's px-4). */}
            {(profile.goals_mode ?? 'default') === 'default' && (
              <DefaultGoalsSuggestion
                href="/onboarding?from=settings&mode=personalize"
                className="-mx-4 px-4 py-3 bg-[#FFF4E6] rounded-b-2xl border-t border-bg-tertiary"
              />
            )}
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
