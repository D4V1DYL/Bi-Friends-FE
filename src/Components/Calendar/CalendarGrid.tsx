import React from 'react';
import { DateWithEvents } from './types/calendar';
import { getDayNames } from './utils/calendarUtils';


interface CalendarGridProps {
  dates: DateWithEvents[];
  onDateClick: (date: DateWithEvents) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ dates, onDateClick }) => {
  const dayNames = getDayNames();

  return (
    <div className="calendar-grid h-full flex flex-col">
      <div className="grid grid-cols-7 mb-2">
        {dayNames.map((day) => (
          <div 
            key={day} 
            className="text-center py-2 text-xs sm:text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 flex-grow">
        {dates.map((dateInfo, index) => {
          const { date, events, isCurrentMonth, isToday } = dateInfo;
          
          return (
            <div
              key={index}
              className={`
                relative flex flex-col p-1 transition-all duration-200
                ${isCurrentMonth ? 'bg-white' : 'bg-gray-50/50 text-gray-400'}
                ${isToday ? 'ring-2 ring-[#81BFDA]' : ''}
                ${events.length > 0 ? 'cursor-pointer hover:bg-[#B1F0F7]/10' : 'cursor-default'}
              `}
              onClick={() => events.length > 0 && onDateClick(dateInfo)}
            >
              <span className={`
                text-xs sm:text-sm font-medium self-start rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center
                ${isToday ? 'bg-[#81BFDA] text-white' : ''}
              `}>
                {date.getDate()}
              </span>
              
              <div className="mt-auto flex flex-wrap gap-0.5 justify-center">
                {events.length > 0 && (
                  <div className="flex gap-0.5 mt-1 justify-center">
                    {events.slice(0, 3).map((event, i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
                        style={{ backgroundColor: event.color }}
                        title={event.title}
                      />
                    ))}
                    {events.length > 3 && (
                      <div className="text-xs text-gray-500 font-medium">
                        +{events.length - 3}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid