import React from 'react';
import { Link } from 'react-router-dom';
import chatLogo from '../../assets/chatLogo.svg';
import beeLogo from '../../assets/Logo_Text2.svg';
import calenderLogo from '../../assets/Calender.svg';
import notificationLogo from '../../assets/notificationLogo.svg';
import profileLogo from '../../assets/profileLogo.png';
import './NavigationBar.css';
import ProfileService from '../../Shared/Profile/ProfileService';
import { getUserIdFromToken } from '../../Utils/jwt';
import { Profile } from '../../Shared/Profile/ProfileTypes';
import { useState, useEffect } from 'react';

const NavigationBar: React.FC = () => {

      const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
      const token = sessionStorage.getItem('token') || localStorage.getItem('token') || '';
      const userId = getUserIdFromToken(token);

      useEffect(() => {
        if (userId && token) {
          const fetchData = async () => {
            try {
              const res = await ProfileService.getProfile(userId, token);
              const data: Profile = res.data;

              setAvatarPreview(data.profile_picture);
            } catch (error) {
              console.error('Failed to fetch profile:', error);
            }
          };

          fetchData();
        }
      }, [userId, token]);

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
          <img src={avatarPreview || profileLogo} alt="Profile" className="nav-avatar" />
        </Link>
      </div>
    </div>
  );
};

export default NavigationBar;
