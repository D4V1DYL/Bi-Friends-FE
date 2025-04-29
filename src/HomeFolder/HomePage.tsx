import React from 'react';
import NavigationBar from '../Components/NavigationComponent/NavigationBar';
import EventWidget from '../Components/EventWidgetComponent/EventWidget';
import './HomePage.css';

const HomePage: React.FC = () => {
  return (
    <div className="homepage">
      <NavigationBar />
      <div className="homepage-content">
        <div className="main-content">
          {/* Forum nanti disini */}
        </div>
        <div className="event-section">
          <h3 className="event-title">EVENT</h3>
          <EventWidget />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
