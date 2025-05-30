import React, { useState, useEffect } from 'react';
import NavigationBar from '../Components/NavigationComponent/NavigationBar';
import './ProfilePage.css';
import profileLogo from '../assets/profileLogo.png';
import ProfileService from '../Shared/Profile/ProfileService';
import { getUserIdFromToken } from '../Utils/jwt';
import { Profile } from '../Shared/Profile/ProfileTypes';
import Swal from 'sweetalert2';

const ProfilePage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | ''>('');
  const [bio, setBio] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const token = sessionStorage.getItem('token') || localStorage.getItem('token') || '';
  const userId = getUserIdFromToken(token);

  useEffect(() => {
    if (userId && token) {
      const fetchData = async () => {
        try {
          const res = await ProfileService.getProfile(userId, token);
          const data: Profile = res.data;
          setUsername(data.username);
          setGender(data.gender as '' | 'Male' | 'Female');
          setAvatarPreview(data.profile_picture);
          setEmail(data.email);
          setBio(data.bio || '');
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        }
      };

      fetchData();
    }
  }, [userId, token]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    if (!userId || !token) return;

    const formData = new FormData();
    formData.append('username', username);
    formData.append('gender', gender);
    formData.append('bio', bio); // ⬅️ tambahkan ini
    if (selectedFile) {
      formData.append('profile_picture', selectedFile);
    }

    try {
      await ProfileService.updateProfile(userId, formData, token);
      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Profil berhasil diperbarui.',
        confirmButtonColor: '#3085d6',
      });
    } catch (error) {
      console.error('Update failed:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Gagal memperbarui profil.',
        confirmButtonColor: '#d33',
      });
    }
  };


  return (
    <div>
      <NavigationBar />
      <div className="profile-container">
        <h1 className="title">Edit Profil</h1>

        <div className="avatar-section">
          <img
            src={avatarPreview || profileLogo}
            className="avatar-img"
            alt="Avatar"
          />
          <div>
            <label htmlFor="avatar-upload" className="upload-btn">Upload avatar</label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleAvatarChange}
            />
            <p className="upload-note">
              At least 800 x 800 px recommended<br />JPG or PNG is allowed
            </p>
            <p className="email">{email}</p>
          </div>
        </div>

        <div className="form-card">
          <label>Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} />

          <label>Gender</label>
          <div className="gender-toggle">
            <button
              className={gender === 'Male' ? 'active' : ''}
              onClick={() => setGender('Male')}
            >
              Male
            </button>
            <button
              className={gender === 'Female' ? 'active' : ''}
              onClick={() => setGender('Female')}
            >
              Female
            </button>
          </div>

          <label>Bio</label>
          <textarea
            value={bio}
            maxLength={250}
            onChange={(e) => setBio(e.target.value)}
          />
          <div className="char-count">{bio.length} / 250</div>

          <button className="update-btn" onClick={handleUpdate}>
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
