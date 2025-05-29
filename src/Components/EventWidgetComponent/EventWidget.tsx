import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './EventWidget.css';

interface EventData {
  event_name: string;
  event_date: string;
  start_time?: string;
  end_time?: string;
  mslocation: {
    location_name: string;
    capacity: number;
  };
}

const EventWidget: React.FC = () => {
  const [event, setEvent] = useState<EventData | null>(null);

  useEffect(() => {
    fetch('http://localhost:8000/Forum/list-events')
      .then((res) => res.json())
      .then((data) => {
        if (data.events && data.events.length > 0) {
          setEvent(data.events[0]); // Ambil event pertama
        }
      })
      .catch((err) => console.error('Error fetching event:', err));
  }, []);

  function formatTanggalIndo(dateStr: string): string {
    const bulan = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const date = new Date(dateStr);
    return `${date.getDate()} ${bulan[date.getMonth()]} ${date.getFullYear()}`;
  }

  function formatJamRange(start?: string, end?: string): string {
    if (!start || !end) return "-"; // default fallback
    const format = (time: string) => time.slice(0, 5);
    return `${format(start)} - ${format(end)} WIB`;
  }

  if (!event) return null;

  return (
    <Link to="/ForumPage" className="event-link">
      <div className="event-widget">
        <div className="event-card">
          <h4>{event.event_name}</h4>
          <p>📅 {formatTanggalIndo(event.event_date)}</p>
          <p>🕒 {formatJamRange(event.start_time, event.end_time)}</p>
          <p>📍 {event.mslocation?.location_name}</p>
          <p>👥 Kapasitas: {event.mslocation?.capacity}</p>
        </div>
      </div>
    </Link>
  );
};

export default EventWidget;
