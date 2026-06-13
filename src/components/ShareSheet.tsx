'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, UserPlus, Eye, Check, XIcon, Link2, Share2, ChevronDown, Camera } from 'lucide-react';
import { PendingRequest, ManagedConnection } from '@/lib/types';
import { createShareConnection, updateConnectionStatus, getOrCreateShareLink, fetchAllMyConnections, uploadAvatar, updateProfile } from '@/lib/supabase-data';

interface ShareSheetProps {
  open: boolean;
  onClose: () => void;
  pendingRequests: PendingRequest[];
  onToast: (message: string) => void;
  onRefresh: () => void;
  userId: string;
  logDate: string;
  selfDisplayName: string | null;
  selfAvatarUrl: string | null;
  selfEmail: string | null;
  onProfileUpdate: (fields: { display_name?: string; avatar_url?: string }) => void;
}

interface SearchResult {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  share_status: 'accepted' | 'pending' | null;
  request_status: 'accepted' | 'pending' | null;
}

function getInitial(name?: string | null, email?: string | null): string {
  if (name) return name.trim()[0].toUpperCase();
  if (email) return email[0].toUpperCase();
  return '?';
}

function getDisplayLabel(r: SearchResult): string {
  if (r.display_name && r.email) return `${r.display_name} (${r.email})`;
  return r.email || r.display_name || '?';
}

type DropdownMode = 'share' | 'request';

