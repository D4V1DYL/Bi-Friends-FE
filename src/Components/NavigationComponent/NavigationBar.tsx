import React from 'react';
import { Link } from 'react-router-dom';
import chatLogo from '../../assets/chatLogo.svg';
import beeLogo from '../../assets/logo.webp';
import calenderLogo from '../../assets/Calender.svg';
import notificationLogo from '../../assets/notificationLogo.svg';
import profileLogo from '../../assets/profileLogo.png';
import './NavigationBar.css';

const user = {
    profileImage: null // Nanti isi value profile user udah diupload
  };

const NavigationBar: React.FC = () => {

    const defaultProfileImage = profileLogo; 
    const profileImage = user.profileImage ? user.profileImage : defaultProfileImage;

  return (
    <div className="navigation-bar">
      <div className="nav-left">
        <img src={beeLogo} alt="Bi-Friends Logo" className="nav-logo" />
      </div>

      <div className="nav-right">
        <Link to ="/ChatPage">
            <img src={chatLogo} alt="Messages" className="nav-icon" id='chat-logo'/>
        </Link>
        
        <Link to ="/CalenderPage">
            <img src={calenderLogo} alt="Calender" className="nav-icon" id='calender-logo'/>
        </Link>

            <img src={notificationLogo} alt="Notifications" className="nav-icon" id='notification-logo'/>
        
        <Link to="/ProfilePage">
          <img src={profileImage} alt="Profile" className="nav-avatar" />
        </Link>
      </div>
    </div>
  );
};

export default NavigationBar;
