import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import StepFooter from './StepFooter';
import { format, addDays, addMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, isBefore, isAfter } from 'date-fns';

function DateCalendar({ label, value, onSelect, minDate, maxDate, highlight }) {
  const [currentMonth, setCurrentMonth] = useState(value || minDate || new Date());
  const [inputValue, setInputValue] = useState(value ? format(value, 'dd/MM/yyyy') : '');

  const isDisabled = (day) => {
    if (minDate && isBefore(day, minDate)) return true;
    if (maxDate && isAfter(day, maxDate)) return true;
    return false;
  };

  const handleInputChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 8);
    let val = digits;
    if (digits.length > 4) val = digits.slice(0, 2) + '/' + digits.slice(2, 4) + '/' + digits.slice(4);
    else if (digits.length > 2) val = digits.slice(0, 2) + '/' + digits.slice(2);
    setInputValue(val);
    if (digits.length === 8) {
      const d = digits.slice(0, 2), m = digits.slice(2, 4), y = digits.slice(4);
      const parsed = new Date(`${y}-${m}-${d}`);
      if (!isNaN(parsed) && !isDisabled(parsed)) {
        onSelect(parsed);
        setCurrentMonth(parsed);
      }
    }
  };

  const handleCalendarSelect = (day) => {
    onSelect(day);
    setInputValue(format(day, 'dd/MM/yyyy'));
    setCurrentMonth(day);
  };

  // Sync input if value changes externally (e.g. auto-set end date)
  useMemo(() => {
    if (value) setInputValue(format(value, 'dd/MM/yyyy'));
  }, [value?.toISOString()]);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
    const dayList = [];
    for (let day = new Date(start); day <= end; day = addDays(day, 1)) {
      dayList.push(new Date(day));
    }
    return dayList;
  }, [currentMonth]);

  return (
    <div className={`bg-white rounded-lg border p-4 ${highlight ? 'border-bdred' : 'border-gray-200'}`}>
      <div className="mb-3">
        <label className="block text-xs font-montserrat font-semibold text-carbon mb-1.5">{label}</label>
        <input
          type="text"
          placeholder="dd/mm/yyyy"
          value={inputValue}
          onChange={handleInputChange}
          className="w-full px-3 py-2.5 border-2 border-bdred rounded-lg font-montserrat text-sm text-carbon focus:outline-none"
        />
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-3">
        <button type="button" onClick={() => setCurrentMonth(m => addMonths(m, -1))}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-grey100">
          <ChevronLeft className="w-4 h-4 text-carbon" />
        </button>
        <span className="font-montserrat font-bold text-carbon text-xs">{format(currentMonth, 'MMMM yyyy')}</span>
        <button type="button" onClick={() => setCurrentMonth(m => addMonths(m, 1))}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-grey100">
          <ChevronRight className="w-4 h-4 text-carbon" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => (
          <div key={d} className="text-center text-[9px] font-montserrat font-medium text-muted-foreground py-1">{d}</div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((day, i) => {
          const disabled = isDisabled(day);
          const isSelected = value && isSameDay(day, value);
          const isToday = isSameDay(day, new Date());
          const isCurrentMonth = isSameMonth(day, currentMonth);
          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => handleCalendarSelect(day)}
              className={`aspect-square flex flex-col items-center justify-center rounded-full text-[11px] font-montserrat transition-all ${
                !isCurrentMonth ? 'invisible'
                : isSelected ? 'bg-bdred text-white font-bold ring-2 ring-bdred ring-offset-1'
                : isToday && !isSelected ? 'border-2 border-gray-300 text-carbon font-medium'
                : disabled ? 'text-gray-300 cursor-not-allowed'
                : 'text-carbon hover:bg-bdred/10 font-medium'
              }`}
            >
              {format(day, 'd')}
              {isToday && !isSelected && <span className="text-[6px] leading-none text-gray-400">today</span>}
            </button>
          );
        })}
      </div>
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
    // Auto-set end date to +365 days
    const autoEnd = addDays(day, 365);
    onChange('coverEndDate', autoEnd.toISOString());
  };

  const handleEndSelect = (day) => {
    onChange('coverEndDate', day.toISOString());
  };

  const canProceed = !!startDate && !!endDate;

  return (
    <div className="space-y-3 pb-24">
      <h1 className="font-montserrat font-bold text-xl text-carbon">
        When would you like your cover?
      </h1>

      <DateCalendar
        label="Cover Start Date"
        value={startDate}
        onSelect={handleStartSelect}
        minDate={startMin}
        maxDate={startMax}
        highlight
      />

      <DateCalendar
        label="Cover End Date"
        value={endDate}
        onSelect={handleEndSelect}
        minDate={endMin}
        maxDate={endMax}
        highlight={false}
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