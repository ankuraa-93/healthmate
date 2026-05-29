'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, ArrowUp, X, Check, ChevronRight, Trash2, Loader2 } from 'lucide-react';
import { insertFoodLog, deleteFoodLog, updateFoodLog } from '@/lib/supabase-data';

// --- Types ---

interface TrayItem {
  id: string;
  name: string;
  matched_library_id: string | null;
  matched_library_name: string | null;
  quantity_g: number;
  unit: 'g' | 'ml';
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  fibre_per_100g: number;
}

interface AddFoodSheetProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  logDate: string;
  onToast?: (message: string) => void;
}

// --- Helpers ---

function scaleNutrition(item: TrayItem) {
  const ratio = item.quantity_g / 100;
  return {
    calories: Math.round(item.calories_per_100g * ratio),
    protein: Math.round(item.protein_per_100g * ratio),
    carbs: Math.round(item.carbs_per_100g * ratio),
    fat: Math.round(item.fat_per_100g * ratio),
    fibre: Math.round(item.fibre_per_100g * ratio),
  };
}

function getAudioMimeType(): string {
  if (typeof MediaRecorder === 'undefined') return '';
  const types = ['audio/webm', 'audio/mp4', 'audio/ogg'];
  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) return type;
  }
  return '';
}

// --- Component ---

