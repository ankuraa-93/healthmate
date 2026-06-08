'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, ChevronRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { fetchProfile } from '@/lib/supabase-data';
import { Profile } from '@/lib/types';
import PersonalizeGoalsFlow from '@/components/PersonalizeGoalsFlow';
import Toast from '@/components/Toast';

type Stage = 'choose' | 'personalize';

function OnboardingInner() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const fromSettings = params.get('from') === 'settings';
  const initialMode = params.get('mode');

  // mode=personalize opens the input form; mode=goals jumps to the review screen.
  const directToFlow = initialMode === 'personalize' || initialMode === 'goals';
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stage, setStage] = useState<Stage>(directToFlow ? 'personalize' : 'choose');
  const [toast, setToast] = useState({ visible: false, message: '' });

  // Landing here clears the soft "new user should onboard" flag (see auth flow).
  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.removeItem('hm_onboard_pending');
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchProfile(user.id).then((p) => { if (p) setProfile(p); });
  }, [user]);

  const showToast = (message: string) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: '' }), 2200);
  };

  const returnTo = fromSettings ? '/settings' : '/';
  const finish = () => { router.push(returnTo); router.refresh(); };

  const handleSaved = () => {
    showToast('Goals updated ✓');
    setTimeout(finish, 700);
  };

  // If the flow was opened directly (from Settings via ?mode=…), Back returns to
  // Settings. If they got here through the chooser, Back returns to it.
  const backFromFlow = directToFlow ? finish : () => setStage('choose');

  if (!user) return null;

  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex-1 overflow-y-auto scrollbar-none px-5 pb-10 pt-14">
        {stage === 'choose' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-[26px] font-semibold tracking-tight mb-1.5">
              {fromSettings ? 'Update your goals' : 'Set your goals'}
            </h1>
            <p className="text-[15px] text-text-secondary mb-8 leading-snug">
              Personalized targets are far more accurate than the 2,000-cal default — especially for your body and training.
            </p>

            <button
              onClick={() => setStage('personalize')}
              className="w-full text-left bg-bg-secondary rounded-2xl p-4 mb-3 border-none cursor-pointer flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-accent/12 flex items-center justify-center flex-shrink-0">
                <Sparkles size={18} className="text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[16px] font-semibold">Personalize for me</div>
                <div className="text-[13px] text-text-secondary mt-0.5 leading-snug">
                  A few questions about your body and weekly activity → we calculate your calories &amp; macros.
                </div>
              </div>
              <ChevronRight size={18} className="text-text-tertiary flex-shrink-0" />
            </button>

            <button
              onClick={finish}
              className="w-full text-center text-[15px] text-text-secondary bg-transparent border-none cursor-pointer py-2 mt-4"
            >
              {fromSettings ? 'Cancel' : 'Skip for now'}
            </button>
          </motion.div>
        )}

        {stage === 'personalize' && (
          // Wait for the profile so the form's initial state prefills with the
          // user's saved values (useState initializers only run on first render).
          profile ? (
            <PersonalizeGoalsFlow
              userId={user.id}
              profile={profile}
              onBack={backFromFlow}
              onSaved={handleSaved}
              onToast={showToast}
              initialView={initialMode === 'goals' ? 'review' : 'form'}
            />
          ) : (
            <div className="flex justify-center pt-24">
              <Loader2 size={22} className="animate-spin text-text-tertiary" />
            </div>
          )
        )}
      </div>
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={null}>
      <OnboardingInner />
    </Suspense>
  );
}
