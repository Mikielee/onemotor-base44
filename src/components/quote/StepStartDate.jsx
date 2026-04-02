import { useState, useEffect, useRef } from 'react';
import StepFooter from './StepFooter';
import { addDays, addMonths, isBefore, isAfter, format, startOfMonth, getDaysInMonth, getDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function CalendarPopup({ label, value, onSelect, minDate, maxDate }) {
  const [open, setOpen] = useState(false);
  const [raw, setRaw] = useState(value ? format(value, 'dd/MM/yyyy') : '');
  const [displayMonth, setDisplayMonth] = useState(value ? startOfMonth(value) : startOfMonth(new Date()));
  const containerRef = useRef(null);

  useEffect(() => {
    setRaw(value ? format(value, 'dd/MM/yyyy') : '');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleInputChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 8);
    let val = digits;
    if (digits.length > 4) val = digits.slice(0, 2) + '/' + digits.slice(2, 4) + '/' + digits.slice(4);
    else if (digits.length > 2) val = digits.slice(0, 2) + '/' + digits.slice(2);
    setRaw(val);
    if (digits.length === 8) {
      const d = digits.slice(0, 2), m = digits.slice(2, 4), y = digits.slice(4);
      const parsed = new Date(`${y}-${m}-${d}`);
      if (!isNaN(parsed)) {
        const tooEarly = minDate && isBefore(parsed, minDate);
        const tooLate = maxDate && isAfter(parsed, maxDate);
        if (!tooEarly && !tooLate) {
          onSelect(parsed);
          setDisplayMonth(startOfMonth(parsed));
        }
      }
    }
  };

  const isDateDisabled = (day) => {
    if (minDate && isBefore(day, minDate)) return true;
    if (maxDate && isAfter(day, maxDate)) return true;
    return false;
  };

  const renderCalendar = () => {
    const firstDay = getDay(displayMonth);
    const daysInMonth = getDaysInMonth(displayMonth);
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  const days = renderCalendar();
  const monthLabel = format(displayMonth, 'MMMM yyyy');

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-xs font-montserrat font-semibold text-carbon mb-1.5">{label}</label>
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          placeholder="DD/MM/YYYY"
          maxLength={10}
          value={raw}
          onChange={handleInputChange}
          onClick={() => setOpen(true)}
          className="w-full px-3 py-3 border-2 border-bdred rounded-lg font-montserrat text-sm text-carbon focus:outline-none cursor-pointer"
        />
      </div>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 p-4 w-72">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => setDisplayMonth(addMonths(displayMonth, -1))}
              className="p-1.5 hover:bg-grey100 rounded-lg"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-montserrat font-bold text-sm text-carbon">{monthLabel}</span>
            <button
              type="button"
              onClick={() => setDisplayMonth(addMonths(displayMonth, 1))}
              className="p-1.5 hover:bg-grey100 rounded-lg"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
              <div key={d} className="text-center text-[10px] font-montserrat font-bold text-muted-foreground">{d}</div>
            ))}
          </div>
          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, idx) => {
              if (day === null) return <div key={`empty-${idx}`} />;
              const dateObj = new Date(displayMonth.getFullYear(), displayMonth.getMonth(), day);
              dateObj.setHours(0, 0, 0, 0);
              const disabled = isDateDisabled(dateObj);
              const isSelected = value && format(dateObj, 'yyyy-MM-dd') === format(value, 'yyyy-MM-dd');
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => !disabled && (onSelect(dateObj), setOpen(false))}
                  disabled={disabled}
                  className={`w-8 h-8 rounded text-xs font-montserrat font-semibold transition-all ${
                    isSelected
                      ? 'bg-bdred text-white'
                      : disabled
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-carbon hover:bg-grey100'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function StepStartDate({ formData, onChange, onNext, onBack }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = formData.coverStartDate ? new Date(formData.coverStartDate) : null;
  const endDate = formData.coverEndDate ? new Date(formData.coverEndDate) : null;

  const startMin = today;
  const startMax = addDays(today, 60);
  const endMin = startDate ? addMonths(startDate, 7) : null;
  const endMax = startDate ? addMonths(startDate, 12) : null;

  const handleStartSelect = (day) => {
    onChange('coverStartDate', day.toISOString());
    onChange('coverEndDate', addDays(day, 365).toISOString());
  };

  const canProceed = !!startDate && !!endDate;

  return (
    <div className="space-y-3 pb-24">
      <h1 className="font-montserrat font-bold text-xl text-carbon">
        When would you like your cover?
      </h1>

      <CalendarPopup
        label="Cover Start Date"
        value={startDate}
        onSelect={handleStartSelect}
        minDate={startMin}
        maxDate={startMax}
      />

      <CalendarPopup
        label="Cover End Date"
        value={endDate}
        onSelect={(day) => onChange('coverEndDate', day.toISOString())}
        minDate={endMin}
        maxDate={endMax}
      />

      {startDate && !endDate && (
        <p className="text-xs font-montserrat text-muted-foreground text-center">
          End date auto-set to 1 year. You can adjust it above (min 7 months, max 12 months).
        </p>
      )}

      <StepFooter onBack={onBack} onNext={onNext} disabled={!canProceed} />
    </div>
  );
}