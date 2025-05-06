import React, { useState } from 'react';
import NavigationBar from '../Components/NavigationComponent/NavigationBar';
import EventWidget from '../Components/EventWidgetComponent/EventWidget';
import './HomePage.css';
import profile from '../assets/profileLogo.png';
import pin from '../assets/pinn.png';

const HomePage: React.FC = () => {
  const [media, setMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image')) { // Pastikan hanya gambar yang diterima
      setMedia(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // Menangani jika file bukan gambar
      alert('Please upload an image file.');
    }
  };

  return (
    <div className="homepage">
      <NavigationBar />
      <div className="homepage-content">
        <div className="main-content">
          <div className='inputForm'>
            <div className='divAtas'>
              <img src={profile} alt="Profile" className="profile-icon" />
              <textarea
                id="textinput"
                placeholder="What's new?"
                rows={1}
                maxLength={250}
                onInput={(e) => {
                  e.currentTarget.style.height = "auto";
                  e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                }}
              ></textarea>

              
              <label htmlFor="file-upload" id="eventButton">
                <img src={pin} alt="Event Icon" className="icon" />
              </label>
              <input
                type="file"
                id="file-upload"
                accept="image/*"  
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>

            {mediaPreview && (
              <div className="media-preview">
                <img src={mediaPreview} alt="Preview" className="media-thumbnail" />
              </div>
            )}

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
