"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DateRangeCalendarProps {
  startDate: Date | null;
  endDate: Date | null;
  onSelectDate: (date: Date) => void;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function DateRangeCalendar({
  startDate,
  endDate,
  onSelectDate,
}: DateRangeCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(() => startDate || new Date());

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarDays: Array<{ date: Date; isCurrentMonth: boolean; dayNumber: number }> = [];

  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarDays.push({
      date: new Date(year, month - 1, daysInPrevMonth - i),
      isCurrentMonth: false,
      dayNumber: daysInPrevMonth - i,
    });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      date: new Date(year, month, i),
      isCurrentMonth: true,
      dayNumber: i,
    });
  }

  const remaining = (7 - (calendarDays.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    calendarDays.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false,
      dayNumber: i,
    });
  }

  const isSameDay = (d1: Date | null, d2: Date) => {
    if (!d1) return false;
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const isInRange = (date: Date) => {
    if (!startDate || !endDate) return false;
    const time = date.getTime();
    return time >= startDate.getTime() && time <= endDate.getTime();
  };

  return (
    <div className="w-full max-w-[280px] select-none">
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-sm font-semibold text-neutral-900 dark:text-white">
          {MONTH_NAMES[month]} {year}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1 rounded-md text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 dark:hover:bg-zinc-800 dark:hover:text-white transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1 rounded-md text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 dark:hover:bg-zinc-800 dark:hover:text-white transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-neutral-400 dark:text-zinc-500 mb-1.5">
        <span>Su</span>
        <span>Mo</span>
        <span>Tu</span>
        <span>We</span>
        <span>Th</span>
        <span>Fr</span>
        <span>Sa</span>
      </div>

      <div className="grid grid-cols-7 gap-y-1 gap-x-0.5 text-center text-xs">
        {calendarDays.map((item, idx) => {
          const isStart = isSameDay(startDate, item.date);
          const isEnd = isSameDay(endDate, item.date);
          const inRange = isInRange(item.date);

          let bgClass = 'hover:bg-neutral-100 dark:hover:bg-zinc-800 text-neutral-800 dark:text-zinc-200';

          if (!item.isCurrentMonth) {
            bgClass = 'text-neutral-300 dark:text-zinc-600 hover:bg-transparent';
          }

          if (inRange && !isStart && !isEnd) {
            bgClass = 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400';
          }

          if (isStart || isEnd) {
            bgClass = 'bg-neutral-900 text-white dark:bg-white dark:text-black font-semibold rounded-md';
          }

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectDate(item.date)}
              className={`h-8 w-8 mx-auto flex items-center justify-center rounded-md transition-all text-xs ${bgClass}`}
            >
              {item.dayNumber}
            </button>
          );
        })}
      </div>
    </div>
  );
}
