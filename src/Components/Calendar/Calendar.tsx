import React, { useState, useEffect } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import { DateWithEvents } from './types/calendar';
import { CalendarEvent } from './types/calendar';
import { getCalendarDates } from './utils/calendarUtils';
import EventModal from './EventModal';

interface CalendarProps {
  events: CalendarEvent[];
}

const Calendar: React.FC<CalendarProps> = ({ events }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDates, setCalendarDates] = useState<DateWithEvents[]>([]);
  const [selectedDateInfo, setSelectedDateInfo] = useState<DateWithEvents | null>(null);

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const dates = getCalendarDates(year, month, events);
    setCalendarDates(dates);
  }, [currentDate, events]);

  const handlePrevMonth = () => {
    setCurrentDate(prevDate => {
      const prevMonth = new Date(prevDate);
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      return prevMonth;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prevDate => {
      const nextMonth = new Date(prevDate);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      return nextMonth;
    });
  };

  const handleReset = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (dateInfo: DateWithEvents) => {
    if (dateInfo.events.length > 0) {
      setSelectedDateInfo(dateInfo);
    }
  };

  const handleCloseModal = () => {
    setSelectedDateInfo(null);
  };

  return (
    <div className="calendar-container bg-white rounded-xl shadow-lg p-4 sm:p-6 flex flex-col h-full">
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onReset={handleReset}
      />
      
      <div className="flex-grow">
        <CalendarGrid
          dates={calendarDates}
          onDateClick={handleDateClick}
        />
      </div>
      
      {selectedDateInfo && (
        <EventModal 
          dateInfo={selectedDateInfo} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};

export default Calendar;