function SearchDropdown({
  results,
  onSelect,
  selectedIds,
  mode,
}: {
  results: SearchResult[];
  onSelect: (r: SearchResult) => void;
  selectedIds: Set<string>;
  mode: DropdownMode;
}) {
  if (results.length === 0) return null;

  return (
    <div className="mt-1.5 bg-bg-primary rounded-xl overflow-hidden border border-bg-tertiary">
      {results.map((r, idx) => {
        const alreadySelected = selectedIds.has(r.id);
        const status = mode === 'share' ? r.share_status : r.request_status;
        let badgeText: string | null = null;
        let disabled = alreadySelected;

        if (status === 'accepted') {
          badgeText = mode === 'share' ? 'Already shared' : 'Connected';
          disabled = true;
        } else if (status === 'pending') {
          badgeText = 'Pending';
          disabled = true;
        }

        return (
          <button
            key={r.id}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 bg-transparent border-none text-left ${idx > 0 ? 'border-t border-bg-tertiary' : ''} ${disabled ? 'opacity-50 cursor-default' : 'cursor-pointer'}`}
            onClick={() => { if (!disabled) onSelect(r); }}
            disabled={disabled}
          >
            {r.avatar_url ? (
              <img src={r.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center text-accent text-[12px] font-semibold flex-shrink-0">
                {getInitial(r.display_name, r.email)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              {r.display_name && <div className="text-[13px] font-medium truncate">{r.display_name}</div>}
              <div className="text-[12px] text-text-secondary truncate">{r.email}</div>
            </div>
            {badgeText && (
              <span className="text-[11px] font-medium text-text-tertiary bg-bg-tertiary rounded-full px-2 py-0.5 flex-shrink-0">
                {badgeText}
              </span>
            )}
            {alreadySelected && !badgeText && (
              <Check size={14} className="text-accent flex-shrink-0" />
            )}
          </button>
        );
      })}
    </div>
  );
}

function PillInput({
  selected,
  onRemove,
  inputRef,
  query,
  onQueryChange,
  placeholder,
}: {
  selected: SearchResult[];
  onRemove: (id: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  query: string;
  onQueryChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div
      className="flex-1 bg-bg-primary rounded-lg px-2 py-1.5 flex flex-wrap items-center gap-1.5 min-h-[40px] min-w-0 cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {selected.map(r => (
        <span
          key={r.id}
          className="inline-flex items-center gap-1 bg-accent/10 text-accent rounded-full pl-2 pr-0.5 py-0.5 text-[12px] font-medium"
        >
          <span className="truncate max-w-[180px]">{getDisplayLabel(r)}</span>
          <button
            className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center border-none cursor-pointer flex-shrink-0 hover:bg-accent/30"
            onClick={e => { e.stopPropagation(); onRemove(r.id); }}
          >
            <X size={10} className="text-accent" />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        type="text"
        placeholder={selected.length === 0 ? placeholder : ''}
        value={query}
        onChange={e => onQueryChange(e.target.value)}
        className="flex-1 bg-transparent border-none outline-none text-[14px] placeholder:text-text-tertiary min-w-[80px] py-1 px-1"
      />
    </div>
  );
}

interface ConnectionListItem {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  joined: boolean;
  pending?: boolean;
}

function ConnectionList({ title, items, onRemove, removingId }: {
  title: string;
  items: ConnectionListItem[];
  onRemove?: (id: string, name: string) => void;
  removingId?: string | null;
}) {
  if (items.length === 0) return null;
  return (
    <div className="mt-3 pt-3 border-t border-bg-tertiary/50">
      <div className="text-[11px] font-medium text-text-tertiary uppercase tracking-wide mb-2">
        {title}
      </div>
      <div className="space-y-0">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-2 py-1.5">
            {item.avatar_url ? (
              <img src={item.avatar_url} alt="" className="w-6 h-6 rounded-full object-cover flex-shrink-0" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center text-accent text-[10px] font-semibold flex-shrink-0">
                {getInitial(item.name, item.email)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <span className="text-[13px] truncate block">
                {item.name}
                {item.name !== item.email && (
                  <span className="text-text-tertiary ml-1">{item.email}</span>
                )}
              </span>
            </div>
            {!item.joined && (
              <span className="text-[10px] text-text-tertiary bg-bg-tertiary rounded-full px-1.5 py-0.5 flex-shrink-0">
                Not yet joined
              </span>
            )}
            {item.pending && (
              <span className="text-[10px] text-amber-500 bg-amber-500/10 rounded-full px-1.5 py-0.5 flex-shrink-0">
                Pending
              </span>
            )}
            {onRemove && (
              <motion.button
                className="w-6 h-6 rounded-full bg-bg-tertiary flex items-center justify-center border-none cursor-pointer flex-shrink-0 disabled:opacity-50"
                onClick={() => onRemove(item.id, item.name)}
                disabled={removingId === item.id}
                whileTap={{ scale: 0.9 }}
              >
                <X size={12} className="text-text-secondary" />
              </motion.button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function useSearch(query: string) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const q = query.trim();

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.length < 2) {
      debounceRef.current = setTimeout(() => setResults([]), 0);
      return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/share-connections/search?q=${encodeURIComponent(q)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results ?? []);
        }
      } catch {}
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [q]);

  return results;
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

export default function ShareSheet({ open, onClose, pendingRequests, onToast, onRefresh, userId, logDate, selfDisplayName, selfAvatarUrl, selfEmail, onProfileUpdate }: ShareSheetProps) {
  const needsProfileSetup = !selfDisplayName || !selfAvatarUrl;
  const [profileSetupDismissed, setProfileSetupDismissed] = useState(false);
  const showProfileSetup = open && needsProfileSetup && !profileSetupDismissed;
  const [connections, setConnections] = useState<ManagedConnection[]>([]);
  const [shareQuery, setShareQuery] = useState('');
  const [requestQuery, setRequestQuery] = useState('');
  const [selectedShareUsers, setSelectedShareUsers] = useState<SearchResult[]>([]);
  const [selectedRequestUsers, setSelectedRequestUsers] = useState<SearchResult[]>([]);
  const [sharingInProgress, setSharingInProgress] = useState(false);
  const [requestingInProgress, setRequestingInProgress] = useState(false);
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [shareExpanded, setShareExpanded] = useState(pendingRequests.length === 0);
  const [requestExpanded, setRequestExpanded] = useState(false);
  const [copyingLink, setCopyingLink] = useState(false);
  const [sharingLink, setSharingLink] = useState(false);
  const [shareDropdownOpen, setShareDropdownOpen] = useState(true);
  const [requestDropdownOpen, setRequestDropdownOpen] = useState(true);
  const [canDrag, setCanDrag] = useState(false);
  const shareInputRef = useRef<HTMLInputElement>(null);
  const requestInputRef = useRef<HTMLInputElement>(null);

  const shareResults = useSearch(shareQuery);
  const requestResults = useSearch(requestQuery);

  const selectedShareIds = new Set(selectedShareUsers.map(u => u.id));
  const selectedRequestIds = new Set(selectedRequestUsers.map(u => u.id));

  const loadConnections = useCallback(() => {
    fetchAllMyConnections().then(setConnections);
  }, []);

  useEffect(() => {
    if (open) loadConnections();
  }, [open, loadConnections]);

  const viewersOfMyLog: ConnectionListItem[] = connections
    .filter(c => c.owner_id === userId && c.status === 'accepted')
    .map(c => ({
      id: c.id,
      name: c.viewer_display_name || c.viewer_email.split('@')[0],
      email: c.viewer_email,
      avatar_url: c.viewer_avatar_url,
      joined: !!c.viewer_id,
    }));

  const iCanView: ConnectionListItem[] = connections
    .filter(c => c.viewer_id === userId && c.status === 'accepted')
    .map(c => ({
      id: c.id,
      name: c.owner_display_name || c.owner_email.split('@')[0],
      email: c.owner_email,
      avatar_url: c.owner_avatar_url,
      joined: !!c.owner_id,
    }));

  const myPendingRequests: ConnectionListItem[] = connections
    .filter(c => c.viewer_id === userId && c.status === 'pending')
    .map(c => ({
      id: c.id,
      name: c.owner_display_name || c.owner_email.split('@')[0],
      email: c.owner_email,
      avatar_url: c.owner_avatar_url,
      joined: !!c.owner_id,
      pending: true,
    }));

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
      await navigator.share({ title: 'My food log', url });
    } catch {}
  };

  const handleShareAll = async () => {
    if (selectedShareUsers.length === 0 || sharingInProgress) return;
    setSharingInProgress(true);
    let successCount = 0;
    let alreadyCount = 0;
    for (const user of selectedShareUsers) {
      if (!user.email) continue;
      const result = await createShareConnection('share', user.email);
      if (result.ok) successCount++;
      else if (result.existing) alreadyCount++;
    }
    setSharingInProgress(false);
    setSelectedShareUsers([]);
    setShareQuery('');
    if (successCount > 0) {
      onToast(`Log shared with ${successCount} ${successCount === 1 ? 'person' : 'people'}`);
      onRefresh();
      loadConnections();
    } else if (alreadyCount > 0) {
      onToast('Already sharing with selected people');
    } else {
      onToast('Failed to share');
    }
  };

  const handleRequestAll = async () => {
    if (selectedRequestUsers.length === 0 || requestingInProgress) return;
    setRequestingInProgress(true);
    let successCount = 0;
    let alreadyCount = 0;
    for (const user of selectedRequestUsers) {
      if (!user.email) continue;
      const result = await createShareConnection('request', user.email);
      if (result.ok) successCount++;
      else if (result.existing) alreadyCount++;
    }
    setRequestingInProgress(false);
    setSelectedRequestUsers([]);
    setRequestQuery('');
    if (successCount > 0) {
      onToast(`${successCount === 1 ? 'Request' : `${successCount} requests`} sent`);
      onRefresh();
      loadConnections();
    } else if (alreadyCount > 0) {
      onToast('Already connected or pending');
    } else {
      onToast('Failed to send requests');
    }
  };

  const handleAccept = async (id: string) => {
    setRespondingTo(id);
    const ok = await updateConnectionStatus(id, 'accept');
    setRespondingTo(null);
    if (ok) {
      onToast('Request accepted');
      onRefresh();
      loadConnections();
    } else {
      onToast('Failed to accept');
    }
  };

  const handleDecline = async (id: string) => {
    setRespondingTo(id);
    const ok = await updateConnectionStatus(id, 'decline');
    setRespondingTo(null);
    if (ok) {
      onToast('Request declined');
      onRefresh();
      loadConnections();
    } else {
      onToast('Failed to decline');
    }
  };

  const handleRemoveConnection = async (id: string, name: string) => {
    if (!window.confirm(`Remove ${name}?`)) return;
    setRemovingId(id);
    const ok = await updateConnectionStatus(id, 'revoke');
    setRemovingId(null);
    if (ok) {
      onToast('Connection removed');
      loadConnections();
      onRefresh();
    } else {
      onToast('Failed to remove');
    }
  };

  const handleClose = () => {
    setShareQuery('');
    setRequestQuery('');
    setSelectedShareUsers([]);
    setSelectedRequestUsers([]);
    setShareExpanded(pendingRequests.length === 0);
    setRequestExpanded(false);
    setCanDrag(false);
    setProfileSetupDismissed(false);
    onClose();
  };

  return (
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
              {/* Pending incoming requests */}
              {pendingRequests.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                      Pending requests
                    </span>
                    <span className="w-[18px] h-[18px] rounded-full bg-destructive flex items-center justify-center leading-none">
                      <span className="text-[9px] font-bold text-white leading-none">{pendingRequests.length}</span>
                    </span>
                  </div>
                  <div className="bg-bg-secondary rounded-xl overflow-hidden">
                    {pendingRequests.map((req, idx) => {
                      const name = req.viewer_display_name || req.viewer_email.split('@')[0];
                      const isResponding = respondingTo === req.id;
                      return (
                        <div key={req.id}>
                          {idx > 0 && <div className="h-px bg-bg-tertiary mx-3.5" />}
                          <div className="p-3.5 flex items-center gap-3">
                            {req.viewer_avatar_url ? (
                              <img src={req.viewer_avatar_url} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center text-accent text-[14px] font-semibold flex-shrink-0">
                                {getInitial(req.viewer_display_name, req.viewer_email)}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="text-[14px] font-medium truncate">{name}</div>
                              <div className="text-[12px] text-text-secondary truncate">
                                wants to see your log
                              </div>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                              <motion.button
                                className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center border-none cursor-pointer disabled:opacity-50"
                                onClick={() => handleAccept(req.id)}
                                disabled={isResponding}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Check size={16} className="text-accent" />
                              </motion.button>
                              <motion.button
                                className="w-9 h-9 rounded-full bg-bg-tertiary flex items-center justify-center border-none cursor-pointer disabled:opacity-50"
                                onClick={() => handleDecline(req.id)}
                                disabled={isResponding}
                                whileTap={{ scale: 0.9 }}
                              >
                                <XIcon size={16} className="text-text-secondary" />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="h-px bg-bg-tertiary mt-3" />
                </div>
              )}

              {/* Share my log */}
              <div className="bg-bg-secondary rounded-xl mb-3 overflow-hidden">
                <button
                  className="w-full flex items-center gap-2 p-3.5 bg-transparent border-none cursor-pointer text-left"
                  onClick={() => setShareExpanded(prev => !prev)}
                >
                  <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <UserPlus size={14} className="text-accent" />
                  </div>
                  <span className="text-[14px] font-medium flex-1">Share log with others</span>
                  <motion.div
                    animate={{ rotate: shareExpanded ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="text-text-tertiary flex-shrink-0"
                  >
                    <ChevronDown size={16} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {shareExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-3.5 pb-3.5">
                        <div className="flex gap-2 items-end">
                          <PillInput
                            selected={selectedShareUsers}
                            onRemove={id => setSelectedShareUsers(prev => prev.filter(u => u.id !== id))}
                            inputRef={shareInputRef}
                            query={shareQuery}
                            onQueryChange={v => { setShareQuery(v); setShareDropdownOpen(true); }}
                            placeholder="Search by name or email"
                          />
                          <motion.button
                            className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center border-none cursor-pointer flex-shrink-0 disabled:opacity-50"
                            onClick={handleShareAll}
                            disabled={selectedShareUsers.length === 0 || sharingInProgress}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Send size={16} className="text-white" />
                          </motion.button>
                        </div>
                        {shareDropdownOpen && (
                          <SearchDropdown
                            results={shareResults}
                            selectedIds={selectedShareIds}
                            mode="share"
                            onSelect={r => {
                              if (r.email && !selectedShareIds.has(r.id)) {
                                setSelectedShareUsers(prev => [...prev, r]);
                                setShareQuery('');
                                setShareDropdownOpen(false);
                                shareInputRef.current?.focus();
                              }
                            }}
                          />
                        )}
                        <ConnectionList title="Shared with" items={viewersOfMyLog} onRemove={handleRemoveConnection} removingId={removingId} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Request sharing -- expandable */}
              <div className="bg-bg-secondary rounded-xl mb-3 overflow-hidden">
                <button
                  className="w-full flex items-center gap-2 p-3.5 bg-transparent border-none cursor-pointer text-left"
                  onClick={() => setRequestExpanded(prev => !prev)}
                >
                  <div className="w-7 h-7 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Eye size={14} className="text-blue-500" />
                  </div>
                  <span className="text-[14px] font-medium flex-1">Request others to share</span>
                  <motion.div
                    animate={{ rotate: requestExpanded ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="text-text-tertiary flex-shrink-0"
                  >
                    <ChevronDown size={16} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {requestExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-3.5 pb-3.5">
                        <div className="flex gap-2 items-end">
                          <PillInput
                            selected={selectedRequestUsers}
                            onRemove={id => setSelectedRequestUsers(prev => prev.filter(u => u.id !== id))}
                            inputRef={requestInputRef}
                            query={requestQuery}
                            onQueryChange={v => { setRequestQuery(v); setRequestDropdownOpen(true); }}
                            placeholder="Search by name or email"
                          />
                          <motion.button
                            className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center border-none cursor-pointer flex-shrink-0 disabled:opacity-50"
                            onClick={handleRequestAll}
                            disabled={selectedRequestUsers.length === 0 || requestingInProgress}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Send size={16} className="text-white" />
                          </motion.button>
                        </div>
                        {requestDropdownOpen && (
                          <SearchDropdown
                            results={requestResults}
                            selectedIds={selectedRequestIds}
                            mode="request"
                            onSelect={r => {
                              if (r.email && !selectedRequestIds.has(r.id)) {
                                setSelectedRequestUsers(prev => [...prev, r]);
                                setRequestQuery('');
                                setRequestDropdownOpen(false);
                                requestInputRef.current?.focus();
                              }
                            }}
                          />
                        )}
                        <ConnectionList title="Shared with you" items={[...iCanView, ...myPendingRequests]} onRemove={handleRemoveConnection} removingId={removingId} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Quick share: copy link + share link */}
              <div className="flex gap-2.5">
                <motion.button
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-bg-secondary rounded-xl border-none cursor-pointer disabled:opacity-50"
                  onClick={handleCopyLink}
                  disabled={copyingLink}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link2 size={16} className="text-text-secondary" />
                  <span className="text-[14px] font-medium text-text-primary">Copy link</span>
                </motion.button>
                <motion.button
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-bg-secondary rounded-xl border-none cursor-pointer disabled:opacity-50"
                  onClick={handleShareLink}
                  disabled={sharingLink}
                  whileTap={{ scale: 0.97 }}
                >
                  <Share2 size={16} className="text-text-secondary" />
                  <span className="text-[14px] font-medium text-text-primary">Share link</span>
                </motion.button>
              </div>
            </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
