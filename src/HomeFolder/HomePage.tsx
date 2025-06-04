import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import NavigationBar from '../Components/NavigationComponent/NavigationBar';
import EventWidget from '../Components/EventWidgetComponent/EventWidget';
import './HomePage.css';
import profile from '../assets/profileLogo.png';
import GetForumService from "../Shared/GetForum/GetForumService";
import eventIcon from '../assets/event.png';
import Swal from 'sweetalert2';
import ProfileService from '../Shared/Profile/ProfileService';
import deleteIcon from '../assets/delete.png';
import { getUserIdFromToken } from '../Utils/jwt';
import { Profile } from '../Shared/Profile/ProfileTypes';
import { useNavigate } from 'react-router-dom';
import { Paperclip } from 'lucide-react';

interface Forum {
  post_id: number;
  user_id: number;
  created_at: string;
  subject_id: number | null;
  event_id: number | null;
  title: string;
  description: string;
  msuser: {
    username: string;
    profile_picture: string | null;
    major?: string;
  };
  mssubject: {
    subject_name: string;
  } | null;
  msevent: {
    event_name: string;
    event_date: string;
    start_date: string;
    end_date: string;
    location: {
      location_name: string;
    };
  } | null;
  msisi_forum: Array<{
    forum_text: string;
    attachment: string | null;
  }>;
}

