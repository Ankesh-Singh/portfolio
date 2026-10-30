"use client";

import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import DateRangeCalendar from './DateRangeCalendar';
import { DateRangeValue, PRESET_OPTIONS, PresetRange } from './types';

interface DateRangePickerModalProps {
  value: DateRangeValue;
  onApply: (val: DateRangeValue) => void;
  onClose: () => void;
}

function formatDateInput(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

export default function DateRangePickerModal({
  value,
  onApply,
  onClose,
}: DateRangePickerModalProps) {
  const [selectedPreset, setSelectedPreset] = useState<PresetRange | null>(
    value.type === 'preset' && value.preset ? value.preset : null
  );

  const [startDate, setStartDate] = useState<Date | null>(() => {
    if (value.startDate) return new Date(value.startDate);
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d;
  });

  const [endDate, setEndDate] = useState<Date | null>(() => {
    if (value.endDate) return new Date(value.endDate);
    return new Date();
  });

  const [startInput, setStartInput] = useState<string>(() =>
    startDate ? formatDateInput(startDate) : ''
  );
  const [endInput, setEndInput] = useState<string>(() =>
    endDate ? formatDateInput(endDate) : ''
  );

  const [customSearch, setCustomSearch] = useState('');

  const handleSelectPreset = (preset: PresetRange) => {
    setSelectedPreset(preset);
    const now = new Date();
    let start = new Date();

    if (preset === '30m') start = new Date(now.getTime() - 30 * 60 * 1000);
    else if (preset === '1h') start = new Date(now.getTime() - 60 * 60 * 1000);
    else if (preset === '6h') start = new Date(now.getTime() - 6 * 60 * 60 * 1000);
    else if (preset === '12h') start = new Date(now.getTime() - 12 * 60 * 60 * 1000);
    else if (preset === '24h') start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    else if (preset === '7d') start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    else if (preset === '30d') start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    setStartDate(start);
    setEndDate(now);
    setStartInput(formatDateInput(start));
    setEndInput(formatDateInput(now));
  };

  const handleCalendarClick = (date: Date) => {
    setSelectedPreset(null);
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
      setStartInput(formatDateInput(date));
    } else {
      if (date.getTime() < startDate.getTime()) {
        setStartDate(date);
        setEndDate(startDate);
        setStartInput(formatDateInput(date));
        setEndInput(formatDateInput(startDate));
      } else {
        setEndDate(date);
        setEndInput(formatDateInput(date));
      }
    }
  };

  const handleApply = () => {
    if (selectedPreset) {
      const presetOption = PRESET_OPTIONS.find((p) => p.id === selectedPreset);
      onApply({
        type: 'preset',
        preset: selectedPreset,
        label: presetOption ? presetOption.label : 'Custom',
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
      });
    } else {
      onApply({
        type: 'custom',
        label: `${startInput.split(' ')[0]} to ${endInput.split(' ')[0]}`,
        startDate: startDate?.toISOString() || new Date(startInput).toISOString(),
        endDate: endDate?.toISOString() || new Date(endInput).toISOString(),
      });
    }
    onClose();
  };

  return (
    <div className="w-[520px] max-w-[95vw] bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden text-neutral-900 dark:text-zinc-100 font-sans z-50">
      {/* Top Search Input */}
      <div className="p-3 border-b border-neutral-200 dark:border-zinc-800">
        <input
          type="text"
          value={customSearch}
          onChange={(e) => setCustomSearch(e.target.value)}
          placeholder="Custom range: 3h, 3 hours, 3 m..."
          className="w-full bg-transparent px-2.5 py-1.5 text-sm text-neutral-800 dark:text-zinc-200 placeholder:text-neutral-400 dark:placeholder:text-zinc-500 focus:outline-none"
        />
      </div>

      {/* Main Body: Calendar & Presets */}
      <div className="flex flex-col sm:flex-row border-b border-neutral-200 dark:border-zinc-800">
        {/* Calendar Left */}
        <div className="p-4 sm:border-r border-neutral-200 dark:border-zinc-800 flex-1 flex justify-center">
          <DateRangeCalendar
            startDate={startDate}
            endDate={endDate}
            onSelectDate={handleCalendarClick}
          />
        </div>

        {/* Presets Right */}
        <div className="w-full sm:w-[180px] p-2 flex flex-col gap-0.5 justify-center">
          {PRESET_OPTIONS.map((p) => {
            const isSelected = selectedPreset === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectPreset(p.id)}
                className={`text-left px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-100 dark:bg-zinc-800 text-neutral-900 dark:text-white font-semibold'
                    : 'text-neutral-600 dark:text-zinc-400 hover:bg-neutral-50 dark:hover:bg-zinc-800/60 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Inputs & Controls */}
      <div className="p-4 space-y-3 bg-neutral-50/50 dark:bg-zinc-900/50">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-neutral-500 dark:text-zinc-400 mb-1 font-medium">Start</label>
            <div className="flex items-center gap-2 px-2.5 py-1.5 bg-white dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-lg">
              <Calendar size={14} className="text-neutral-400 dark:text-zinc-500 shrink-0" />
              <input
                type="text"
                value={startInput}
                onChange={(e) => setStartInput(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-neutral-800 dark:text-zinc-200 text-xs font-mono"
              />
            </div>
          </div>
          <div>
            <label className="block text-neutral-500 dark:text-zinc-400 mb-1 font-medium">End</label>
            <div className="flex items-center gap-2 px-2.5 py-1.5 bg-white dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-lg">
              <Calendar size={14} className="text-neutral-400 dark:text-zinc-500 shrink-0" />
              <input
                type="text"
                value={endInput}
                onChange={(e) => setEndInput(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-neutral-800 dark:text-zinc-200 text-xs font-mono"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-zinc-400">
            <span>India Standard Time (GMT+5:30)</span>
            <ChevronDown size={12} className="opacity-60" />
          </div>
          <button
            type="button"
            onClick={handleApply}
            className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
