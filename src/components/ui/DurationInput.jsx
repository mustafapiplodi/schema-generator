import React, { useState, useEffect } from 'react';
import { Label } from './label';
import { Input } from './input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

/**
 * DurationInput component for ISO 8601 duration format
 * Converts human-readable time input to ISO 8601 format
 * Returns format like: PT15M, PT1H30M, PT2H, PT10M30S
 */
export function DurationInput({ value, onChange, label, required = false, error, showSeconds = false }) {
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('0');
  const [seconds, setSeconds] = useState('0');
  const [preset, setPreset] = useState('');

  // Preset durations
  const PRESETS = [
    { value: '', label: 'Custom' },
    { value: 'PT5M', label: '5 minutes' },
    { value: 'PT10M', label: '10 minutes' },
    { value: 'PT15M', label: '15 minutes' },
    { value: 'PT30M', label: '30 minutes' },
    { value: 'PT45M', label: '45 minutes' },
    { value: 'PT1H', label: '1 hour' },
    { value: 'PT1H30M', label: '1.5 hours' },
    { value: 'PT2H', label: '2 hours' },
    { value: 'PT3H', label: '3 hours' },
  ];

  // Parse existing ISO 8601 duration if provided
  useEffect(() => {
    if (value && typeof value === 'string' && value.startsWith('PT')) {
      try {
        // Parse PT1H30M45S format
        const hoursMatch = value.match(/(\d+)H/);
        const minutesMatch = value.match(/(\d+)M/);
        const secondsMatch = value.match(/(\d+)S/);

        if (hoursMatch) setHours(hoursMatch[1]);
        if (minutesMatch) setMinutes(minutesMatch[1]);
        if (secondsMatch) setSeconds(secondsMatch[1]);

        // Check if matches a preset
        const matchedPreset = PRESETS.find(p => p.value === value);
        if (matchedPreset) {
          setPreset(matchedPreset.value);
        }
      } catch (e) {
        console.error('Error parsing duration:', e);
      }
    }
  }, [value]);

  // Convert to ISO 8601 format whenever values change
  useEffect(() => {
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;

    // Only generate if at least one value is non-zero
    if (h > 0 || m > 0 || s > 0) {
      let duration = 'PT';
      if (h > 0) duration += `${h}H`;
      if (m > 0) duration += `${m}M`;
      if (s > 0 && showSeconds) duration += `${s}S`;

      if (onChange) {
        onChange(duration);
      }
    } else if (onChange) {
      onChange('');
    }
  }, [hours, minutes, seconds, showSeconds]);

  const handlePresetChange = (presetValue) => {
    setPreset(presetValue);
    if (presetValue && onChange) {
      onChange(presetValue);

      // Parse and set individual fields
      const hoursMatch = presetValue.match(/(\d+)H/);
      const minutesMatch = presetValue.match(/(\d+)M/);
      const secondsMatch = presetValue.match(/(\d+)S/);

      setHours(hoursMatch ? hoursMatch[1] : '0');
      setMinutes(minutesMatch ? minutesMatch[1] : '0');
      setSeconds(secondsMatch ? secondsMatch[1] : '0');
    }
  };

  const handleCustomInput = () => {
    setPreset('');
  };

  const formatDuration = () => {
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;

    const parts = [];
    if (h > 0) parts.push(`${h} ${h === 1 ? 'hour' : 'hours'}`);
    if (m > 0) parts.push(`${m} ${m === 1 ? 'minute' : 'minutes'}`);
    if (s > 0 && showSeconds) parts.push(`${s} ${s === 1 ? 'second' : 'seconds'}`);

    return parts.length > 0 ? parts.join(', ') : 'No duration set';
  };

  return (
    <div className="space-y-3">
      {label && (
        <Label>
          {label}
          {required && <span className="text-red-600 dark:text-red-400 ml-1">*</span>}
        </Label>
      )}

      {/* Preset Selector */}
      <div>
        <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2">⚡ Quick Select</Label>
        <Select value={preset} onValueChange={handlePresetChange}>
          <SelectTrigger className={error ? 'border-red-500' : ''}>
            <SelectValue placeholder="Choose a preset or enter custom" />
          </SelectTrigger>
          <SelectContent>
            {PRESETS.map((p) => (
              <SelectItem key={p.value || 'custom'} value={p.value || 'custom'}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Custom Duration Input */}
      <div>
        <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2">🕐 Custom Duration</Label>
        <div className={`grid ${showSeconds ? 'grid-cols-3' : 'grid-cols-2'} gap-3`}>
          <div>
            <Input
              type="number"
              min="0"
              max="99"
              value={hours}
              onChange={(e) => {
                setHours(e.target.value);
                handleCustomInput();
              }}
              placeholder="0"
              className={error ? 'border-red-500' : ''}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">Hours</p>
          </div>
          <div>
            <Input
              type="number"
              min="0"
              max="59"
              value={minutes}
              onChange={(e) => {
                setMinutes(e.target.value);
                handleCustomInput();
              }}
              placeholder="0"
              className={error ? 'border-red-500' : ''}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">Minutes</p>
          </div>
          {showSeconds && (
            <div>
              <Input
                type="number"
                min="0"
                max="59"
                value={seconds}
                onChange={(e) => {
                  setSeconds(e.target.value);
                  handleCustomInput();
                }}
                placeholder="0"
                className={error ? 'border-red-500' : ''}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">Seconds</p>
            </div>
          )}
        </div>
      </div>

      {/* Preview */}
      {(parseInt(hours) > 0 || parseInt(minutes) > 0 || parseInt(seconds) > 0) && (
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700">
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Duration:</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{formatDuration()}</p>
          <p className="text-xs font-mono text-purple-600 dark:text-purple-400 mt-1">
            ISO 8601: {value || 'PT0M'}
          </p>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
