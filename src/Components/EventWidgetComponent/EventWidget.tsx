import React from 'react';
import { Link } from 'react-router-dom';
import './EventWidget.css';

const EventWidget: React.FC = () => {
  return (
    <Link to="/ForumPage" className="event-link">
      <div className="event-widget">
        <div className="event-card">
          <h4>Cosplay Funtime Yeay</h4>
          <p>📅 19 Mei 2023</p>
          <p>🕒 10.00 - 15.00 WIB</p>
          <p>📍 Binus Kampus Anggrek</p>
          <p>👥 Komunitas Wibu Binusian</p>
        </div>
      </div>
    </Link>
  );
};

export default EventWidget;
