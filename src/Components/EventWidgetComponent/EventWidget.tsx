import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './EventWidget.css';

interface EventData {
  post_id: number;
  event_name: string;
  event_date: string;
  start_date?: string;
  end_date?: string;
  mslocation: {
    location_name: string;
    capacity: number;
  };
}

const EventWidget: React.FC = () => {
  const [events, setEvents] = useState<EventData[]>([]);

  useEffect(() => {
    fetch('https://bifriendsbe.bifriends.my.id/Forum/list-events')
      .then((res) => res.json())
      .then((data) => {
        if (data.events && data.events.length > 0) {
          setEvents(data.events);
        }
      })
      .catch((err) => console.error('Error fetching events:', err));
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
    if (!start || !end) return "-";
    const startTime = new Date(start).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Jakarta"
    });
    const endTime = new Date(end).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Jakarta"
    });
    return `${startTime} - ${endTime} WIB`;
  }

  if (events.length === 0) return null;

  return (
    <div className="event-widget">
  {events.map((event, idx) => (
    <Link to={`/forum/${event.post_id}`} className="event-link" key={idx}>
      <div className="event-card">
        <h4>{event.event_name}</h4>
        <p>📅 {formatTanggalIndo(event.event_date)}</p>
        <p>🕒 {formatJamRange(event.start_date, event.end_date)}</p>
        <p>📍 {event.mslocation?.location_name}</p>
        <p>👥 Kapasitas: {event.mslocation?.capacity}</p>
      </div>
    </Link>
  ))}
</div>

  );
};

export default EventWidget;
