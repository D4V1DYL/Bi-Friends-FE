import React, { useState, useEffect } from 'react';
import NavigationBar from '../Components/NavigationComponent/NavigationBar';
import EventWidget from '../Components/EventWidgetComponent/EventWidget';
import './HomePage.css';
import profile from '../assets/profileLogo.png';
import pin from '../assets/pinn.png';
import GetForumService from "../Shared/GetForum/GetForumService";
import upload from '../assets/upload.png';
import event from '../assets/event.png';

const HomePage: React.FC = () => {  
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [forums, setForums] = useState<any[]>([]);
  const [showPopup, setShowPopup] = useState(false);

  const dummyPosts = [
    {
      title: "Belajar bersama Binusian",
      description: "Belajar bareng di Binus University",
      forum_text: "Acara belajar bersama mahasiswa Binusian. Tempat dan waktu akan diumumkan.",
      subject_name: "Belajar",
      event_name: "Study Together",
      event_date: "2025-05-12",
      location_name: "Binus University",
      location_address: "Jl. Kemandoran Raya, Jakarta",
      location_capacity: 100,
      location_latitude: -6.158623,
      location_longitude: 106.734428
    },
    {
      title: "Test Forum 2",
      description: "Ini hanya test doang ges",
      forum_text: "Sekedar testing forum, tidak ada event penting di sini.",
      subject_name: "Yey123",
      event_name: "Study Together",
      event_date: "2005-12-12",
      location_name: "Binus Square",
      location_address: "Binus Square Building, Jakarta",
      location_capacity: 50,
      location_latitude: -6.158123,
      location_longitude: 106.734028
    }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload an image file.');
    }
  };

  useEffect(() => {
    const fetchForums = async () => {
      try {
        const data = await GetForumService.getAllForums();
        console.log("Data dari API:", data);
        setForums(data);
      } catch (error) {
        console.error('Gagal mengambil data forum:', error);
        setForums(dummyPosts);
      }
    };

    fetchForums();
  }, []);

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

              
              {/* Event Icon Button */}
              <button onClick={() => setShowPopup(true)} id="eventPopupButton">
                <img src={event} alt="Event Icon" className="icon" />
              </button>

              {/* Upload Button */}
              <label htmlFor="file-upload" id="eventButton">
                <img src={upload} alt="Upload Icon" className="icon" />
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
              <button id="submitButton">Post</button>
            </div>
          </div>

          <div className="forum-list">
            {forums.length === 0 ? (
              <p>Tidak ada forum untuk ditampilkan</p>
            ) : (
              forums.map((forum, index) => (
                <div key={forum.post_id ?? index} className="forum-card">
                  <h4>{forum.title}</h4>
                  <p>{forum.description}</p>
                  {forum.msuser?.username && (
                    <p><strong>Oleh:</strong> {forum.msuser.username}</p>
                  )}
                  <p><strong>Subjek:</strong> {forum.subject_name ?? forum.mssubject?.subject_name}</p>
                  <p>
                    <strong>Event:</strong> {forum.event_name ?? forum.msevent?.event_name} (
                    {forum.event_date ?? forum.msevent?.event_date})
                  </p>
                  <hr />
                </div>
              ))
            )}
          </div>
        </div>

        <div className="event-section">
          <h3 className="event-title">EVENT</h3>
          <EventWidget />
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h3>Make An Event</h3>

            <label htmlFor="event-name">Event Name:</label>
            <input
              type="text"
              id="event-name"
              className="popup-input"
              placeholder="Enter event name"
            />

            <label htmlFor="event-location">Location:</label>
            <input
              type="text"
              id="event-location"
              className="popup-input"
              placeholder="Enter event location"
            />

            <label htmlFor="event-description">Description:</label>
            <input
              type="text"
              id="event-description"
              className="popup-input"
              placeholder="Where the party at"
            />

            <div className="popup-buttons">
              <button className="cancel-button" onClick={() => setShowPopup(false)}>
                Close
              </button>

              <button className="submit-button" onClick={() => setShowPopup(false)}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}




    </div>
  );
};

export default HomePage;
