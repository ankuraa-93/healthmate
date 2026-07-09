'use client';

import { forwardRef } from 'react';
import { Drumstick, Wheat, Droplet, Leaf, Zap } from 'lucide-react';
import { FoodLogEntry, DailyTotals, Profile } from '@/lib/types';

interface ShareImageCardProps {
  displayName: string | null;
  avatarUrl: string | null;
  date: Date;
  totals: DailyTotals;
  profile: Profile;
  logs: FoodLogEntry[];
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getCalorieColor(ratio: number): string {
  if (ratio < 0.75) return '#A8E6CF';
  if (ratio < 0.9) return '#FF9500';
  if (ratio <= 1.1) return '#34C759';
  return '#FF3B30';
}

function getBarColor(macroRatio: number, calRatio: number): string {
  if (calRatio >= 0.75) {
    if (macroRatio < 0.75) return '#FF3B30';
    if (macroRatio < 0.9) return '#FF9500';
    if (macroRatio <= 1.1) return '#34C759';
    return '#FF3B30';
  }
  const low = calRatio * 0.75;
  const mid = calRatio * 0.9;
  const high = calRatio * 1.1;
  if (macroRatio < low || macroRatio > high) return '#FFB3B0';
  if (macroRatio < mid) return '#FFE0A3';
  return '#A8E6CF';
}

const ShareImageCard = forwardRef<HTMLDivElement, ShareImageCardProps>(
  function ShareImageCard({ displayName, avatarUrl, date, totals, profile, logs }, ref) {
    const calRatio = totals.calories / profile.daily_calorie_goal;
    const circumference = 2 * Math.PI * 65;
    const offset = circumference * (1 - Math.min(calRatio, 1));
    const ringColor = getCalorieColor(calRatio);

    const dateStr = `${DAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]}`;

    const macros = [
      { label: 'Protein', Icon: Drumstick, value: totals.protein, target: profile.daily_protein_goal },
      { label: 'Carbs', Icon: Wheat, value: totals.carbs, target: profile.daily_carbs_goal },
      { label: 'Fat', Icon: Droplet, value: totals.fat, target: profile.daily_fat_goal },
      { label: 'Fibre', Icon: Leaf, value: totals.fibre, target: profile.daily_fibre_goal },
    ];

    const mealOrder = ['breakfast', 'lunch', 'snack', 'dinner'] as const;
    const mealLabels: Record<string, string> = { breakfast: 'Breakfast', lunch: 'Lunch', snack: 'Snack', dinner: 'Dinner' };

    const confirmedLogs = logs.filter(l => l.status === 'confirmed');

    return (
      <div
        ref={ref}
        style={{
          width: 390,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          backgroundColor: '#FFFFFF',
          color: '#1C1C1E',
          padding: '20px 16px 12px',
          boxSizing: 'border-box',
        }}
      >
        {/* Header: name + date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt=""
              crossOrigin="anonymous"
              style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              backgroundColor: '#E5E5EA', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 600, color: '#8E8E93',
            }}>
              {(displayName ?? '?')[0].toUpperCase()}
            </div>
          )}
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>
              {displayName ?? 'My food log'}
            </div>
            <div style={{ fontSize: 12, color: '#8E8E93', lineHeight: 1.3 }}>
              {dateStr}
            </div>
          </div>
        </div>

        {/* Ring + Macros */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          {/* Calorie ring */}
          <div style={{ flexShrink: 0 }}>
            <div style={{ position: 'relative', width: 110, height: 110 }}>
              <svg width="110" height="110" viewBox="0 0 150 150" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="75" cy="75" r="65" fill="none" stroke="#E5E5EA" strokeWidth="12" />
                <circle
                  cx="75" cy="75" r="65" fill="none"
                  stroke={ringColor} strokeWidth="12" strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                />
              </svg>
              <div style={{
                position: 'absolute', inset: 0, display: 'flex',
                flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 22, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 2 }}>
                  {totals.calories}
                  <Zap size={12} strokeWidth={2.5} />
                </span>
                <span style={{ fontSize: 10, color: '#8E8E93', marginTop: 1 }}>
                  of {profile.daily_calorie_goal} cal
                </span>
              </div>
            </div>
          </div>

          {/* Macro bars */}
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 14px' }}>
            {macros.map(macro => {
              const pct = Math.min((macro.value / macro.target) * 100, 100);
              const macroRatio = macro.value / macro.target;
              const barColor = getBarColor(macroRatio, calRatio);
              return (
                <div key={macro.label} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
                    {macro.label}
                    <macro.Icon size={11} color="#8E8E93" />
                  </span>
                  <div style={{ width: '80%', height: 4, backgroundColor: '#E5E5EA', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, backgroundColor: barColor, borderRadius: 3 }} />
                  </div>
                  <span style={{ fontSize: 10, color: '#AEAEB2' }}>
                    {Math.round(macro.value)}g / {macro.target}g
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, backgroundColor: '#E5E5EA', marginBottom: 10 }} />

        {/* Meal sections */}
        {mealOrder.map(type => {
          const entries = confirmedLogs.filter(l => l.meal_type === type);
          if (entries.length === 0) return null;
          const mealCals = entries.reduce((sum, e) => sum + (e.calories ?? 0), 0);

          return (
            <div key={type} style={{ marginBottom: 10 }}>
              {/* Meal card */}
              <div style={{ backgroundColor: '#F8F8FA', borderRadius: 10, overflow: 'hidden' }}>
                {/* Meal header */}
                <div style={{ padding: '8px 12px 4px' }}>
                  <span style={{ fontSize: 11, fontWeight: 500, color: '#AEAEB2', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {mealLabels[type]}
                  </span>
                  {mealCals > 0 && (
                    <span style={{ fontSize: 11, fontWeight: 500, color: '#AEAEB2' }}>
                      {' '}&middot; {mealCals} cal
                    </span>
                  )}
                </div>

                {/* Food items — two-column grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, padding: '2px 0 6px' }}>
                  {entries.map((entry) => {
                    const unitLabel = entry.unit === 'ml' ? 'ml' : 'g';
                    return (
                      <div key={entry.id} style={{ padding: '4px 12px', minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {entry.food_name}
                        </div>
                        <div style={{ fontSize: 11, color: '#8E8E93', marginTop: 1 }}>
                          {entry.quantity_g}{unitLabel} &middot; {entry.calories} cal
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {/* Footer branding */}
        <div style={{
          textAlign: 'center', paddingTop: 4, fontSize: 11,
          color: '#AEAEB2', fontWeight: 500, letterSpacing: '0.02em',
        }}>
          Calorrific
        </div>
      </div>
    );
  }
);

export default ShareImageCard;
