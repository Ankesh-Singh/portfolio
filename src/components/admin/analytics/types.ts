export type PresetRange = '30m' | '1h' | '6h' | '12h' | '24h' | '7d' | '30d' | '90d' | 'all';

export interface DateRangeValue {
  type: 'preset' | 'custom';
  preset?: PresetRange;
  label: string;
  startDate?: string;
  endDate?: string;
}

export const PRESET_OPTIONS: Array<{ id: PresetRange; label: string }> = [
  { id: '30m', label: 'Last 30 minutes' },
  { id: '1h', label: 'Last 1 hour' },
  { id: '6h', label: 'Last 6 hours' },
  { id: '12h', label: 'Last 12 hours' },
  { id: '24h', label: 'Last 24 hours' },
  { id: '7d', label: 'Last 7 days' },
  { id: '30d', label: 'Last 30 days' },
];
