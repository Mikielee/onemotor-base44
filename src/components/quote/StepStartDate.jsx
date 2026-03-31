import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, isBefore, isAfter, addMonths, subMonths } from 'date-fns';
import PillButton from './PillButton';

export default function StepStartDate({ formData, onChange, onNext }) {
  const tomorrow = addDays(new Date(), 1);
  const maxDate = addDays(new Date(), 120);
  const selected = formData.coverStartDate ? new Date(formData.coverStartDate) : null;
  const [currentMonth, setCurrentMonth] = useState(selected || tomorrow);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
    const result = [];
    let day = start;
    while (day <= end) {
      result.push(new Date(day));
      day = addDays(day, 1);
    }
    return result;
  }, [currentMonth]);

  const isDisabled = (day) => {
    return isBefore(day, tomorrow) || isAfter(day, maxDate) || !isSameMonth(day, currentMonth);
  };

  return (
    <div className="space-y-4">
      <h1 className="font-montserrat font-bold text-xl text-carbon">
        When would you like your cover to start?
      </h1>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
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
            const isCurrentMonth = isSameMonth(day, currentMonth);

            return (
              <button
                key={i}
                type="button"
                disabled={disabled}
                onClick={() => onChange('coverStartDate', day.toISOString())}
                className={`aspect-square flex items-center justify-center rounded-full text-xs font-montserrat transition-all ${
                  !isCurrentMonth
                    ? 'invisible'
                    : isSelected
                    ? 'bg-bdred text-white font-bold'
                    : disabled
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-carbon hover:bg-bdred/10 font-medium'
                }`}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>
      </div>

      {selected && (
        <p className="text-center text-sm font-montserrat text-carbon">
          Cover starts: <span className="font-bold">{format(selected, 'dd MMMM yyyy')}</span>
        </p>
      )}

      <div className="pt-2">
        <PillButton onClick={onNext} disabled={!formData.coverStartDate}>
          Continue
        </PillButton>
      </div>
    </div>
  );
}