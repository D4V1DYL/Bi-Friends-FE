import React from 'react';
import NavigationBar from '../Components/NavigationComponent/NavigationBar';
import EventWidget from '../Components/EventWidgetComponent/EventWidget';
import './HomePage.css';
import profile from '../assets/profileLogo.png';

const HomePage: React.FC = () => {
  return (
    <div className="homepage">
      <NavigationBar />
      <div className="homepage-content">
        <div className="main-content">




          <div className='inputForm'>
          
            <div className='divAtas'>

              <img src={profile} 
                alt="Profile"
                className="profile-icon">
              </img>
              <input type="text" id="textinput" placeholder="What's new?" />

            </div>
            
            <div className='divBawah'>
              <button id="submitButton">post</button>
            </div>

          </div>





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
