import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatMonthYear } from './utils/calendarUtils';

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onReset: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onReset
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 
        className="text-2xl font-semibold text-gray-800 cursor-pointer" 
        onClick={onReset}
      >
        {formatMonthYear(currentDate)}
      </h2>
      <div className="flex space-x-2">
        <button
          className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          onClick={onPrevMonth}
          aria-label="Previous month"
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        <button
          className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          onClick={onNextMonth}
          aria-label="Next month"
        >
          <ChevronRight size={20} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default CalendarHeader