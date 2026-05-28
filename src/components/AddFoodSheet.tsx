'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, ArrowUp, Plus, X } from 'lucide-react';

interface AttachedFood {
  name: string;
  detail: string;
  calories: number;
}

interface FrequentFood {
  food_name: string;
  quantity_g: number;
  calories: number;
  unit: string;
  count: number;
}

interface AddFoodSheetProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (text: string, attachedFoods: AttachedFood[]) => void;
  frequentFoods?: FrequentFood[];
}

export default function AddFoodSheet({ open, onClose, onSubmit, frequentFoods = [] }: AddFoodSheetProps) {
  const [input, setInput] = useState('');
  const [attachedFoods, setAttachedFoods] = useState<AttachedFood[]>([]);
  const [recording, setRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hasContent = input.trim().length > 0 || attachedFoods.length > 0;

  const handleSubmit = () => {
    if (!hasContent) return;
    onSubmit(input.trim(), attachedFoods);
    setInput('');
    setAttachedFoods([]);
  };

  const handleAttachFood = (food: FrequentFood) => {
    const unitLabel = food.unit === 'ml' ? 'ml' : 'g';
    setAttachedFoods(prev => [...prev, {
      name: food.food_name,
      detail: `${food.quantity_g}${unitLabel}`,
      calories: food.calories,
    }]);
    textareaRef.current?.focus();
  };

  const handleRemoveAttached = (index: number) => {
    setAttachedFoods(prev => prev.filter((_, i) => i !== index));
  };

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const speechSupported = typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  useEffect(() => {
    if (!speechSupported) return;

    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionClass();
    recognition.lang = 'en-IN';
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setInput(transcript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setRecording(false);
    };

    recognition.onend = () => {
      setRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, [speechSupported]);

  useEffect(() => {
    if (!open && recording) {
      recognitionRef.current?.stop();
    }
  }, [open, recording]);

  const toggleRecording = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (!recording) {
      setInput('');
      setRecording(true);
      recognition.start();
    } else {
      recognition.stop();
    }
  }, [recording]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="absolute inset-0 bg-black/30 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-bg-primary rounded-t-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] flex flex-col max-h-[88vh] z-30"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Handle */}
            <div className="w-9 h-1 bg-bg-tertiary rounded-full mx-auto mt-2.5 flex-shrink-0" />

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 pt-4 scrollbar-none">
              {/* Header */}
              <div className="mb-4">
                <span className="text-[22px] font-semibold">Log Food</span>
              </div>

              {/* Frequently logged */}
              {!recording && frequentFoods.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="text-[13px] font-medium text-text-secondary uppercase tracking-wide mb-3">
                    Frequently logged
                  </div>
                  <div className="flex flex-col gap-2 mb-5">
                    {frequentFoods.map((food, i) => {
                      const unitLabel = food.unit === 'ml' ? 'ml' : 'g';
                      return (
                        <motion.div
                          key={food.food_name}
                          className="flex items-center gap-3 bg-bg-secondary rounded-xl p-3 cursor-pointer active:opacity-70 transition-opacity"
                          onClick={() => handleAttachFood(food)}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + i * 0.05 }}
                        >
                          <div className="w-10 h-10 rounded-[10px] bg-bg-tertiary flex items-center justify-center text-base flex-shrink-0">
                            {food.food_name.slice(0, 1).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[14px] font-semibold truncate">{food.food_name}</div>
                            <div className="text-[12px] text-text-secondary mt-0.5">
                              {food.quantity_g}{unitLabel} &middot; {food.calories} cal &middot; {food.count}x
                            </div>
                          </div>
                          <span className="w-7 h-7 rounded-full bg-bg-tertiary flex items-center justify-center text-accent flex-shrink-0">
                            <Plus size={16} />
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Waveform (recording state) */}
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
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          repeatType: 'reverse',
                          delay: i * 0.05,
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-[13px] text-text-secondary">Listening... tap stop when done</span>
                </motion.div>
              )}
            </div>

            {/* Fixed bottom input bar — Gemini-style */}
            <div className="flex-shrink-0 p-4 pb-[max(12px,env(safe-area-inset-bottom))] border-t border-bg-tertiary/50 bg-bg-primary">
              <div className="bg-bg-secondary rounded-[20px] px-4 pt-3 pb-2.5 focus-within:ring-2 focus-within:ring-accent/25 transition-shadow">
                {/* Attached food chips */}
                <AnimatePresence>
                  {attachedFoods.length > 0 && (
                    <motion.div
                      className="flex flex-wrap gap-2 mb-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      {attachedFoods.map((food, i) => (
                        <motion.div
                          key={`${food.name}-${i}`}
                          className="flex items-center gap-2 bg-bg-primary rounded-xl px-2.5 py-1.5 shadow-sm"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.15 }}
                        >
                          <div className="w-7 h-7 rounded-md bg-bg-tertiary flex items-center justify-center text-xs flex-shrink-0">
                            {food.name.slice(0, 1).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="text-[13px] font-medium leading-tight truncate">{food.name}</div>
                            <div className="text-[11px] text-text-secondary leading-tight">{food.detail} &middot; {food.calories} cal</div>
                          </div>
                          <button
                            onClick={() => handleRemoveAttached(i)}
                            className="w-5 h-5 rounded-full bg-bg-tertiary border-none flex items-center justify-center text-text-tertiary cursor-pointer hover:text-text-primary transition-colors flex-shrink-0"
                          >
                            <X size={12} />
                          </button>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <textarea
                  ref={textareaRef}
                  className="w-full bg-transparent border-none resize-none text-base text-text-primary outline-none leading-relaxed placeholder:text-text-tertiary"
                  rows={2}
                  placeholder={recording ? 'Listening...' : 'I just had omelette with toast'}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={recording}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                />
                <div className="flex items-center justify-between mt-2">
                  {speechSupported && (
                    <motion.button
                      className={`w-9 h-9 rounded-full border-none flex items-center justify-center cursor-pointer flex-shrink-0 transition-colors ${
                        recording
                          ? 'bg-destructive text-white'
                          : 'bg-bg-tertiary text-text-secondary'
                      }`}
                      onClick={toggleRecording}
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
                  <motion.button
                    className="w-9 h-9 rounded-full bg-accent border-none flex items-center justify-center text-white cursor-pointer flex-shrink-0 disabled:opacity-35 disabled:cursor-default"
                    disabled={!hasContent || recording}
                    onClick={handleSubmit}
                    whileTap={hasContent ? { scale: 0.85 } : {}}
                  >
                    <ArrowUp size={18} />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
