import React, { useState, useEffect } from 'react';
import { Label } from './label';
import { Input } from './input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

// Common timezones list
const TIMEZONES = [
  { value: 'UTC', label: 'UTC (GMT+0)', offset: '+00:00' },
  { value: 'America/New_York', label: 'Eastern Time (ET)', offset: '-05:00' },
  { value: 'America/Chicago', label: 'Central Time (CT)', offset: '-06:00' },
  { value: 'America/Denver', label: 'Mountain Time (MT)', offset: '-07:00' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)', offset: '-08:00' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKT)', offset: '-09:00' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)', offset: '-10:00' },
  { value: 'Europe/London', label: 'British Time (GMT)', offset: '+00:00' },
  { value: 'Europe/Paris', label: 'Central European Time', offset: '+01:00' },
  { value: 'Europe/Athens', label: 'Eastern European Time', offset: '+02:00' },
  { value: 'Asia/Dubai', label: 'Gulf Standard Time', offset: '+04:00' },
  { value: 'Asia/Kolkata', label: 'India Standard Time', offset: '+05:30' },
  { value: 'Asia/Shanghai', label: 'China Standard Time', offset: '+08:00' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time', offset: '+09:00' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time', offset: '+10:00' },
  { value: 'Pacific/Auckland', label: 'New Zealand Time', offset: '+12:00' },
];

/**
 * DateTimeInput component for ISO 8601 formatted date-time with timezone
 * Returns format: 2024-01-05T08:00:00+08:00
 */
export function DateTimeInput({ value, onChange, label, required = false, error }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [timezone, setTimezone] = useState('');
  const [autoDetected, setAutoDetected] = useState(false);

  // Auto-detect user's timezone on mount
  useEffect(() => {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const matchedTz = TIMEZONES.find(tz => tz.value === userTimezone);

    if (matchedTz && !timezone) {
      setTimezone(matchedTz.value);
      setAutoDetected(true);
    } else if (!timezone) {
      // Fallback to UTC if timezone not detected
      setTimezone('UTC');
    }
  }, []);

  // Parse existing value if provided
  useEffect(() => {
    if (value && typeof value === 'string') {
      // Parse ISO 8601 format: 2024-01-05T08:00:00+08:00
      try {
        const match = value.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})(?::\d{2})?([+-]\d{2}:\d{2})?/);
        if (match) {
          setDate(match[1]);
          setTime(match[2]);

          // Find timezone by offset if present
          if (match[3]) {
            const tzByOffset = TIMEZONES.find(tz => tz.offset === match[3]);
            if (tzByOffset) {
              setTimezone(tzByOffset.value);
            }
          }
        }
      } catch (e) {
        console.error('Error parsing datetime:', e);
      }
    }
  }, [value]);

  // Combine date, time, and timezone to ISO 8601 format
  useEffect(() => {
    if (date && time && timezone) {
      const selectedTz = TIMEZONES.find(tz => tz.value === timezone);
      if (selectedTz) {
        const iso8601 = `${date}T${time}:00${selectedTz.offset}`;
        if (onChange) {
          onChange(iso8601);
        }
      }
    }
  }, [date, time, timezone]);

  return (
    <div className="space-y-3">
      {label && (
        <Label>
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </Label>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Date Input */}
        <div>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={error ? 'border-red-500' : ''}
          />
          <p className="text-xs text-gray-500 mt-1">Date</p>
        </div>

        {/* Time Input */}
        <div>
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className={error ? 'border-red-500' : ''}
            placeholder="HH:MM"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">⏰ Time (24-hour format)</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">e.g., 14:30 for 2:30 PM</p>
        </div>

        {/* Timezone Selector */}
        <div>
          <Select value={timezone} onValueChange={(val) => { setTimezone(val); setAutoDetected(false); }}>
            <SelectTrigger className={error ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              {TIMEZONES.map((tz) => (
                <SelectItem key={tz.value} value={tz.value}>
                  {tz.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {autoDetected && timezone === Intl.DateTimeFormat().resolvedOptions().timeZone ? (
            <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
              <span>✓</span>
              <span>Auto-detected</span>
            </p>
          ) : (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">🌍 Timezone</p>
          )}
        </div>
      </div>

      {/* Preview of ISO 8601 format */}
      {date && time && timezone && (
        <div className="p-3 bg-gray-50 rounded-lg border">
          <p className="text-xs font-medium text-gray-700 mb-1">ISO 8601 Format:</p>
          <code className="text-sm font-mono text-purple-600">
            {date}T{time}:00{TIMEZONES.find(tz => tz.value === timezone)?.offset}
          </code>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {autoDetected && (
        <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded border border-blue-200">
          <strong>Note:</strong> Timezone was automatically detected from your browser settings. You can change it if needed.
        </p>
      )}
    </div>
  );
}
