import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import StepFooter from './StepFooter';
import { format, addDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, isBefore, isAfter, addMonths, subMonths } from 'date-fns';

export default function StepStartDate({ formData, onChange, onNext, onBack }) {
  const today = new Date();
  const maxDate = addDays(today, 60);
  const selected = formData.coverStartDate ? new Date(formData.coverStartDate) : null;
  const [currentMonth, setCurrentMonth] = useState(selected || today);
  const [inputValue, setInputValue] = useState(selected ? format(selected, 'dd/MM/yyyy') : '');

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
        onChange('coverStartDate', parsed.toISOString());
        setCurrentMonth(parsed);
      }
    }
  };

  const handleCalendarSelect = (day) => {
    onChange('coverStartDate', day.toISOString());
    setInputValue(format(day, 'dd/MM/yyyy'));
    setCurrentMonth(day);
  };

  const isDisabled = (day) => {
    return isBefore(day, today) || isAfter(day, maxDate);
  };

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    const dayList = [];
    for (let day = new Date(start); day <= end; day = addDays(day, 1)) {
      dayList.push(new Date(day));
    }
    return dayList;
  }, [currentMonth]);

  return (
    <div className="space-y-1.5 pb-24">
      <h1 className="font-montserrat font-bold text-xl text-carbon">
        When would you like your cover to start?
      </h1>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        {/* Type-in date field */}
        <div className="mb-4">
          <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-2">
            Select a date
          </label>
          <input
            type="text"
            placeholder="dd/mm/yyyy"
            value={inputValue}
            onChange={handleInputChange}
            className="w-full px-3 py-3 border-2 border-bdred rounded-lg font-montserrat text-sm text-carbon focus:border-bdred focus:outline-none"
          />
        </div>

        {/* Month navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-grey100"
          >
            <ChevronLeft className="w-4 h-4 text-carbon" />
          </button>
          <span className="font-montserrat font-bold text-carbon text-sm">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button
            type="button"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-grey100"
          >
            <ChevronRight className="w-4 h-4 text-carbon" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => (
            <div key={d} className="text-center text-[10px] font-montserrat font-medium text-muted-foreground py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => {
            const disabled = isDisabled(day);
            const isSelected = selected && isSameDay(day, selected);
            const isToday = isSameDay(day, today);
            const isCurrentMonth = isSameMonth(day, currentMonth);

            return (
              <button
                key={i}
                type="button"
                disabled={disabled}
                onClick={() => handleCalendarSelect(day)}
                className={`aspect-square flex flex-col items-center justify-center rounded-full text-xs font-montserrat transition-all ${
                  !isCurrentMonth
                    ? 'invisible'
                    : isSelected
                    ? 'bg-bdred text-white font-bold ring-2 ring-bdred ring-offset-1'
                    : isToday && !isSelected
                    ? 'border-2 border-gray-300 text-carbon font-medium'
                    : disabled
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-carbon hover:bg-bdred/10 font-medium'
                }`}
              >
                {format(day, 'd')}
                {isToday && !isSelected && <span className="text-[7px] leading-tight text-gray-400">today</span>}
              </button>
            );
          })}
        </div>
      </div>

      <StepFooter onBack={onBack} onNext={onNext} disabled={!formData.coverStartDate} />
    </div>
  );
}