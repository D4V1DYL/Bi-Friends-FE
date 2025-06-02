import { CalendarEvent, DateWithEvents } from '../types/calendar';

export const getCalendarDates = (year: number, month: number, events: CalendarEvent[]): DateWithEvents[] => {
  const today = new Date();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysFromPrevMonth = firstDayOfWeek;
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  
  const calendarDates: DateWithEvents[] = [];
  
  // Add days from previous month
  for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, prevMonthLastDay - i);
    calendarDates.push({
      date,
      events: getEventsForDate(date, events),
      isCurrentMonth: false,
      isToday: isSameDay(date, today)
    });
  }
  
  // Add days from current month
  for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
    const date = new Date(year, month, day);
    calendarDates.push({
      date,
      events: getEventsForDate(date, events),
      isCurrentMonth: true,
      isToday: isSameDay(date, today)
    });
  }
  
  // Add days from next month
  const remainingDays = 42 - calendarDates.length;
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(year, month + 1, day);
    calendarDates.push({
      date,
      events: getEventsForDate(date, events),
      isCurrentMonth: false,
      isToday: isSameDay(date, today)
    });
  }
  
  return calendarDates;
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const getEventsForDate = (date: Date, events: CalendarEvent[]): CalendarEvent[] => {
  return events.filter(event => isSameDay(event.date, date));
};

export const formatMonthYear = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

export const getDayNames = (): string[] => {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
};