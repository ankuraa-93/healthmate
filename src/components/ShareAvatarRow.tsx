'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Share, Check, X } from 'lucide-react';
import { ViewableConnection } from '@/lib/types';
import { updateConnectionStatus } from '@/lib/supabase-data';

interface ShareAvatarRowProps {
  connections: ViewableConnection[];
  selectedId: string | null;
  selfAvatarUrl: string | null;
  selfDisplayName: string | null;
  selfEmail: string | null;
  onSharePress: () => void;
  pendingCount: number;
  selectedDate: Date;
  onSwitcherOpen: () => void;
  isViewingSelf: boolean;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const USER_COLORS = [
  { bg: '#34C75926', text: '#34C759' }, // green (self / default)
  { bg: '#007AFF26', text: '#007AFF' }, // blue
  { bg: '#FF953326', text: '#FF9533' }, // orange
  { bg: '#AF52DE26', text: '#AF52DE' }, // purple
  { bg: '#FF2D5526', text: '#FF2D55' }, // pink
  { bg: '#5AC8FA26', text: '#5AC8FA' }, // teal
  { bg: '#FF375026', text: '#FF3750' }, // red
  { bg: '#FFD60A33', text: '#C79800' }, // yellow
];

function getUserColor(userId: string): { bg: string; text: string } {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = ((hash << 5) - hash + userId.charCodeAt(i)) | 0;
  }
  return USER_COLORS[Math.abs(hash) % (USER_COLORS.length - 1) + 1];
}

function getInitial(name?: string | null, email?: string | null): string {
  if (name) return name.trim()[0].toUpperCase();
  if (email) return email[0].toUpperCase();
  return '?';
}

function getFirstName(name?: string | null, email?: string | null): string {
  if (name) return name.split(' ')[0];
  if (email) return email.split('@')[0];
  return '?';
}

