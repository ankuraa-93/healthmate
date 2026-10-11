'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link2, Share2, Camera, Image as ImageIcon } from 'lucide-react';
import { toPng } from 'html-to-image';
import { FoodLogEntry, DailyTotals, Profile } from '@/lib/types';
import { getOrCreateShareLink, uploadAvatar, updateProfile } from '@/lib/supabase-data';
import ShareImageCard from './ShareImageCard';

interface ShareSheetProps {
  open: boolean;
  onClose: () => void;
  onToast: (message: string) => void;
  userId: string;
  logDate: string;
  selfDisplayName: string | null;
  selfAvatarUrl: string | null;
  selfEmail: string | null;
  onProfileUpdate: (fields: { display_name?: string; avatar_url?: string }) => void;
  logs: FoodLogEntry[];
  totals: DailyTotals;
  profile: Profile;
  selectedDate: Date;
}

function buildShareTitle(name: string | null, email: string | null, date: Date): string {
  const firstName = name?.trim().split(/\s+/)[0] || email?.split('@')[0] || 'My food log';
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const mon = months[date.getMonth()];
  const dd = date.getDate();
  const dow = days[date.getDay()];
  return `${firstName} - ${mon} ${dd}, ${dow}`;
}

function resizeImage(file: File, maxSize: number): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let sw = img.width;
      let sh = img.height;
      const scale = Math.min(maxSize / sw, maxSize / sh, 1);
      const tw = Math.round(sw * scale);
      const th = Math.round(sh * scale);
      let src: HTMLCanvasElement | HTMLImageElement = img;
      while (sw > tw * 2 || sh > th * 2) {
        const half = document.createElement('canvas');
        half.width = Math.round(sw / 2);
        half.height = Math.round(sh / 2);
        const hctx = half.getContext('2d')!;
        hctx.imageSmoothingQuality = 'high';
        hctx.drawImage(src, 0, 0, half.width, half.height);
        src = half;
        sw = half.width;
        sh = half.height;
      }
      const canvas = document.createElement('canvas');
      canvas.width = tw;
      canvas.height = th;
      const ctx = canvas.getContext('2d')!;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(src, 0, 0, tw, th);
      canvas.toBlob(
        (blob) => resolve(new File([blob!], file.name, { type: 'image/jpeg' })),
        'image/jpeg',
        0.9,
      );
    };
    img.src = URL.createObjectURL(file);
  });
}

