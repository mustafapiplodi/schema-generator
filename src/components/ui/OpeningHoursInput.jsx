import React, { useState, useEffect } from 'react';
import { Label } from './label';
import { Input } from './input';
import { Button } from './button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Plus, Trash2 } from 'lucide-react';

const DAYS_OF_WEEK = [
  { value: 'Monday', label: 'Monday', short: 'Mo' },
  { value: 'Tuesday', label: 'Tuesday', short: 'Tu' },
  { value: 'Wednesday', label: 'Wednesday', short: 'We' },
  { value: 'Thursday', label: 'Thursday', short: 'Th' },
  { value: 'Friday', label: 'Friday', short: 'Fr' },
  { value: 'Saturday', label: 'Saturday', short: 'Sa' },
  { value: 'Sunday', label: 'Sunday', short: 'Su' },
];

const COMMON_PATTERNS = [
  { label: 'Mon-Fri (9am-5pm)', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '17:00' },
  { label: 'Mon-Sat (9am-6pm)', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '09:00', closes: '18:00' },
  { label: 'Every day (9am-9pm)', days: DAYS_OF_WEEK.map(d => d.value), opens: '09:00', closes: '21:00' },
  { label: '24/7', days: DAYS_OF_WEEK.map(d => d.value), opens: '00:00', closes: '23:59' },
];

/**
 * OpeningHoursInput component for Schema.org openingHoursSpecification
 * Returns array of objects with dayOfWeek, opens, closes
 */
export function OpeningHoursInput({ value, onChange, label, required = false }) {
  const [schedules, setSchedules] = useState([
    { id: Date.now(), days: ['Monday'], opens: '09:00', closes: '17:00' }
  ]);

  // Parse existing value if provided
  useEffect(() => {
    if (value && Array.isArray(value) && value.length > 0) {
      const parsed = value.map((spec, index) => ({
        id: Date.now() + index,
        days: Array.isArray(spec.dayOfWeek) ? spec.dayOfWeek : [spec.dayOfWeek],
        opens: spec.opens || '09:00',
        closes: spec.closes || '17:00',
      }));
      setSchedules(parsed);
    }
  }, []);

  // Convert schedules to Schema.org format
  useEffect(() => {
    const formatted = schedules.map(schedule => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: schedule.days,
      opens: schedule.opens,
      closes: schedule.closes,
    }));

    if (onChange) {
      onChange(formatted);
    }
  }, [schedules]);

  const addSchedule = () => {
    setSchedules([
      ...schedules,
      { id: Date.now(), days: ['Monday'], opens: '09:00', closes: '17:00' }
    ]);
  };

  const removeSchedule = (id) => {
    setSchedules(schedules.filter(s => s.id !== id));
  };

  const updateSchedule = (id, field, value) => {
    setSchedules(schedules.map(s =>
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const applyPattern = (pattern) => {
    setSchedules([{
      id: Date.now(),
      days: pattern.days,
      opens: pattern.opens,
      closes: pattern.closes,
    }]);
  };

  const toggleDay = (scheduleId, day) => {
    setSchedules(schedules.map(s => {
      if (s.id === scheduleId) {
        const days = s.days.includes(day)
          ? s.days.filter(d => d !== day)
          : [...s.days, day];
        return { ...s, days };
      }
      return s;
    }));
  };

  return (
    <div className="space-y-4">
      {label && (
        <Label>
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </Label>
      )}

      {/* Common Patterns */}
      <div className="flex flex-wrap gap-2">
        {COMMON_PATTERNS.map((pattern, index) => (
          <Button
            key={index}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => applyPattern(pattern)}
            className="text-xs"
          >
            {pattern.label}
          </Button>
        ))}
      </div>

      {/* Schedules */}
      <div className="space-y-4">
        {schedules.map((schedule, index) => (
          <div key={schedule.id} className="p-4 border rounded-lg space-y-3 bg-gray-50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Schedule {index + 1}</span>
              {schedules.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSchedule(schedule.id)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Day selector */}
            <div>
              <Label className="text-xs text-gray-600 mb-2">Days of Week</Label>
              <div className="flex flex-wrap gap-2">
                {DAYS_OF_WEEK.map((day) => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => toggleDay(schedule.id, day.value)}
                    className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                      schedule.days.includes(day.value)
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400'
                    }`}
                  >
                    {day.short}
                  </button>
                ))}
              </div>
            </div>

            {/* Time inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-gray-600 dark:text-gray-400">⏰ Opens (24-hour)</Label>
                <Input
                  type="time"
                  value={schedule.opens}
                  onChange={(e) => updateSchedule(schedule.id, 'opens', e.target.value)}
                  className="mt-1"
                  placeholder="HH:MM"
                />
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">e.g., 09:00</p>
              </div>
              <div>
                <Label className="text-xs text-gray-600 dark:text-gray-400">⏰ Closes (24-hour)</Label>
                <Input
                  type="time"
                  value={schedule.closes}
                  onChange={(e) => updateSchedule(schedule.id, 'closes', e.target.value)}
                  className="mt-1"
                  placeholder="HH:MM"
                />
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">e.g., 17:00</p>
              </div>
            </div>

            {/* Preview */}
            <div className="text-xs text-gray-500 mt-2">
              {schedule.days.map(d => DAYS_OF_WEEK.find(day => day.value === d)?.short).join(', ')} • {schedule.opens} - {schedule.closes}
            </div>
          </div>
        ))}
      </div>

      {/* Add Schedule Button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addSchedule}
        className="w-full gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Schedule
      </Button>

      <p className="text-xs text-gray-500">
        Tip: Add multiple schedules for different hours on different days (e.g., weekdays vs weekends)
      </p>
    </div>
  );
}