export function Avatar({ url, name, email, size = 28, className = '', color }: {
  url: string | null;
  name: string | null;
  email: string | null;
  size?: number;
  className?: string;
  color?: { bg: string; text: string };
}) {
  return url ? (
    <img
      src={url}
      alt=""
      className={`rounded-full object-cover ${className}`}
      style={{ width: size, height: size }}
    />
  ) : (
    <div
      className={`rounded-full flex items-center justify-center font-semibold leading-none ${color ? '' : 'bg-bg-tertiary text-text-secondary'} ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.43, paddingBottom: 1, ...(color ? { backgroundColor: color.bg, color: color.text } : {}) }}
    >
      {getInitial(name, email)}
    </div>
  );
}

export default function ShareAvatarRow({
  connections,
  selectedId,
  selfAvatarUrl,
  selfDisplayName,
  selfEmail,
  onSharePress,
  pendingCount,
  selectedDate,
  onSwitcherOpen,
  isViewingSelf,
}: ShareAvatarRowProps) {
  const hasConnections = connections.length > 0;

  const currentConnection = selectedId
    ? connections.find(c => c.owner_id === selectedId)
    : null;

  const currentName = selectedId
    ? getFirstName(currentConnection?.owner_display_name ?? null, currentConnection?.owner_email ?? null)
    : (selfDisplayName ? getFirstName(selfDisplayName) : 'You');
  const currentAvatar = selectedId ? (currentConnection?.owner_avatar_url ?? null) : selfAvatarUrl;
  const currentDisplayName = selectedId ? (currentConnection?.owner_display_name ?? null) : selfDisplayName;
  const currentEmail = selectedId ? (currentConnection?.owner_email ?? null) : selfEmail;

  const monthYear = `${MONTHS[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;

  return (
    <div className="flex items-center px-4 mb-1 mt-1 h-9">
      {/* Left */}
      <div className="flex-1 flex justify-start">
        <span className="text-[13px] font-medium text-text-secondary leading-none">
          {monthYear}
        </span>
      </div>

      {/* Center: User switcher */}
      <div className="flex-shrink-0">
        {hasConnections ? (
          <motion.button
            className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer p-0"
            onClick={onSwitcherOpen}
            whileTap={{ scale: 0.97 }}
          >
            <Avatar url={currentAvatar} name={currentDisplayName} email={currentEmail} size={22} />
            <span className="text-[14px] font-semibold text-text-primary leading-none">
              {selectedId === null ? 'You' : currentName}
            </span>
            <ChevronDown size={15} className="text-text-tertiary" />
          </motion.button>
        ) : (
          <div className="flex items-center gap-1.5 p-0">
            <Avatar url={selfAvatarUrl} name={selfDisplayName} email={selfEmail} size={22} />
            <span className="text-[14px] font-semibold text-text-primary leading-none">
              {selfDisplayName ? getFirstName(selfDisplayName) : 'You'}
            </span>
          </div>
        )}
      </div>

      {/* Right */}
      <div className="flex-1 flex justify-end">
        {isViewingSelf && (
          <motion.button
            className="flex items-center gap-1.5 bg-accent/10 border border-accent/30 rounded-xl px-3 py-1.5 cursor-pointer relative"
            onClick={onSharePress}
            whileTap={{ scale: 0.95 }}
          >
            <Share size={13} className="text-accent" />
            <span className="text-[13px] font-medium text-accent">Share</span>
            {pendingCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-destructive border-[1.5px] border-bg-primary" />
            )}
          </motion.button>
        )}
      </div>
    </div>
  );
}

/* Bottom sheet for switching between users — render at page top level */
export function UserSwitcherSheet({
  open,
  onClose,
  connections,
  selectedId,
  onSelect,
  selfAvatarUrl,
  selfDisplayName,
  selfEmail,
  onRemoved,
  onToast,
}: {
  open: boolean;
  onClose: () => void;
  connections: ViewableConnection[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  selfAvatarUrl: string | null;
  selfDisplayName: string | null;
  selfEmail: string | null;
  onRemoved: () => void;
  onToast: (msg: string) => void;
}) {
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleRemove = async (e: React.MouseEvent, conn: ViewableConnection) => {
    e.stopPropagation();
    const name = conn.owner_display_name || conn.owner_email.split('@')[0];
    if (!window.confirm(`Remove ${name}?`)) return;
    setRemovingId(conn.id);
    const ok = await updateConnectionStatus(conn.id, 'revoke');
    setRemovingId(null);
    if (ok) {
      if (selectedId === conn.owner_id) onSelect(null);
      onToast('Connection removed');
      onRemoved();
    } else {
      onToast('Failed to remove');
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="absolute inset-0 bg-black/40 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="absolute bottom-0 left-0 right-0 z-50"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            <div className="bg-bg-primary rounded-t-2xl pb-[max(env(safe-area-inset-bottom),16px)]">
              {/* Handle */}
              <div className="flex justify-center pt-2.5 pb-3">
                <div className="w-9 h-1 rounded-full bg-bg-tertiary" />
              </div>

              <div className="px-4 pb-2">
                {/* Self */}
                <motion.button
                  className="flex items-center gap-3 w-full px-3.5 py-3 rounded-xl border-none cursor-pointer mb-1"
                  style={{ backgroundColor: selectedId === null ? 'var(--color-bg-secondary)' : 'transparent' }}
                  onClick={() => { onSelect(null); onClose(); }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Avatar url={selfAvatarUrl} name={selfDisplayName} email={selfEmail} size={40} color={USER_COLORS[0]} />
                  <div className="flex-1 min-w-0 text-left">
                    <div className="text-[15px] font-medium text-text-primary truncate">You</div>
                    {selfEmail && (
                      <div className="text-[12px] text-text-tertiary truncate">{selfEmail}</div>
                    )}
                  </div>
                  {selectedId === null && (
                    <Check size={18} className="text-accent flex-shrink-0" />
                  )}
                </motion.button>

                {/* Connections */}
                {connections.map(conn => (
                  <div
                    key={conn.id}
                    className="flex items-center gap-3 px-3.5 py-3 rounded-xl mb-1 cursor-pointer"
                    style={{ backgroundColor: selectedId === conn.owner_id ? 'var(--color-bg-secondary)' : 'transparent' }}
                    onClick={() => { onSelect(conn.owner_id); onClose(); }}
                  >
                    <Avatar url={conn.owner_avatar_url} name={conn.owner_display_name} email={conn.owner_email} size={40} color={getUserColor(conn.owner_id)} />
                    <div className="flex-1 min-w-0 text-left">
                      <div className="text-[15px] font-medium text-text-primary truncate">
                        {conn.owner_display_name || conn.owner_email.split('@')[0]}
                      </div>
                      <div className="text-[12px] text-text-tertiary truncate">
                        {conn.owner_email}
                      </div>
                    </div>
                    {selectedId === conn.owner_id && (
                      <Check size={18} className="text-accent flex-shrink-0" />
                    )}
                    <motion.button
                      className="w-7 h-7 rounded-full bg-bg-tertiary flex items-center justify-center border-none cursor-pointer flex-shrink-0 disabled:opacity-50"
                      onClick={(e) => handleRemove(e, conn)}
                      disabled={removingId === conn.id}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X size={13} className="text-text-secondary" />
                    </motion.button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