const HomePage: React.FC = () => {
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [forums, setForums] = useState<Forum[]>([]);
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [titleText, setTitleText] = useState("");
  const [descriptionText, setDescriptionText] = useState("");
  const [selectedPostSubject, setSelectedPostSubject] = useState<number | "">("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const token = sessionStorage.getItem('token') || localStorage.getItem('token') || '';
  const userId = getUserIdFromToken(token);
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(true);

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
    { id: 11, name: "All" }
  ];

  // 1. Fetch semua forum, lalu simpan array yang benar ke state
  useEffect(() => {
    const fetchForums = async () => {
      setIsLoading(true);
      try {
        const res = await GetForumService.getAllForums(token);
        const maybeArray1 = Array.isArray((res as any).data?.data) ? (res as any).data.data : null;
        const maybeArray2 = Array.isArray((res as any).data) ? (res as any).data : null;
        const maybeArray3 = Array.isArray(res) ? res : null;

        const forumList: Forum[] =
          (maybeArray1 as Forum[]) ||
          (maybeArray2 as Forum[]) ||
          (maybeArray3 as Forum[]) ||
          [];

        setForums(forumList);
      } catch (error) {
        console.error("Error fetching forums:", error);
        setForums([]); // guard
      } finally {
        setIsLoading(false);
      }
    };

    fetchForums();
  }, [token]);

  // 2. Fetch profil user
  useEffect(() => {
    if (userId && token) {
      const fetchProfile = async () => {
        try {
          const data: Profile = await ProfileService.getProfile(userId, token);
          setProfileData(data);
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        }
      };
      fetchProfile();
    }
  }, [userId, token]);

  const handleDeleteForum = async (forumId: number) => {
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
        setForums(prev => prev.filter(f => f.post_id !== forumId));
        await Swal.fire('Dihapus!', 'Forum berhasil dihapus.', 'success');
      }
    } catch (error) {
      console.error('Gagal menghapus forum:', error);
      Swal.fire('Gagal!', 'Forum gagal dihapus.', 'error');
    }
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setMediaPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setMediaPreview(`File selected: ${file.name}`);
      }
    } else {
      setSelectedFile(null);
      setMediaPreview(null);
    }
  };

  const handlePostSubmit = async () => {
    if (!titleText.trim() || !descriptionText.trim()) {
      await Swal.fire({
        icon: "warning",
        title: "Oops!",
        text: "Judul dan deskripsi wajib diisi.",
      });
      return;
    }

    const formData = new FormData();
    formData.append('title', titleText);
    formData.append('description', descriptionText);
    if (selectedPostSubject) {
      formData.append('subject_id', String(selectedPostSubject));
    }
    if (selectedFile) {
      formData.append('attachment', selectedFile);
    }
    formData.append('forum_text', descriptionText);

    try {
      const response = await fetch('https://bifriendsbe.bifriends.my.id/Forum/create_forum', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) throw new Error("Gagal post");

      await Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Post berhasil dikirim.",
      });

      // Reset field
      setTitleText("");
      setDescriptionText("");
      setMediaPreview(null);
      setSelectedPostSubject("");
      setSelectedFile(null);

      // Refetch forums setelah berhasil post
      const res = await GetForumService.getAllForums(token);
      const maybeArray1 = Array.isArray((res as any).data?.data) ? (res as any).data.data : null;
      const maybeArray2 = Array.isArray((res as any).data) ? (res as any).data : null;
      const maybeArray3 = Array.isArray(res) ? res : null;
      const forumList: Forum[] = (maybeArray1 as Forum[]) || (maybeArray2 as Forum[]) || (maybeArray3 as Forum[]) || [];
      setForums(forumList);
    } catch (error) {
      console.error(error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Terjadi kesalahan saat mengirim post.",
      });
    }
  };

  const handleEventSubmit = async () => {
    // Ambil semua nilai dari field input
    const name = (document.getElementById('event-name') as HTMLInputElement)?.value || "";
    const text = (document.getElementById('event-description') as HTMLTextAreaElement)?.value || "";

    const subjectIdRaw = (document.getElementById('event-subject') as HTMLSelectElement)?.value;
    const subjectId = subjectIdRaw === "" ? null : parseInt(subjectIdRaw, 10);

    const locationName = (document.getElementById('event-location') as HTMLInputElement)?.value || "";
    const locationAddress = (document.getElementById('event-address') as HTMLInputElement)?.value || "";

    const date = (document.getElementById('event-date') as HTMLInputElement)?.value || "";
    const startDate = (document.getElementById('event-start-time') as HTMLInputElement)?.value || "";
    const endDate = (document.getElementById('event-end-time') as HTMLInputElement)?.value || "";

    const capacityRaw = (document.getElementById('event-capasity') as HTMLInputElement)?.value;
    const capacity = capacityRaw === "" ? null : parseInt(capacityRaw, 10);

    const latitudeRaw = (document.getElementById('event-latitude') as HTMLInputElement)?.value;
    const latitude = latitudeRaw === "" ? null : parseFloat(latitudeRaw);

    const longitudeRaw = (document.getElementById('event-longtitude') as HTMLInputElement)?.value;
    const longitude = longitudeRaw === "" ? null : parseFloat(longitudeRaw);

    // Buat FormData untuk dikirim
    const formData = new FormData();
    formData.append('title', name);
    formData.append('description', text);
    formData.append('forum_text', text);
    if (subjectId !== null) {
      formData.append('subject_id', String(subjectId));
    }
    formData.append('event_name', name);
    formData.append('event_date', date);
    formData.append('start_date', startDate);
    formData.append('end_date', endDate);
    formData.append('location_name', locationName);
    formData.append('location_address', locationAddress);
    if (capacity !== null) {
      formData.append('location_capacity', String(capacity));
    }
    if (latitude !== null) {
      formData.append('location_latitude', String(latitude));
    }
    if (longitude !== null) {
      formData.append('location_longitude', String(longitude));
    }

    // Jika ingin menambahkan lampiran file pada event, tambahkan <input type="file" id="event-attachment" />
    // const eventFile = (document.getElementById('event-attachment') as HTMLInputElement)?.files?.[0];
    // if (eventFile) {
    //   formData.append('attachment', eventFile);
    // }

    try {
      const response = await fetch('https://bifriendsbe.bifriends.my.id/Forum/create_forum', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
          // Jangan set Content-Type di sini, biarkan browser menambahkan boundary-nya secara otomatis
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to create event');
      }

      await Swal.fire('Sukses!', 'Event berhasil dibuat.', 'success');
      setShowPopup(false);

      // Refetch forums supaya event baru muncul
      const res = await GetForumService.getAllForums(token);
      const maybeArray1 = Array.isArray((res as any).data?.data) ? (res as any).data.data : null;
      const maybeArray2 = Array.isArray((res as any).data) ? (res as any).data : null;
      const maybeArray3 = Array.isArray(res) ? res : null;
      const forumList: Forum[] = (maybeArray1 as Forum[]) || (maybeArray2 as Forum[]) || (maybeArray3 as Forum[]) || [];
      setForums(forumList);
    } catch (error) {
      console.error(error);
      await Swal.fire('Gagal!', 'Terjadi kesalahan saat membuat event.', 'error');
    }
  };

  // Sidebar untuk filter subject
  const Sidebar: React.FC = () => {
    const [subjects, setSubjects] = useState<{ id: number; name: string }[]>([]);
    useEffect(() => { setSubjects(dummySubjects); }, []);
    return (
      <div className="sidebar">
        <div className="sidebar-content">
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

  return (
    <div className="homepage">
      <NavigationBar />

      <div className="layout-container">
        <aside className="sidebar-area">
          <Sidebar />
        </aside>

        <main className="forum-area">
          <section className="post-creator">
            <div className="inputForm">
              <div className="divAtas" style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <img
                  src={profileData?.profile_picture || profile}
                  alt="Profile"
                  className="profile-icon"
                />
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <textarea
                    id="textinput"
                    placeholder="Write your title here..."
                    rows={1}
                    maxLength={100}
                    value={titleText}
                    onChange={(e) => setTitleText(e.target.value)}
                    onInput={(e) => {
                      e.currentTarget.style.height = "auto";
                      e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                    }}
                    style={{ marginBottom: 8 }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileSelect}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 rounded-full hover:bg-gray-200 transition"
                    title="Attach file"
                  >
                    <Paperclip size={20} />
                  </button>
                  <button
                    onClick={() => setShowPopup(true)}
                    id="eventPopupButton"
                    className="p-2 rounded-full hover:bg-gray-200 transition"
                    title="Create Event"
                  >
                    <img src={eventIcon} alt="Event Icon" className="icon" />
                  </button>
                </div>
              </div>

              <textarea
                id="descinput"
                placeholder="Write your description here..."
                rows={2}
                maxLength={500}
                value={descriptionText}
                onChange={(e) => setDescriptionText(e.target.value)}
                onInput={(e) => {
                  e.currentTarget.style.height = "auto";
                  e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                }}
                style={{ marginBottom: 8 }}
              />

              {mediaPreview && (
                <div className="media-preview mt-2">
                  {selectedFile?.type.startsWith('image/') ? (
                    <img
                      src={mediaPreview}
                      alt="Preview"
                      className="media-thumbnail max-h-40 object-cover rounded"
                    />
                  ) : (
                    <p className="text-gray-600 text-sm">{mediaPreview}</p>
                  )}
                </div>
              )}

              <div className="divBawah" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <select
                  className="p-2 rounded border border-gray-200"
                  style={{ minWidth: 120, maxWidth: 180, background: 'white', fontSize: 14 }}
                  value={selectedPostSubject}
                  onChange={e => setSelectedPostSubject(e.target.value ? Number(e.target.value) : "")}
                >
                  <option value="">Select subject...</option>
                  {dummySubjects
                    .filter(s => s.name !== 'All')
                    .map(subject => (
                      <option key={subject.id} value={subject.id}>{subject.name}</option>
                    ))}
                </select>
                <button id="submitButton" onClick={handlePostSubmit}>Post</button>
              </div>
            </div>
          </section>

          <section className="forum-feed">
            <div className="forum-list">
              {isLoading ? (
                <p>Loading forums...</p>
              ) : (() => {
                const filteredForums =
                  Array.isArray(forums) 
                    ? forums.filter(forum =>
                        selectedSubject === "All" ||
                        forum.mssubject?.subject_name === selectedSubject
                      )
                    : [];

                if (filteredForums.length === 0) {
                  return <p style={{ padding: "1rem", textAlign: "center" }}>No forums are available</p>;
                }

                return filteredForums.map((forum) => {
                  if (!forum || (!forum.title && !forum.description && !forum.msevent)) {
                    return null;
                  }

                  const creatorId = Number(forum.user_id);
                  const currentUserId = Number(userId);
                  const isOwner = creatorId === currentUserId;

                  const user = {
                    username: forum.msuser?.username || "Anonymous",
                    profile_image: forum.msuser?.profile_picture || profile,
                    major: forum.msuser?.major || ""
                  };

                  const subjectName = forum.mssubject?.subject_name;
                  const isEventForum = !!forum.msevent;
                  const eventName = forum.msevent?.event_name;
                  const eventDate = forum.msevent?.event_date;
                  const participants = (forum as any).participants || (forum as any).total_participants;

                  return (
                    <div
                      key={forum.post_id}
                      className="forum-card"
                      onClick={() => navigate(`/forum/${forum.post_id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      {isOwner && (
                        <img
                          src={deleteIcon}
                          alt="Delete Forum"
                          className="delete-icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteForum(forum.post_id);
                          }}
                        />
                      )}

                      {/* User Info */}
                      <div className="forum-user-info">
                        <img
                          src={user.profile_image}
                          alt="User"
                          className="user-avatar-small"
                          style={{ cursor: "pointer" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (forum.user_id) {
                              navigate(`/OtherPersonPage/${forum.user_id}`);
                            }
                          }}
                        />
                        <div className="user-meta">
                          <p className="username">{user.username}</p>
                          {user.major && <p className="major">{user.major}</p>}
                        </div>
                      </div>

                      {/* Title & Description */}
                      <h4>{forum.title}</h4>
                      <p style={{ whiteSpace: 'pre-line' }}>{forum.description}</p>

                      {/* Subject */}
                      {subjectName && (
                        <p>
                          <strong>Subject:</strong> {subjectName}
                        </p>
                      )}

                      {/* Jika ini event forum */}
                      {isEventForum && forum.msevent ? (
                        <div className="event-info">
                          <p>
                            <strong>Event:</strong> {eventName} ({eventDate})
                          </p>
                          <p>
                            <strong>Location:</strong> {forum.msevent.location.location_name || "Not mentioned"}
                          </p>
                          {participants && (
                            <p>
                              <strong>Participant:</strong> {participants} orang
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="text-forum-content">
                          {forum.msisi_forum.length > 0 && (
                            <>
                              {forum.msisi_forum[0].attachment && (
                                <img
                                  src={forum.msisi_forum[0].attachment}
                                  alt="Attachment"
                                  className="attachment-image max-h-40 object-cover rounded mb-2"
                                />
                              )}
                            </>
                          )}
                        </div>
                      )}

                      <hr />
                    </div>
                  );
                });
              })()}
            </div>
          </section>
        </main>

        <aside className="event-area">
          <h3 className="event-title">EVENT</h3>
          <EventWidget />
        </aside>
      </div>

      {/* Popup untuk membuat event */}
      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div
            className="popup-content wide-popup wider-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="popup-title">Make An Event</h3>

            <div className="event-details-grid">
              <label htmlFor="event-name">Event Name</label>
              <input
                type="text"
                id="event-name"
                className="popup-input"
                placeholder="What should we call this awesome event?"
              />

              <label htmlFor="event-description">Description</label>
              <textarea
                id="event-description"
                className="popup-input"
                placeholder="What's this event all about?"
                rows={4}
                style={{ resize: 'vertical' }}
              />

              <label htmlFor="event-subject">Subject</label>
              <select id="event-subject" className="popup-input">
                {dummySubjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
                ))}
              </select>

              <label htmlFor="event-location">Location</label>
              <input
                type="text"
                id="event-location"
                className="popup-input"
                placeholder="Where will the magic happen?"
              />

              <label htmlFor="event-address">Address</label>
              <input
                type="text"
                id="event-address"
                className="popup-input"
                placeholder="Specific location address"
              />

              <label htmlFor="event-date">Date & Time Details</label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <label
                    htmlFor="event-date"
                    style={{ fontSize: '12px', marginBottom: '4px', marginLeft: '4px' }}
                  >
                    Date
                  </label>
                  <input type="date" id="event-date" className="popup-input" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <label
                    htmlFor="event-start-time"
                    style={{ fontSize: '12px', marginBottom: '4px', marginLeft: '4px' }}
                  >
                    Start Time
                  </label>
                  <input type="time" id="event-start-time" className="popup-input" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <label
                    htmlFor="event-end-time"
                    style={{ fontSize: '12px', marginBottom: '4px', marginLeft: '4px' }}
                  >
                    End Time
                  </label>
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
                  <label
                    htmlFor="event-latitude"
                    style={{ fontSize: '12px', marginBottom: '4px', marginLeft: '4px' }}
                  >
                    Latitude
                  </label>
                  <input
                    type="number"
                    id="event-latitude"
                    className="popup-input"
                    placeholder="Drop the latitude pin"
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <label
                    htmlFor="event-longtitude"
                    style={{ fontSize: '12px', marginBottom: '4px', marginLeft: '4px' }}
                  >
                    Longitude
                  </label>
                  <input
                    type="number"
                    id="event-longtitude"
                    className="popup-input"
                    placeholder="And the longitude too"
                  />
                </div>
              </div>
            </div>

            <div className="popup-buttons">
              <button
                className="cancel-button"
                onClick={() => setShowPopup(false)}
              >
                Close
              </button>
              <button
                className="submit-button"
                onClick={handleEventSubmit}
              >
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