function ProfileSetupView({ userId, displayName, avatarUrl, email, onDone, onSkip, onProfileUpdate }: {
  userId: string;
  displayName: string | null;
  avatarUrl: string | null;
  email: string | null;
  onDone: () => void;
  onSkip: () => void;
  onProfileUpdate: (fields: { display_name?: string; avatar_url?: string }) => void;
}) {
  const [name, setName] = useState(displayName ?? '');
  const [avatar, setAvatar] = useState(avatarUrl);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const resized = await resizeImage(file, 512);
    const url = await uploadAvatar(userId, resized);
    if (url) {
      setAvatar(url);
      await updateProfile(userId, { avatar_url: url });
    }
    setUploading(false);
    if (avatarInputRef.current) avatarInputRef.current.value = '';
  };

  const isComplete = !!avatar && !!name.trim();

  const syncToParent = async () => {
    const updates: { display_name?: string; avatar_url?: string } = {};
    const trimmed = name.trim();
    if (trimmed && trimmed !== displayName) {
      await updateProfile(userId, { display_name: trimmed });
      updates.display_name = trimmed;
    }
    if (avatar && avatar !== avatarUrl) updates.avatar_url = avatar;
    if (Object.keys(updates).length > 0) onProfileUpdate(updates);
  };

  const handleContinue = async () => {
    if (!isComplete) return;
    setSaving(true);
    await syncToParent();
    setSaving(false);
    onDone();
  };

  const initial = (name.trim() || displayName || email || '?')[0].toUpperCase();

  return (
    <div className="px-6 pt-4 pb-[max(env(safe-area-inset-bottom),24px)]">
      {/* Info banner */}
      <div className="bg-[#FFF4E6] rounded-xl px-3.5 py-3 mb-4">
        <span className="text-[13px] text-text-secondary">
          {!avatar && !name.trim()
            ? 'Set a display photo & name for easy identification'
            : !avatar
            ? 'Set a display photo for easy identification'
            : 'Set a display name for easy identification'}
        </span>
      </div>

      {/* Profile card — matches Account page layout */}
      <div className="bg-bg-secondary rounded-2xl px-4 py-5 mb-5 flex items-center gap-4">
        <button
          onClick={() => avatarInputRef.current?.click()}
          className="relative w-16 h-14 flex-shrink-0 bg-transparent border-none p-0 cursor-pointer"
          aria-label="Upload profile photo"
        >
          {avatar ? (
            <img src={avatar} alt="" className={`w-14 h-14 rounded-full object-cover block ${uploading ? 'opacity-50' : ''}`} />
          ) : (
            <div className={`w-14 h-14 rounded-full bg-accent flex items-center justify-center text-white text-xl font-semibold ${uploading ? 'opacity-50' : ''}`}>
              {initial}
            </div>
          )}
          <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-accent flex items-center justify-center shadow-sm">
            <Camera size={10} className="text-white" />
          </div>
          {uploading && (
            <div className="absolute inset-0 w-14 h-14 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </button>
        <input ref={avatarInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
        <div className="min-w-0 flex-1">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Add your name"
            className="w-full text-[17px] font-medium bg-transparent border-none outline-none p-0 placeholder:text-text-tertiary"
          />
          {email && (
            <div className="text-[14px] text-text-secondary truncate">{email}</div>
          )}
        </div>
      </div>

      {/* CTAs — Skip (grey) left, Proceed (green) right */}
      <div className="flex gap-3">
        <motion.button
          className="flex-1 py-3.5 bg-bg-secondary rounded-xl border-none text-text-secondary text-[15px] font-medium cursor-pointer"
          onClick={() => { syncToParent(); onSkip(); }}
          whileTap={{ scale: 0.98 }}
        >
          Skip
        </motion.button>
        <motion.button
          className="flex-1 py-3.5 bg-accent rounded-xl border-none text-white text-[15px] font-medium cursor-pointer disabled:opacity-40"
          onClick={handleContinue}
          disabled={!isComplete || saving}
          whileTap={isComplete ? { scale: 0.98 } : undefined}
        >
          Proceed
        </motion.button>
      </div>
    </div>
  );
}

export default function ShareSheet({ open, onClose, onToast, userId, logDate, selfDisplayName, selfAvatarUrl, selfEmail, onProfileUpdate, logs, totals, profile, selectedDate }: ShareSheetProps) {
  const needsProfileSetup = !selfDisplayName || !selfAvatarUrl;
  const [profileSetupDismissed, setProfileSetupDismissed] = useState(false);
  const showProfileSetup = open && needsProfileSetup && !profileSetupDismissed;
  const [copyingLink, setCopyingLink] = useState(false);
  const [sharingLink, setSharingLink] = useState(false);
  const [canDrag, setCanDrag] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const shareCardRef = useRef<HTMLDivElement>(null);

  const getShareUrl = async (): Promise<string | null> => {
    const token = await getOrCreateShareLink(userId, logDate);
    if (!token) return null;
    return `${window.location.origin}/share/${token}`;
  };

  const handleCopyLink = async () => {
    setCopyingLink(true);
    const url = await getShareUrl();
    setCopyingLink(false);
    if (!url) { onToast('Failed to create link'); return; }
    await navigator.clipboard.writeText(url);
    onToast('Link copied to clipboard');
  };

  const handleShareLink = async () => {
    if (!navigator.share) {
      handleCopyLink();
      return;
    }
    setSharingLink(true);
    const url = await getShareUrl();
    setSharingLink(false);
    if (!url) { onToast('Failed to create link'); return; }
    try {
      await navigator.share({ text: buildShareTitle(selfDisplayName, selfEmail, selectedDate), url });
    } catch {}
  };

  const handleShareImage = async () => {
    if (!shareCardRef.current) return;
    setGeneratingImage(true);
    try {
      const node = shareCardRef.current;
      // Temporarily attach to body so it has real layout for capture
      const wrapper = document.createElement('div');
      wrapper.style.cssText = 'position:fixed;left:-9999px;top:0;pointer-events:none;';
      wrapper.appendChild(node);
      document.body.appendChild(wrapper);
      // Wait one frame for layout
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

      const dataUrl = await toPng(node, {
        pixelRatio: 3,
        cacheBust: true,
        backgroundColor: '#FFFFFF',
      });

      // Move card back to its original parent
      wrapper.removeChild(node);
      document.body.removeChild(wrapper);

      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], 'food-log.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          text: buildShareTitle(selfDisplayName, selfEmail, selectedDate),
        });
      } else {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = 'food-log.png';
        a.click();
        onToast('Image saved');
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        onToast('Failed to share image');
      }
    } finally {
      setGeneratingImage(false);
    }
  };

  const handleClose = () => {
    setCanDrag(false);
    setProfileSetupDismissed(false);
    onClose();
  };

  return (
    <>
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="absolute inset-0 bg-black/30 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-bg-primary rounded-t-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] flex flex-col max-h-[92dvh] z-30"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag="y"
            dragListener={canDrag}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) handleClose();
            }}
          >
            {/* Handle */}
            <div
              className="pt-2.5 pb-1 flex-shrink-0 cursor-grab active:cursor-grabbing"
              onPointerDown={() => setCanDrag(true)}
            >
              <div className="w-9 h-1 bg-bg-tertiary rounded-full mx-auto" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-4 flex-shrink-0">
              <span className="text-[22px] font-medium">{showProfileSetup ? 'Before you share' : 'Sharing'}</span>
              <motion.button
                className="w-8 h-8 rounded-full bg-bg-secondary border-none flex items-center justify-center text-text-secondary cursor-pointer"
                onClick={handleClose}
                whileTap={{ scale: 0.9 }}
              >
                <X size={18} />
              </motion.button>
            </div>

            {showProfileSetup ? (
              <ProfileSetupView
                userId={userId}
                displayName={selfDisplayName}
                avatarUrl={selfAvatarUrl}
                email={selfEmail}
                onDone={() => setProfileSetupDismissed(true)}
                onSkip={() => setProfileSetupDismissed(true)}
                onProfileUpdate={onProfileUpdate}
              />
            ) : (
            <div
              className="flex-1 overflow-y-auto scrollbar-none px-6 pt-5 pb-[max(env(safe-area-inset-bottom),24px)]"
              onPointerDown={() => setCanDrag(false)}
            >
              {/* Horizontal share options */}
              <div className="grid grid-cols-3 gap-2">
                <motion.button
                  className="flex flex-col items-center gap-1.5 py-3.5 rounded-xl border-none cursor-pointer disabled:opacity-50 bg-bg-secondary"
                  onClick={handleShareImage}
                  disabled={generatingImage}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-text-secondary"><ImageIcon size={22} /></span>
                  <span className="text-[11px] font-medium text-text-secondary leading-tight text-center">Share as image</span>
                </motion.button>
                <motion.button
                  className="flex flex-col items-center gap-1.5 py-3.5 rounded-xl border-none cursor-pointer disabled:opacity-50 bg-bg-secondary"
                  onClick={handleCopyLink}
                  disabled={copyingLink}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-text-secondary"><Link2 size={22} /></span>
                  <span className="text-[11px] font-medium text-text-secondary leading-tight text-center">Copy link</span>
                </motion.button>
                <motion.button
                  className="flex flex-col items-center gap-1.5 py-3.5 rounded-xl border-none cursor-pointer disabled:opacity-50 bg-bg-secondary"
                  onClick={handleShareLink}
                  disabled={sharingLink}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-text-secondary"><Share2 size={22} /></span>
                  <span className="text-[11px] font-medium text-text-secondary leading-tight text-center">Share link</span>
                </motion.button>
              </div>
            </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>

    {/* Hidden card for image capture */}
    {open && (
      <div style={{ position: 'absolute', left: -9999, top: 0, overflow: 'hidden' }}>
        <ShareImageCard
          ref={shareCardRef}
          displayName={selfDisplayName}
          avatarUrl={selfAvatarUrl}
          date={selectedDate}
          totals={totals}
          profile={profile}
          logs={logs}
        />
      </div>
    )}
    </>
  );
}
