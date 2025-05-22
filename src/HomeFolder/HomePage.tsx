import React, { useState, useEffect, useRef  } from 'react';
import NavigationBar from '../Components/NavigationComponent/NavigationBar';
import EventWidget from '../Components/EventWidgetComponent/EventWidget';
import './HomePage.css';
import profile from '../assets/profileLogo.png';
import GetForumService from "../Shared/GetForum/GetForumService";
import upload from '../assets/upload.png';
import event from '../assets/event.png';
import search from '../assets/SearchIcon.svg';
import dots from '../assets/3dot.png';
import Swal from 'sweetalert2';
import ProfileService from '../Shared/Profile/ProfileService';
import { getUserIdFromToken } from '../Utils/jwt';
import { Profile } from '../Shared/Profile/ProfileTypes';

const HomePage: React.FC = () => {  
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [forums, setForums] = useState<any[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [activeMenuPostId, setActiveMenuPostId] = useState<number | null>(null);
  const contextMenuRef = useRef<HTMLDivElement | null>(null);


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


const dummySubjects = [
  { id: 1, name: "Netflix n Chill" },
  { id: 2, name: "Sport" },
  { id: 3, name: "Basketball" },
  { id: 4, name: "Writing" },
  { id: 5, name: "Coding Geeks" },
  { id: 6, name: "JollayBay" },
  { id: 7, name: "Marketing Gods" },
  { id: 8, name: "Gaming" },
  { id: 9, name: "Memes" },
  { id: 10, name: "Night Club" },
];

const Sidebar: React.FC = () => {
  const [subjects, setSubjects] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    setSubjects(dummySubjects);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target as Node)
      ) {
        setActiveMenuPostId(null); // Tutup context menu kalau klik di luar
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  
  
  return (
    <div className="sidebar">

      <div className='sidebar-content'>
          <div className="search-bar">
            
            <img src={search} alt="Search_Icon" className='search-icon'/>

            <input
              type="text"
              className="search-input"
              placeholder="Search"
            />
          </div>

          <div className="subject-collection">
            {subjects.map((subject) => (
              <p key={subject.id} className="subject-name">
                {subject.name}
              </p>
            ))}
          </div>
      </div>

    </div>
  );
};
  

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
  <div className="homepage">
      <NavigationBar />
      <div className="homepage-content">
      <Sidebar />
      
        <div className="main-content">
          <div className='inputForm'>
            <div className='divAtas'>
              <img src={avatarPreview || profile} alt="Profile" className="profile-icon" /> 
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
    forums.map((forum, index) => {
      const user = forum.msuser ?? {
        username: "Username",
        profile_image: profile, 
      };
      const subject = forum.subject_name ?? forum.mssubject?.subject_name;
      const eventName = forum.event_name ?? forum.msevent?.event_name;
      const eventDate = forum.event_date ?? forum.msevent?.event_date;
      const participants = forum.participants ?? forum.total_participants;

      const isEventForum = eventName && eventDate;

      return (
        <div key={forum.post_id ?? index} className="forum-card">
          
          {/* Tampilin user */}
          {user && (
            <div className="forum-user-info">
              <img
                src={user.profile_image ?? profile} // fallback ke default jika null
                alt="User"
                className="user-avatar-small"
              />
              <div className="user-meta">
                <p className="username">{user.username}</p>
                {user.major && <p className="major">{user.major}</p>}
              </div>
              
              <div className="menu-wrapper">
              <button
                className="dots-button"
                onClick={() => setActiveMenuPostId(forum.post_id ?? index)}
              >
                <img src={dots} alt="Options" className="dots-icon" />
              </button>

              {activeMenuPostId === (forum.post_id ?? index) && (
                <div className="context-menu" ref={contextMenuRef}>
                  <button
                    className="context-menu-item"
                    onClick={async () => {
                      const result = await Swal.fire({
                        title: 'Yakin ingin menghapus?',
                        text: "Post ini akan dihapus secara permanen!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#d33',
                        cancelButtonColor: '#3085d6',
                        confirmButtonText: 'Ya, hapus!',
                        cancelButtonText: 'Batal',
                      });

                      if (result.isConfirmed) {
                        console.log("Confirmed delete for post:", forum.post_id ?? index);
                        // TODO: Hapus post dari state atau panggil API di sini
                        await Swal.fire('Dihapus!', 'Post telah dihapus.', 'success');
                      }

                      setActiveMenuPostId(null);
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}

            </div>
            
              
            </div>
          )}

          {/* Forum Biasa */}
          <h4>{forum.title}</h4>
          <p>{forum.description}</p>
          {subject && <p><strong>Subjek:</strong> {subject}</p>}

          {/* Event */}
          {isEventForum ? (
            <div className="event-info">
              <p><strong>Event:</strong> {eventName} ({eventDate})</p>
              <p><strong>Lokasi:</strong> {forum.location_name ?? 'Tidak disebutkan'}</p>
              {participants && <p><strong>Partisipan:</strong> {participants} orang</p>}
            </div>
          ) : (
            <div className="text-forum-content">
              <p>{forum.forum_text}</p>
            </div>
          )}

          <hr />
        </div>
      );
    })
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

      <label htmlFor="event-description">Description:</label>
      <input
        type="text"
        id="event-description"
        className="popup-input"
        placeholder="Where the party at"
      />

      <label htmlFor="event-location">Location:</label>
      <input
        type="text"
        id="event-location"
        className="popup-input"
        placeholder="Enter event location"
      />

      

      <label htmlFor="event-date">Date:</label>
      <input
        type="text"
        id="event-date"
        className="popup-input"
        placeholder="When is the party starting?"
      />


      <label htmlFor="event-capasity">Capasity:</label>
      <input
        type="number"
        id="event-capasity"
        className="popup-input"
        placeholder="How many people?"
      />

      <label htmlFor="event-lantitude">Lantitude:</label>
      <input
        type="number"
        id="event-lantitude"
        className="popup-input"
        placeholder="give the lantitude"
      />

      <label htmlFor="event-longtitude">Longtitude:</label>
      <input
        type="number"
        id="event-longtitude"
        className="popup-input"
        placeholder="give the longtitude"
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