function AddFoodSheetInner({ onClose, userId, logDate, onToast }: Omit<AddFoodSheetProps, 'open'>) {
  const [input, setInput] = useState('');
  const [trayItems, setTrayItems] = useState<TrayItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const micStreamRef = useRef<MediaStream | null>(null);

  const hasContent = input.trim().length > 0;
  const micSupported = typeof window !== 'undefined' && typeof MediaRecorder !== 'undefined' && getAudioMimeType() !== '';

  // --- DB operations ---

  const logItemToDb = async (item: Omit<TrayItem, 'id'>): Promise<TrayItem | null> => {
    const ratio = item.quantity_g / 100;
    const entry = await insertFoodLog({
      user_id: userId,
      food_library_id: item.matched_library_id,
      food_name: item.matched_library_name || item.name,
      quantity_g: item.quantity_g,
      calories: Math.round(item.calories_per_100g * ratio),
      protein: Math.round(item.protein_per_100g * ratio),
      carbs: Math.round(item.carbs_per_100g * ratio),
      fat: Math.round(item.fat_per_100g * ratio),
      fibre: Math.round(item.fibre_per_100g * ratio),
      meal_type: item.meal_type,
      logged_date: logDate,
      status: 'confirmed',
      unit: item.unit,
    });
    if (!entry) return null;
    return { ...item, id: entry.id };
  };

  // --- Text submit ---

  const handleTextSubmit = async () => {
    if (!hasContent || loading) return;
    const text = input.trim();
    setInput('');
    setLoading(true);

    try {
      const parseRes = await fetch('/api/parse-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, currentHour: new Date().getHours() }),
      });
      if (!parseRes.ok) throw new Error((await parseRes.json().catch(() => ({}))).error || 'Parse failed');
      const parsed = await parseRes.json();

      const matchRes = await fetch('/api/match-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: parsed.items }),
      });
      if (!matchRes.ok) throw new Error((await matchRes.json().catch(() => ({}))).error || 'Match failed');
      const matched = await matchRes.json();

      const results = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        matched.items.map((item: any) => logItemToDb(item))
      );
      const newItems = results.filter(Boolean) as TrayItem[];
      setTrayItems(prev => [...prev, ...newItems]);
    } catch (error) {
      console.error('Text parse error:', error);
      onToast?.('Failed to parse food — try again');
    } finally {
      setLoading(false);
    }
  };

  // --- Voice recording (MediaRecorder → Gemini audio) ---

  const startRecording = async () => {
    if (mediaRecorderRef.current?.state === 'recording') return;
    try {
      let stream = micStreamRef.current;
      if (!stream || !stream.active) {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        });
        micStreamRef.current = stream;
      }
      const mimeType = getAudioMimeType();
      const recorder = new MediaRecorder(stream, {
        ...(mimeType ? { mimeType } : {}),
        audioBitsPerSecond: 128000,
      });
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: mimeType || 'audio/webm' });
        await processAudio(blob);
      };

      recorder.start(250);
      mediaRecorderRef.current = recorder;
      setRecording(true);
    } catch (err) {
      console.error('Mic error:', err);
      onToast?.('Microphone access denied');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      setLoading(true);
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
  };

  const processAudio = async (blob: Blob) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('audio', blob);

      const res = await fetch('/api/parse-food-audio', { method: 'POST', body: formData });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Transcription failed');
      const { transcript } = await res.json();

      if (!transcript) {
        onToast?.('Could not recognize speech — try again');
        return;
      }

      setInput(transcript);
      setLoading(false);
    } catch (error) {
      console.error('Transcription error:', error);
      const msg = error instanceof Error ? error.message : 'Voice input failed';
      onToast?.(msg);
      setLoading(false);
    }
  };

  const toggleRecording = () => {
    recording ? stopRecording() : startRecording();
  };

  // --- Tray editing ---

  const handleUpdateQuantity = async (index: number, newQty: number) => {
    const qty = Math.max(1, newQty);
    const item = trayItems[index];
    setTrayItems(prev => prev.map((it, i) => i === index ? { ...it, quantity_g: qty } : it));

    const ratio = qty / 100;
    await updateFoodLog(item.id, {
      quantity_g: qty,
      calories: Math.round(item.calories_per_100g * ratio),
      protein: Math.round(item.protein_per_100g * ratio),
      carbs: Math.round(item.carbs_per_100g * ratio),
      fat: Math.round(item.fat_per_100g * ratio),
      fibre: Math.round(item.fibre_per_100g * ratio),
    });
  };

  const handleRemoveItem = async (index: number) => {
    const item = trayItems[index];
    setTrayItems(prev => prev.filter((_, i) => i !== index));
    setExpandedIndex(null);
    await deleteFoodLog(item.id);
  };

  const handleToggleExpand = (index: number) => {
    setExpandedIndex(prev => prev === index ? null : index);
  };

  useEffect(() => {
    if (micSupported) {
      navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      }).then(stream => {
        micStreamRef.current = stream;
      }).catch(() => {});
    }
    return () => {
      if (mediaRecorderRef.current?.state !== 'inactive') {
        mediaRecorderRef.current?.stop();
      }
      micStreamRef.current?.getTracks().forEach(t => t.stop());
      micStreamRef.current = null;
    };
  }, [micSupported]);

  return (
    <>
      <motion.div
        className="absolute inset-0 bg-black/30 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-bg-primary rounded-t-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] flex flex-col max-h-[92vh] z-30"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      >
        {/* Handle */}
        <div className="w-9 h-1 bg-bg-tertiary rounded-full mx-auto mt-2.5 flex-shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-4 flex-shrink-0">
          <span className="text-[22px] font-medium">Log Food</span>
          <div className="flex items-center gap-2">
            {trayItems.length > 0 ? (
              <motion.button
                className="h-8 px-4 rounded-full bg-accent border-none text-[14px] font-medium text-white cursor-pointer flex items-center gap-1.5"
                onClick={onClose}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Check size={16} />
                Done
              </motion.button>
            ) : (
              <motion.button
                className="w-8 h-8 rounded-full bg-bg-secondary border-none flex items-center justify-center text-text-secondary cursor-pointer"
                onClick={onClose}
                whileTap={{ scale: 0.9 }}
              >
                <X size={18} />
              </motion.button>
            )}
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 pt-4 scrollbar-none">

          {/* ── Logged foods tray ── */}
          <AnimatePresence>
            {trayItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5"
              >
                <div className="text-[13px] font-medium text-text-secondary uppercase tracking-wide mb-3">
                  Logged foods
                </div>

                {(() => {
                  const mealOrder = ['breakfast', 'lunch', 'snack', 'dinner'] as const;
                  const mealLabels: Record<string, string> = { breakfast: 'Breakfast', lunch: 'Lunch', snack: 'Snack', dinner: 'Dinner' };
                  const grouped = mealOrder
                    .map(type => ({
                      type,
                      label: mealLabels[type],
                      entries: trayItems.map((item, idx) => ({ item, idx })).filter(({ item }) => item.meal_type === type),
                    }))
                    .filter(g => g.entries.length > 0);

                  return grouped.map(group => (
                    <div key={group.type} className="mb-2.5">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[12px] font-medium text-text-tertiary uppercase tracking-wide">{group.label}</span>
                        <div className="flex-1 h-px bg-bg-tertiary" />
                      </div>
                      <div className="flex flex-col gap-2">
                        {group.entries.map(({ item, idx }, cardIndex) => {
                          const nutrition = scaleNutrition(item);
                          const isExpanded = expandedIndex === idx;
                          const unitLabel = item.unit === 'ml' ? 'ml' : 'g';

                          return (
                            <motion.div
                              key={item.id}
                              className="bg-bg-secondary rounded-xl p-3 cursor-pointer"
                              initial={{ opacity: 0, y: 12 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, x: -20, scale: 0.95 }}
                              transition={{ delay: cardIndex * 0.06 }}
                              onClick={() => handleToggleExpand(idx)}
                              layout
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-[10px] bg-bg-tertiary flex items-center justify-center text-sm font-medium flex-shrink-0">
                                  {(item.matched_library_name || item.name).slice(0, 1).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-[15px] font-medium leading-snug">{item.matched_library_name || item.name}</div>
                                  <div className="text-[12px] text-text-secondary mt-0.5">
                                    {item.quantity_g}{unitLabel} · P:{nutrition.protein} C:{nutrition.carbs} F:{nutrition.fat} Fi:{nutrition.fibre}
                                  </div>
                                </div>
                                <div className="flex-shrink-0 text-right">
                                  <div className="text-[16px] font-semibold">{nutrition.calories}</div>
                                  <div className="text-[11px] text-text-secondary">cal</div>
                                </div>
                                <motion.div
                                  className="flex-shrink-0 text-text-tertiary"
                                  animate={{ rotate: isExpanded ? 90 : 0 }}
                                  transition={{ duration: 0.25 }}
                                >
                                  <ChevronRight size={14} />
                                </motion.div>
                              </div>

                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className="overflow-hidden"
                                    onClick={e => e.stopPropagation()}
                                  >
                                    <div className="mt-3 pt-2.5 border-t border-bg-tertiary/50">
                                      <div className="flex items-center gap-2 mb-2.5">
                                        <div className="flex-1 flex items-center bg-bg-primary rounded-xl px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-accent/25 transition-shadow">
                                          <input
                                            type="text"
                                            inputMode="numeric"
                                            className="flex-1 bg-transparent border-none text-[17px] font-medium text-right outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            value={item.quantity_g}
                                            onChange={e => handleUpdateQuantity(idx, parseInt(e.target.value) || 0)}
                                            onClick={e => e.stopPropagation()}
                                          />
                                          <span className="text-[15px] text-text-secondary ml-1.5">{unitLabel}</span>
                                        </div>
                                        <motion.button
                                          className="w-11 h-11 rounded-xl bg-bg-primary border-none flex items-center justify-center text-text-tertiary cursor-pointer flex-shrink-0 hover:text-destructive hover:bg-destructive/10 transition-colors"
                                          onClick={e => { e.stopPropagation(); handleRemoveItem(idx); }}
                                          whileTap={{ scale: 0.9 }}
                                        >
                                          <Trash2 size={18} />
                                        </motion.button>
                                      </div>
                                      <div className="flex gap-2">
                                        {[-50, -10, 10, 50].map(delta => (
                                          <motion.button
                                            key={delta}
                                            className="flex-1 py-1.5 bg-bg-primary border-none rounded-full text-[13px] font-medium text-text-secondary cursor-pointer hover:bg-bg-tertiary transition-colors"
                                            onClick={e => { e.stopPropagation(); handleUpdateQuantity(idx, item.quantity_g + delta); }}
                                            whileTap={{ scale: 0.95 }}
                                          >
                                            {delta > 0 ? '+' : '−'}{Math.abs(delta)}{unitLabel}
                                          </motion.button>
                                        ))}
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  ));
                })()}

                <div className="flex justify-between items-center py-2.5 mt-1 border-t border-bg-tertiary/50">
                  <span className="text-[13px] font-medium text-text-secondary">Total</span>
                  <div>
                    <span className="text-[16px] font-semibold">
                      {trayItems.reduce((sum, item) => sum + scaleNutrition(item).calories, 0)}
                    </span>
                    <span className="text-[13px] text-text-secondary ml-1">cal</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Waveform (recording) */}
          {recording && (
            <motion.div
              className="flex flex-col items-center py-5 mb-5"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="flex items-center justify-center gap-[3px] h-12 mb-2.5">
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-[3px] bg-destructive rounded-sm"
                    animate={{ height: [10, 30, 10] }}
                    transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse', delay: i * 0.05 }}
                  />
                ))}
              </div>
              <span className="text-[13px] text-text-secondary">Listening... tap stop when done</span>
            </motion.div>
          )}
        </div>

        {/* ── Fixed bottom input bar ── */}
        <div className="flex-shrink-0 p-4 pb-[max(12px,env(safe-area-inset-bottom))] border-t border-bg-tertiary/50 bg-bg-primary">
          <div className="bg-bg-secondary rounded-[20px] px-4 pt-3 pb-2.5 focus-within:ring-2 focus-within:ring-accent/25 transition-shadow">
            {loading ? (
              <div className="flex items-center gap-2.5 min-h-[56px]">
                <Loader2 size={18} className="text-accent animate-spin flex-shrink-0" />
                <span className="text-[15px] text-text-secondary">Identifying food...</span>
              </div>
            ) : (
              <textarea
                ref={textareaRef}
                className="w-full bg-transparent border-none resize-none text-base text-text-primary outline-none leading-relaxed placeholder:text-text-tertiary"
                rows={2}
                placeholder={recording ? 'Listening...' : 'I just had omelette with toast'}
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={recording}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleTextSubmit();
                  }
                }}
              />
            )}
            <div className="flex items-center justify-between mt-2">
              {micSupported ? (
                <motion.button
                  className={`w-9 h-9 rounded-full border-none flex items-center justify-center cursor-pointer flex-shrink-0 transition-colors ${
                    recording ? 'bg-destructive text-white' : 'bg-bg-tertiary text-text-secondary'
                  }`}
                  onClick={toggleRecording}
                  disabled={loading}
                  whileTap={{ scale: 0.9 }}
                  animate={recording ? { scale: [1, 1.1, 1] } : {}}
                  transition={recording ? { duration: 1, repeat: Infinity } : {}}
                >
                  {recording ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="4" y="4" width="16" height="16" rx="2" />
                    </svg>
                  ) : (
                    <Mic size={18} />
                  )}
                </motion.button>
              ) : <div />}
              <motion.button
                className="w-9 h-9 rounded-full bg-accent border-none flex items-center justify-center text-white cursor-pointer flex-shrink-0 disabled:opacity-35 disabled:cursor-default"
                disabled={!hasContent || recording || loading}
                onClick={handleTextSubmit}
                whileTap={hasContent ? { scale: 0.85 } : {}}
              >
                <ArrowUp size={18} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default function AddFoodSheet({ open, ...props }: AddFoodSheetProps) {
  return (
    <AnimatePresence>
      {open && <AddFoodSheetInner key="add-food" {...props} />}
    </AnimatePresence>
  );
}
