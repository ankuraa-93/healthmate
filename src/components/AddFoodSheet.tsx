'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, ArrowUp, X, Check, ChevronDown, Loader2, Camera, ArrowDown } from 'lucide-react';
import { insertFoodLog, deleteFoodLog, updateFoodLog } from '@/lib/supabase-data';
import { processImage } from '@/lib/image-utils';
import { getQuantityWarning, scaleNutritionFromEntry } from '@/lib/nutrition';
import { FoodLogEntry } from '@/lib/types';
import PhotoReviewSheet, { ReviewPhoto } from './PhotoReviewSheet';

// Target passed when the sheet opens in "replace" mode (swap a wrongly-identified food).
export interface ReplaceTarget {
  entry: FoodLogEntry;
  imageUrl: string | null;
}

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
  image_url?: string | null;
}

interface AddFoodSheetProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  logDate: string;
  onToast?: (message: string) => void;
  onPhotosSubmitted?: (photos: ReviewPhoto[]) => void;
  replaceTarget?: ReplaceTarget | null;
  onReplaced?: (updated: FoodLogEntry) => void;
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

function FoodThumbnail({ imageUrl, name }: { imageUrl?: string | null; name: string }) {
  const [failed, setFailed] = useState(false);
  if (imageUrl && !failed) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className="w-11 h-11 rounded-[10px] flex-shrink-0 object-cover"
        onError={() => setFailed(true)}
      />
    );
  }
  return (
    <div className="w-11 h-11 rounded-[10px] bg-bg-tertiary flex items-center justify-center text-lg flex-shrink-0">
      {name.slice(0, 1).toUpperCase()}
    </div>
  );
}

// --- Component ---

function getDefaultMealType(): 'breakfast' | 'lunch' | 'dinner' | 'snack' {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return 'breakfast';
  if (hour >= 11 && hour < 15) return 'lunch';
  if (hour >= 15 && hour < 18) return 'snack';
  if (hour >= 18 && hour < 24) return 'dinner';
  return 'snack';
}

