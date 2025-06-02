import React, { useEffect, useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import NavigationBar from '../Components/NavigationComponent/NavigationBar';
import Calendar, { CalendarEvent } from '../Components/Calendar';

const CalenderPage: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://bifriendsbe.bifriends.my.id/Forum/list-events')
      .then((res) => res.json())
      .then((data) => {
        if (data.events && Array.isArray(data.events)) {
          const mapped: CalendarEvent[] = data.events.map((ev: any, idx: number) => {
            // Parse start and end time (if available)
            const start = ev.start_date ? new Date(ev.start_date) : null;
            const end = ev.end_date ? new Date(ev.end_date) : null;
            // Format time as HH:mm (24h)
            const formatTime = (d: Date | null) => d ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : undefined;
            return {
              id: String(idx + 1),
              title: ev.event_name,
              date: ev.event_date ? new Date(ev.event_date) : (start || new Date()),
              startTime: formatTime(start),
              endTime: formatTime(end),
              description: undefined, // You can map description if available
              location: ev.mslocation?.location_name,
              color: '#81BFDA', // You can randomize or assign color if needed
              related_post_id: ev.related_post_id,
            };
          });
          setEvents(mapped);
        }
      })
      .catch((err) => console.error('Error fetching events:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#B1F0F7]/10 to-[#F5F0CD]/20">
      <NavigationBar />
      <div className="h-screen flex flex-col p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <header className="mb-4 sm:mb-6 text-center flex-shrink-0">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CalendarIcon size={28} className="text-[#81BFDA]" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Calendar</h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto">
            View and manage your schedule. Click on dates with events to see details.
          </p>
        </header>
        {/* Calendar Component */}
        <div className="flex-grow flex flex-col">
          {loading ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">Loading events...</div>
          ) : (
            <Calendar events={events} />
          )}
        </div>
        {/* Footer */}
        <footer className="mt-4 text-center text-gray-500 text-xs sm:text-sm flex-shrink-0">
          <p>© 2025 Bi-Friends. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default CalenderPage; 