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
import deleteIcon from '../assets/delete.png';
import { getUserIdFromToken } from '../Utils/jwt';
import { Profile } from '../Shared/Profile/ProfileTypes';
// import ChatService from '../Shared/Chat/ChatService';

const HomePage: React.FC = () => {  
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [activeMenuPostId, setActiveMenuPostId] = useState<number | null>(null);
  const contextMenuRef = useRef<HTMLDivElement | null>(null);
  const [forums, setForums] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("All");

  const handleDeleteForum = async (forumId: number) => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token') || '';
    try {
      const result = await Swal.fire({
        title: 'Yakin ingin menghapus?',
        text: 'Forum ini akan dihapus permanen!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal'
      });

      if (result.isConfirmed) {
        await GetForumService.deleteForum(forumId, token);
        setForums(prevForums => prevForums.filter(forum => forum.post_id !== forumId));
        Swal.fire('Dihapus!', 'Forum berhasil dihapus.', 'success');
      }
    } catch (error) {
      console.error('Gagal menghapus forum:', error);
      Swal.fire('Gagal!', 'Forum gagal dihapus.', 'error');
    }
  };

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

  const handleEventSubmit = async () => {
    const name = (document.getElementById('event-name') as HTMLInputElement)?.value;
    const text = (document.getElementById('event-description') as HTMLTextAreaElement)?.value;
    const subjectId = parseInt((document.getElementById('event-subject') as HTMLSelectElement)?.value);
    const location = (document.getElementById('event-location') as HTMLInputElement)?.value;
    const address = (document.getElementById('event-address') as HTMLInputElement)?.value;
    const date = (document.getElementById('event-date') as HTMLInputElement)?.value;
    const startDate = (document.getElementById('event-start-time') as HTMLInputElement)?.value;
    const endDate = (document.getElementById('event-end-time') as HTMLInputElement)?.value;
    const capacity = parseInt((document.getElementById('event-capasity') as HTMLInputElement)?.value || '0');
    const latitude = parseFloat((document.getElementById('event-latitude') as HTMLInputElement)?.value || '0');
    const longitude = parseFloat((document.getElementById('event-longtitude') as HTMLInputElement)?.value || '0');

    const payload = {
    title: name, // sudah sesuai
    description: text, // untuk msforum
    forum_text: text,  // untuk msisi_forum
    subject_id: subjectId,
    event_name: name,
    event_date: date,
    start_date: startDate,
    end_date: endDate,
    location_name: location,
    location_address: address,
    location_capacity: capacity,
    location_latitude: latitude,
    location_longitude: longitude,
  };

    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token') || '';
      const response = await fetch('https://bifriendsbe.bifriends.my.id/Forum/create_forum', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to create event');
      }

      Swal.fire('Sukses!', 'Event berhasil dibuat.', 'success');
      setShowPopup(false);
    } catch (error) {
      console.error(error);
      Swal.fire('Gagal!', 'Terjadi kesalahan saat membuat event.', 'error');
    }
  };

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
  const fetchForums = async () => {
    setIsLoading(true); // mulai loading
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token') || '';
      const allForums = await GetForumService.getAllForums(token);
      setForums(allForums);
    } catch (error) {
      console.error("Error fetching forums:", error);
    } finally {
      setIsLoading(false); // selesai loading
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
  {id: 11, name: "All"}
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
              <p
                key={subject.id}
                className="subject-name"
                style={{
                  fontWeight: selectedSubject === subject.name ? 'bold' : 'normal',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedSubject(subject.name)}
              >
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
  {isLoading ? (
    <p>Loading forums...</p>
  ) : (() => {
    const filteredForums = forums.filter(
      (forum) =>
        selectedSubject === "All" || forum.mssubject?.subject_name === selectedSubject
    );

    if (filteredForums.length === 0) {
      return <p style={{ padding: "1rem", textAlign: "center" }}>Tidak ada forum untuk ditampilkan</p>;
    }

    return filteredForums.map((forum, index) => {
      if (!forum || (!forum.title && !forum.description && !forum.event_name)) {
        return null;
      }

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
          <img
            src={deleteIcon}
            alt="Delete Forum"
            className="delete-icon"
            onClick={() => handleDeleteForum(forum.post_id)}
          />

          {/* User Info */}
          {user && (
            <div className="forum-user-info">
              <img
                src={user.profile_image ?? profile}
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
                  onClick={() =>
                    setActiveMenuPostId(forum.post_id ?? index)
                  }
                >
                  <img src={dots} alt="Options" className="dots-icon" />
                </button>

                {activeMenuPostId === (forum.post_id ?? index) && (
                  <div className="context-menu" ref={contextMenuRef}>
                    <button
                      className="context-menu-item"
                      onClick={async () => {
                        const result = await Swal.fire({
                          title: "Yakin ingin menghapus?",
                          text: "Post ini akan dihapus secara permanen!",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonColor: "#d33",
                          cancelButtonColor: "#3085d6",
                          confirmButtonText: "Ya, hapus!",
                          cancelButtonText: "Batal",
                        });

                        if (result.isConfirmed) {
                          await handleDeleteForum(forum.post_id);
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
          <p style={{ whiteSpace: 'pre-line' }}>{forum.description}</p>
          {subject && (
            <p>
              <strong>Subjek:</strong> {subject}
            </p>
          )}

          {/* Event */}
          {isEventForum ? (
            <div className="event-info">
              <p>
                <strong>Event:</strong> {eventName} ({eventDate})
              </p>
              <p>
                <strong>Lokasi:</strong>{" "}
                {forum.msevent?.mslocation?.location_name ?? "Tidak disebutkan"}
              </p>
              {participants && (
                <p>
                  <strong>Partisipan:</strong> {participants} orang
                </p>
              )}
            </div>
          ) : (
            <div className="text-forum-content">
              <p>{forum.forum_text}</p>
            </div>
          )}

          <hr />
        </div>
      );
    });
  })()}
</div>

        </div>

        <div className="event-section">
          <h3 className="event-title">EVENT</h3>
          <EventWidget />
        </div>
      </div>

      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-content wide-popup wider-popup" onClick={(e) => e.stopPropagation()}>
            <h3 className="popup-title">Make An Event</h3>

            <div className="event-details-grid">
              <label htmlFor="event-name">Event Name</label>
              <input type="text" id="event-name" className="popup-input" placeholder="What should we call this awesome event?" />

              <label htmlFor="event-description">Description</label>
              <textarea id="event-description" className="popup-input" placeholder="What’s this event all about?" rows={4} style={{ resize: 'vertical' }} />

              <label htmlFor="event-subject">Subject</label>
              <select id="event-subject" className="popup-input">
                {dummySubjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
                ))}
              </select>

              <label htmlFor="event-location">Location</label>
              <input type="text" id="event-location" className="popup-input" placeholder="Where will the magic happen?" />

              <label htmlFor="event-address">Address</label>
              <input type="text" id="event-address" className="popup-input" placeholder="Specific location address" />

              <label htmlFor="event-date">Date & Time Details</label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <label htmlFor="event-date" style={{ fontSize: '12px', marginBottom: '4px', marginLeft: '4px' }}>Date</label>
                  <input type="date" id="event-date" className="popup-input" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <label htmlFor="event-start-time" style={{ fontSize: '12px', marginBottom: '4px', marginLeft: '4px' }}>Start Time</label>
                  <input type="time" id="event-start-time" className="popup-input" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <label htmlFor="event-end-time" style={{ fontSize: '12px', marginBottom: '4px', marginLeft: '4px' }}>End Time</label>
                  <input type="time" id="event-end-time" className="popup-input" />
                </div>
              </div>

              <label htmlFor="event-capasity">Capacity</label>
              <input
                type="number"
                id="event-capasity"
                className="popup-input"
                placeholder="Max number of people allowed"
                min="0"
              />

              <label>Coordinates</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <label htmlFor="event-latitude" style={{ fontSize: '12px', marginBottom: '4px', marginLeft: '4px' }}>Latitude</label>
                    <input type="number" id="event-latitude" className="popup-input" placeholder="Drop the latitude pin" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <label htmlFor="event-longtitude" style={{ fontSize: '12px', marginBottom: '4px', marginLeft: '4px' }}>Longitude</label>
                    <input type="number" id="event-longtitude" className="popup-input" placeholder="And the longitude too" />
                  </div>
                </div>
              </div>

            <div className="popup-buttons">
              <button className="cancel-button" onClick={() => setShowPopup(false)}>Close</button>
              <button className="submit-button" onClick={handleEventSubmit}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