function AddFoodSheetInner({ onClose, userId, logDate, onToast, onPhotosSubmitted, replaceTarget, onReplaced }: Omit<AddFoodSheetProps, 'open'>) {
  const isReplace = !!replaceTarget;
  const [input, setInput] = useState('');
  const [trayItems, setTrayItems] = useState<TrayItem[]>([]);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  // Raw text for the quantity field of the currently-expanded tray item, so it can
  // be cleared while editing ('') instead of snapping back to a digit. null = not editing.
  const [qtyDraft, setQtyDraft] = useState<string | null>(null);
  const [savingIndices, setSavingIndices] = useState<Set<number>>(new Set());
  const [reviewPhotos, setReviewPhotos] = useState<ReviewPhoto[]>([]);
  const [showPhotoReview, setShowPhotoReview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = textareaRef.current;
    if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; }
  }, [input]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const micStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  // Gate drag-to-dismiss: enabled from the handle, or from the body only when
  // scrolled to top; disabled over the input bar so typing/mic/camera never drag.
  const [canDrag, setCanDrag] = useState(true);
  // Meal override for this entry. null = let Gemini auto-detect per food.
  const [selectedMeal, setSelectedMeal] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack' | null>(null);
  // Replace-mode success: holds the old + new entries once swapped.
  const [replaced, setReplaced] = useState<{ old: FoodLogEntry; entry: FoodLogEntry } | null>(null);
  const [replacedExpanded, setReplacedExpanded] = useState(false);
  // Raw text for the replaced food's quantity field — clearable ('') while editing. null = not editing.
  const [replacedQtyDraft, setReplacedQtyDraft] = useState<string | null>(null);
  const [replacedSaving, setReplacedSaving] = useState(false);

  const hasContent = input.trim().length > 0;
  const micSupported = typeof window !== 'undefined' && typeof MediaRecorder !== 'undefined' && getAudioMimeType() !== '';

  // --- DB operations ---

  const logItemToDb = async (item: Omit<TrayItem, 'id'>): Promise<TrayItem | null> => {
    // Guard against a missing/invalid quantity (e.g. matcher dropped quantity_g):
    // quantity_g is NOT NULL, so a null/NaN here would 23502-fail the insert and
    // the item would be silently lost. Fall back to a 100g/ml serving.
    const safeQty = Number.isFinite(item.quantity_g) && item.quantity_g > 0 ? item.quantity_g : 100;
    const ratio = safeQty / 100;
    const entry = await insertFoodLog({
      user_id: userId,
      food_library_id: item.matched_library_id,
      food_name: item.matched_library_name || item.name,
      quantity_g: safeQty,
      calories: Math.round(item.calories_per_100g * ratio),
      protein: Math.round(item.protein_per_100g * ratio),
      carbs: Math.round(item.carbs_per_100g * ratio),
      fat: Math.round(item.fat_per_100g * ratio),
      fibre: Math.round(item.fibre_per_100g * ratio),
      meal_type: selectedMeal ?? item.meal_type,
      logged_date: logDate,
      status: 'confirmed',
      unit: item.unit,
      input_source: 'text',
      source_image_url: null,
    });
    if (!entry) return null;
    return { ...item, quantity_g: safeQty, meal_type: selectedMeal ?? item.meal_type, id: entry.id };
  };

  // --- Text submit ---

  const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

  // Replace mode: parse the user's correction, match it, then update the existing
  // entry in place — keeping its id, meal_type, source_image_url and quantity.
  const handleReplaceSubmit = async () => {
    if (!hasContent || loadingMessage || !replaceTarget) return;
    const text = input.trim();
    setInput('');
    setLoadingMessage('Identifying food...');

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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const item = matched.items?.[0] as any;
      if (!item) throw new Error('Could not identify a food');

      setLoadingMessage('Replacing...');
      const target = replaceTarget.entry;
      const qty = target.quantity_g; // keep the original portion — only the identity was wrong
      const ratio = qty / 100;
      const updated = await updateFoodLog(target.id, {
        food_library_id: item.matched_library_id ?? null,
        food_name: item.matched_library_name || item.name,
        quantity_g: qty,
        calories: Math.round(item.calories_per_100g * ratio),
        protein: Math.round(item.protein_per_100g * ratio),
        carbs: Math.round(item.carbs_per_100g * ratio),
        fat: Math.round(item.fat_per_100g * ratio),
        fibre: Math.round(item.fibre_per_100g * ratio),
        unit: (item.unit === 'ml' ? 'ml' : 'g'),
      });
      if (!updated) throw new Error('Replace failed');

      const merged = { ...updated, image_url: item.image_url ?? null };
      onReplaced?.(merged);
      await delay(300);
      setReplaced({ old: target, entry: merged });
    } catch (error) {
      console.error('Replace error:', error);
      setInput(text); // restore the user's text so they don't have to retype
      onToast?.('Failed to replace food — try again');
    } finally {
      setLoadingMessage(null);
    }
  };

  // Edit quantity from the replace-success card. Optimistic, and flips the tick
  // to a spinner and back (like the Log Food tray) while the save is in flight.
  const updateReplacedQty = async (newQty: number) => {
    if (!replaced) return;
    const entry = replaced.entry;
    const qty = Math.min(Math.max(newQty, 1), 9999);
    const nutrition = scaleNutritionFromEntry(qty, entry);
    setReplaced(r => (r ? { ...r, entry: { ...r.entry, quantity_g: qty, ...nutrition } } : r));
    setReplacedSaving(true);
    const updated = await updateFoodLog(entry.id, { quantity_g: qty, ...nutrition });
    if (updated) onReplaced?.({ ...updated, image_url: entry.image_url ?? null });
    await delay(300);
    setReplacedSaving(false);
  };

  const handleReplacedQtyChange = (raw: string) => {
    setReplacedQtyDraft(raw);
    if (raw === '') return; // allow an empty field while editing; don't persist a 0
    const num = parseInt(raw, 10);
    if (!isNaN(num)) updateReplacedQty(num);
  };

  const handleTextSubmit = async () => {
    if (isReplace) { handleReplaceSubmit(); return; }
    if (!hasContent || loadingMessage) return;
    const text = input.trim();
    setInput('');
    setLoadingMessage('Identifying food...');

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

      const itemCount = matched.items.length;
      setLoadingMessage(`Logging ${itemCount} food${itemCount === 1 ? '' : 's'}...`);

      const results = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        matched.items.map((item: any) => logItemToDb(item))
      );
      const newItems = results.filter(Boolean) as TrayItem[];
      await delay(400);
      setTrayItems(prev => [...prev, ...newItems]);
      // Never let a failed insert vanish silently — tell the user what dropped.
      const failedCount = results.length - newItems.length;
      if (failedCount > 0) {
        onToast?.(`Logged ${newItems.length} of ${results.length} — ${failedCount} couldn't be saved, try again`);
      }
    } catch (error) {
      console.error('Text parse error:', error);
      setInput(text); // restore the user's text so they don't have to retype
      onToast?.('Failed to parse food — try again');
    } finally {
      setLoadingMessage(null);
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
      setLoadingMessage('Transcribing...');
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
  };

  const processAudio = async (blob: Blob) => {
    setLoadingMessage('Transcribing...');
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
      setLoadingMessage(null);
    } catch (error) {
      console.error('Transcription error:', error);
      const msg = error instanceof Error ? error.message : 'Voice input failed';
      onToast?.(msg);
      setLoadingMessage(null);
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
    setSavingIndices(prev => new Set(prev).add(index));

    const ratio = qty / 100;
    await updateFoodLog(item.id, {
      quantity_g: qty,
      calories: Math.round(item.calories_per_100g * ratio),
      protein: Math.round(item.protein_per_100g * ratio),
      carbs: Math.round(item.carbs_per_100g * ratio),
      fat: Math.round(item.fat_per_100g * ratio),
      fibre: Math.round(item.fibre_per_100g * ratio),
    });
    await delay(300);
    setSavingIndices(prev => { const next = new Set(prev); next.delete(index); return next; });
  };

  const handleRemoveItem = async (index: number) => {
    const item = trayItems[index];
    setTrayItems(prev => prev.filter((_, i) => i !== index));
    setExpandedIndex(null);
    await deleteFoodLog(item.id);
  };

  const handleToggleExpand = (index: number) => {
    setQtyDraft(null); // reset the quantity buffer when switching/closing items
    setExpandedIndex(prev => prev === index ? null : index);
  };

  const handleQtyDraftChange = (index: number, raw: string) => {
    setQtyDraft(raw);
    if (raw === '') return; // allow an empty field while editing; don't persist a 0
    const num = parseInt(raw, 10);
    if (!isNaN(num)) handleUpdateQuantity(index, num);
  };

  // --- Photo handling ---

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const defaultMeal = selectedMeal ?? getDefaultMealType();
    const newPhotos: ReviewPhoto[] = [];

    for (const file of Array.from(files)) {
      try {
        const processed = await processImage(file);
        newPhotos.push({ processedImage: processed, mealType: defaultMeal, rotation: 0 });
      } catch (err) {
        console.error('Image processing error:', err);
        onToast?.('Failed to process image');
      }
    }

    if (newPhotos.length > 0) {
      setReviewPhotos(prev => [...prev, ...newPhotos]);
      setShowPhotoReview(true);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePhotoSubmit = (photos: ReviewPhoto[]) => {
    setShowPhotoReview(false);
    setReviewPhotos([]);
    onPhotosSubmitted?.(photos);
    onClose();
  };

  const handlePhotoReviewClose = () => {
    reviewPhotos.forEach(p => URL.revokeObjectURL(p.processedImage.thumbnailUrl));
    setShowPhotoReview(false);
    setReviewPhotos([]);
  };

  const handleAddMorePhotos = () => {
    fileInputRef.current?.click();
  };

  // Pre-warm the mic on open: getUserMedia has high cold-start latency, so without
  // this the first word is clipped when a user taps voice and speaks immediately.
  // Trade-off: iOS briefly shows the "mic in use" indicator on sheet open.
  useEffect(() => {
    if (micSupported) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => { stream.getTracks().forEach(t => t.stop()); })
        .catch(() => {});
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
          if (info.offset.y > 120 || info.velocity.y > 600) onClose();
        }}
      >
        {/* Handle — always drag-dismissable */}
        <div
          className="pt-2.5 pb-1 flex-shrink-0 cursor-grab active:cursor-grabbing"
          onPointerDown={() => setCanDrag(true)}
        >
          <div className="w-9 h-1 bg-bg-tertiary rounded-full mx-auto" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-4 flex-shrink-0">
          <span className="text-[22px] font-medium">{isReplace ? 'Replace Food' : 'Log Food'}</span>
          <div className="flex items-center gap-2">
            {trayItems.length > 0 ? (
              <motion.button
                className="border-none bg-transparent text-[17px] font-medium text-accent cursor-pointer p-0"
                onClick={onClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileTap={{ scale: 0.95 }}
              >
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

        {replaced ? (
          /* ── Replace success: show new dish as an editable card ── */
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto px-6 pt-4 scrollbar-none">
              {/* Old food — struck through, cross icon, not editable */}
              {(() => {
                const o = replaced.old;
                const unitLabel = o.unit === 'ml' ? 'ml' : 'g';
                return (
                  <div className="rounded-xl overflow-hidden opacity-75" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                    <div className="p-3 px-3.5">
                      <div className="flex items-center gap-3">
                        <FoodThumbnail imageUrl={o.image_url} name={o.food_name} />
                        <div className="flex-1 min-w-0">
                          <div className="text-[14px] font-medium leading-snug flex items-center gap-1.5 text-text-tertiary">
                            <span className="line-through">{o.food_name}</span>
                            <X size={14} className="flex-shrink-0" />
                          </div>
                          <div className="flex items-baseline justify-between gap-2 mt-px text-[13px] text-text-tertiary">
                            <span className="whitespace-nowrap">{o.quantity_g}{unitLabel} &middot; {o.calories} cal</span>
                            <span className="whitespace-nowrap">P:{o.protein} C:{o.carbs} F:{o.fat} Fi:{o.fibre}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="flex justify-center py-1.5 text-text-tertiary">
                <ArrowDown size={16} />
              </div>

              {/* New food — editable card with tick/spinner */}
              {(() => {
                const e = replaced.entry;
                const unitLabel = e.unit === 'ml' ? 'ml' : 'g';
                return (
                  <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                    <div className="p-3 px-3.5 cursor-pointer" onClick={() => { setReplacedQtyDraft(null); setReplacedExpanded(v => !v); }}>
                      <div className="flex items-center gap-3">
                        <FoodThumbnail imageUrl={e.image_url} name={e.food_name} />
                        <div className="flex-1 min-w-0">
                          <div className="text-[14px] font-medium leading-snug flex items-center gap-1.5">
                            {e.food_name}
                            {replacedSaving ? (
                              <Loader2 size={14} className="text-accent animate-spin flex-shrink-0" />
                            ) : (
                              <Check size={14} className="text-accent flex-shrink-0" />
                            )}
                          </div>
                          <div className="flex items-baseline justify-between gap-2 mt-px text-[13px] text-text-secondary">
                            <span className="whitespace-nowrap">{e.quantity_g}{unitLabel} &middot; {e.calories} cal</span>
                            <span className="whitespace-nowrap">P:{e.protein} C:{e.carbs} F:{e.fat} Fi:{e.fibre}</span>
                          </div>
                        </div>
                        <motion.div
                          className="flex-shrink-0 text-text-tertiary"
                          animate={{ rotate: replacedExpanded ? 180 : 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <ChevronDown size={14} />
                        </motion.div>
                      </div>

                      <AnimatePresence>
                        {replacedExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                            onClick={ev => ev.stopPropagation()}
                          >
                            <div className="mt-3 pt-2.5 border-t border-bg-tertiary/50">
                              <div className="flex items-center bg-bg-primary rounded-xl px-3.5 py-2.5 mb-2.5 focus-within:ring-2 focus-within:ring-accent/25 transition-shadow">
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  className="flex-1 bg-transparent border-none text-[17px] font-medium text-right outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  value={replacedQtyDraft !== null ? replacedQtyDraft : e.quantity_g}
                                  onChange={ev => handleReplacedQtyChange(ev.target.value)}
                                  onBlur={() => setReplacedQtyDraft(null)}
                                  onClick={ev => ev.stopPropagation()}
                                />
                                <span className="text-[15px] text-text-secondary ml-1.5">{unitLabel}</span>
                              </div>
                              <div className="flex gap-2">
                                {[-50, -10, 10, 50].map(delta => (
                                  <motion.button
                                    key={delta}
                                    className="flex-1 py-1.5 bg-bg-primary border-none rounded-full text-[13px] font-medium text-text-secondary cursor-pointer hover:bg-bg-tertiary transition-colors"
                                    onClick={ev => { ev.stopPropagation(); setReplacedQtyDraft(null); updateReplacedQty(e.quantity_g + delta); }}
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
                    </div>
                  </div>
                );
              })()}
            </div>
            <div className="flex-shrink-0 px-6 pt-3 pb-[max(16px,env(safe-area-inset-bottom))]">
              <motion.button
                className="w-full bg-accent text-white rounded-xl h-[50px] text-[17px] font-medium border-none cursor-pointer"
                onClick={onClose}
                whileTap={{ scale: 0.97 }}
              >
                Done
              </motion.button>
            </div>
          </div>
        ) : (
        <>
        {/* Scrollable body */}
        <div
          ref={bodyRef}
          onPointerDown={() => setCanDrag((bodyRef.current?.scrollTop ?? 0) <= 0)}
          className={`flex-1 overflow-y-auto px-6 pt-4 scrollbar-none ${trayItems.length > 0 ? 'pb-[max(16px,env(safe-area-inset-bottom))]' : ''}`}>

          {/* ── Replace target banner ── */}
          {isReplace && replaceTarget && (
            <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-bg-secondary">
              <FoodThumbnail imageUrl={replaceTarget.imageUrl} name={replaceTarget.entry.food_name} />
              <div className="min-w-0">
                <div className="text-[12px] font-medium text-text-tertiary uppercase tracking-wide">Replacing</div>
                <div className="text-[15px] font-medium truncate">{replaceTarget.entry.food_name}</div>
              </div>
            </div>
          )}

          {/* ── Logged foods tray ── */}
          <AnimatePresence>
            {trayItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5"
              >

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

                  return grouped.map((group, groupIdx) => (
                    <div key={group.type} className="mb-1">
                      <div>
                        {groupIdx > 0 && <div className="h-px bg-bg-tertiary" />}
                        <div className="pt-2.5 pb-1">
                          <span className="text-[12px] font-medium text-text-tertiary uppercase tracking-wide">{group.label}</span>
                        </div>
                        <div
                          className="grid grid-cols-3 gap-x-5 gap-y-5 pb-3"
                          onClick={(e) => {
                            if (expandedIndex !== null && !(e.target as HTMLElement).closest('[data-tray-card]')) {
                              setExpandedIndex(null);
                              setQtyDraft(null);
                            }
                          }}
                        >
                          {group.entries.map(({ item, idx }, cardIndex) => {
                            const nutrition = scaleNutrition(item);
                            const isExpanded = expandedIndex === idx;
                            const unitLabel = item.unit === 'ml' ? 'ml' : 'g';

                            return (
                              <motion.div
                                key={item.id}
                                data-tray-card
                                className="min-w-0 cursor-pointer"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.25, delay: cardIndex * 0.04 }}
                                onClick={(e) => { e.stopPropagation(); handleToggleExpand(idx); }}
                                whileTap={{ scale: 0.96 }}
                              >
                                <div className="relative mb-1.5">
                                  {item.image_url ? (
                                    <img
                                      src={item.image_url}
                                      alt={item.matched_library_name || item.name}
                                      className="w-full aspect-square rounded-xl object-cover"
                                    />
                                  ) : (
                                    <div className="w-full aspect-square rounded-xl bg-bg-tertiary flex items-center justify-center text-2xl text-text-tertiary">
                                      {(item.matched_library_name || item.name).slice(0, 1).toUpperCase()}
                                    </div>
                                  )}
                                  <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-accent/80 flex items-center justify-center">
                                    {savingIndices.has(idx) ? (
                                      <Loader2 size={10} className="text-white animate-spin" />
                                    ) : (
                                      <Check size={10} className="text-white" />
                                    )}
                                  </div>
                                  {isExpanded && (
                                    <div className="absolute inset-0 rounded-xl ring-2 ring-accent pointer-events-none" />
                                  )}
                                </div>
                                <div>
                                  <div className="text-[11px] font-medium leading-tight line-clamp-2">
                                    {item.matched_library_name || item.name}
                                  </div>
                                  <div className="text-[11px] text-text-secondary mt-0.5">
                                    {item.quantity_g}{unitLabel} · {nutrition.calories} cal
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ));
                })()}

                <AnimatePresence>
                  {expandedIndex !== null && trayItems[expandedIndex] && (() => {
                    const item = trayItems[expandedIndex];
                    const unitLabel = item.unit === 'ml' ? 'ml' : 'g';
                    const qtyWarning = getQuantityWarning(item.quantity_g, item.calories_per_100g);
                    const colIndex = (() => {
                      const mealOrder = ['breakfast', 'lunch', 'snack', 'dinner'] as const;
                      for (const meal of mealOrder) {
                        const entries = trayItems.map((ti, i) => ({ ti, i })).filter(({ ti }) => ti.meal_type === meal);
                        const pos = entries.findIndex(({ i }) => i === expandedIndex);
                        if (pos !== -1) return pos % 3;
                      }
                      return 0;
                    })();
                    const arrowLeft = colIndex === 0 ? 'left-[16%]' : colIndex === 1 ? 'left-1/2' : 'left-[84%]';
                    return (
                      <motion.div
                        key="expand-panel"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="mt-1 mb-2 relative"
                      >
                        <div className={`absolute -top-[6px] ${arrowLeft} -translate-x-1/2 w-3 h-3 bg-bg-primary border-l border-t border-bg-tertiary rounded-sm rotate-45 z-10`} />
                        <div className="bg-bg-primary border border-bg-tertiary rounded-2xl px-4 py-3.5 relative">
                          <div className="text-[13px] font-medium text-text-secondary mb-2.5 flex items-center gap-1.5">
                            <span>{item.matched_library_name || item.name}</span>
                            <span className="text-text-tertiary">·</span>
                            <button
                              onClick={() => handleRemoveItem(expandedIndex)}
                              className="text-[13px] text-destructive underline decoration-dashed decoration-destructive/40 underline-offset-[3px] bg-transparent border-none cursor-pointer p-0 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                          <div className="mb-2.5">
                            <div className={`flex items-center bg-bg-secondary rounded-xl px-3.5 py-2.5 transition-shadow ${qtyWarning?.highlight === 'quantity' ? 'ring-2 ring-orange-400' : 'focus-within:ring-2 focus-within:ring-accent/25'}`}>
                              <input
                                type="text"
                                inputMode="numeric"
                                className="flex-1 bg-transparent border-none text-[17px] font-medium text-right outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                value={qtyDraft !== null ? qtyDraft : item.quantity_g}
                                onChange={e => handleQtyDraftChange(expandedIndex, e.target.value)}
                                onBlur={() => setQtyDraft(null)}
                                onClick={e => e.stopPropagation()}
                              />
                              <span className="text-[15px] text-text-secondary ml-1.5">{unitLabel}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {[-25, -10, 10, 25].map(delta => (
                              <motion.button
                                key={delta}
                                className="flex-1 py-1.5 bg-bg-secondary border-none rounded-full text-[13px] font-medium text-text-secondary cursor-pointer hover:bg-bg-tertiary transition-colors"
                                onClick={() => { setQtyDraft(null); handleUpdateQuantity(expandedIndex, item.quantity_g + delta); }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {delta > 0 ? '+' : '−'}{Math.abs(delta)}{unitLabel}
                              </motion.button>
                            ))}
                          </div>
                          {qtyWarning && (
                            <div className="text-[12px] text-orange-500 mt-2">{qtyWarning.message}</div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })()}
                </AnimatePresence>

                <div className="h-px bg-bg-tertiary mt-1" />
                <div className="flex justify-between items-center py-2.5">
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

        {/* ── Fixed bottom input bar — hidden once foods are logged, so the tray
            becomes a clean review screen (reopen the sheet to add more) ── */}
        {trayItems.length === 0 && (
        <div
          onPointerDown={() => setCanDrag(false)}
          className="flex-shrink-0 p-4 pb-[max(12px,env(safe-area-inset-bottom))] border-t border-bg-tertiary/50 bg-bg-primary">
          {/* Meal selector — "Auto" lets Gemini detect the meal per food.
              Hidden in replace mode (the food keeps its existing meal). */}
          {!isReplace && (
            <div className="flex gap-1.5 mb-2.5 overflow-x-auto scrollbar-none">
              {([
                { key: null, label: 'Auto' },
                { key: 'breakfast', label: 'Breakfast' },
                { key: 'lunch', label: 'Lunch' },
                { key: 'snack', label: 'Snack' },
                { key: 'dinner', label: 'Dinner' },
              ] as const).map(opt => {
                const active = selectedMeal === opt.key;
                return (
                  <motion.button
                    key={opt.label}
                    onClick={() => setSelectedMeal(opt.key)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[13px] font-medium border-none cursor-pointer transition-colors ${
                      active ? 'bg-accent/12 text-accent' : 'bg-bg-secondary text-text-secondary'
                    }`}
                    whileTap={{ scale: 0.93 }}
                  >
                    {opt.label}
                  </motion.button>
                );
              })}
            </div>
          )}
          <div className="bg-bg-secondary rounded-[20px] px-4 pt-3 pb-2.5 focus-within:ring-2 focus-within:ring-accent/25 transition-shadow">
            {loadingMessage ? (
              <div className="flex items-center gap-2.5 min-h-[56px]">
                <Loader2 size={18} className="text-accent animate-spin flex-shrink-0" />
                <span className="text-[15px] text-text-secondary">{loadingMessage}</span>
              </div>
            ) : (
              <textarea
                ref={textareaRef}
                className="w-full bg-transparent border-none resize-none text-base text-text-primary outline-none leading-relaxed placeholder:text-text-tertiary"
                rows={2}
                style={{ maxHeight: '40vh', overflow: 'auto' }}
                placeholder={recording ? 'Listening...' : 'I just had omelette with toast'}
                value={input}
                onChange={e => {
                  setInput(e.target.value);
                  const el = e.target;
                  el.style.height = 'auto';
                  el.style.height = el.scrollHeight + 'px';
                }}
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
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handlePhotoSelect}
                />
                {!isReplace && (
                  <motion.button
                    className="w-9 h-9 rounded-full bg-bg-tertiary border-none flex items-center justify-center text-text-secondary cursor-pointer flex-shrink-0"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={!!loadingMessage || recording}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Camera size={18} />
                  </motion.button>
                )}
                {micSupported && (
                  <motion.button
                    className={`w-9 h-9 rounded-full border-none flex items-center justify-center cursor-pointer flex-shrink-0 transition-colors ${
                      recording ? 'bg-destructive text-white' : 'bg-bg-tertiary text-text-secondary'
                    }`}
                    onClick={toggleRecording}
                    disabled={!!loadingMessage}
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
                )}
              </div>
              <motion.button
                className="w-9 h-9 rounded-full bg-accent border-none flex items-center justify-center text-white cursor-pointer flex-shrink-0 disabled:opacity-35 disabled:cursor-default"
                disabled={!hasContent || recording || !!loadingMessage}
                onClick={handleTextSubmit}
                whileTap={hasContent ? { scale: 0.85 } : {}}
              >
                <ArrowUp size={18} />
              </motion.button>
            </div>
          </div>
        </div>
        )}
        </>
        )}
      </motion.div>

      {/* Full-screen photo review */}
      <AnimatePresence>
        {showPhotoReview && reviewPhotos.length > 0 && (
          <PhotoReviewSheet
            photos={reviewPhotos}
            onChange={setReviewPhotos}
            onSubmit={handlePhotoSubmit}
            onClose={handlePhotoReviewClose}
            onAddMore={handleAddMorePhotos}
          />
        )}
      </AnimatePresence>
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
