import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import chatLogo from '../../assets/chatLogo.svg';
import beeLogo from '../../assets/Logo_Text2.svg';
import calenderLogo from '../../assets/Calender.svg';
import notificationLogo from '../../assets/notificationLogo.svg';
import profileLogo from '../../assets/profileLogo.png';
import './NavigationBar.css';
import ProfileService from '../../Shared/Profile/ProfileService';
import { getUserIdFromToken } from '../../Utils/jwt';

/**
 * Interface untuk raw friend request sesuai response backend:
 *   {
 *     request_id: number;
 *     sender_id: number;
 *     status: string;
 *     request_date: string;
 *   }
 */
interface FriendRequestRaw {
  request_id: number;
  sender_id: number;
  status: string;
  request_date: string;
}

/**
 * Interface hasil enrich dengan nama pengirim:
 *   {
 *     request_id: number;
 *     sender_id: number;
 *     sender_name: string;    <-- kita tambahkan ini
 *     status: string;
 *     request_date: string;
 *   }
 */
interface FriendRequestEnriched {
  request_id: number;
  sender_id: number;
  sender_name: string;
  status: string;
  request_date: string;
}

const NavigationBar: React.FC = () => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // State untuk daftar friend request hasil enrich (sudah ada sender_name)
  const [friendRequests, setFriendRequests] = useState<FriendRequestEnriched[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  // Ref untuk wrapper notifikasi (dipakai untuk click-away)
  const notifRef = useRef<HTMLDivElement>(null);

  const token = sessionStorage.getItem('token') || localStorage.getItem('token') || '';
  const userId = getUserIdFromToken(token);

  // 1) Fetch profil avatar (tetap sama seperti sebelumya)
  useEffect(() => {
    if (!userId || !token) return;

    const fetchProfile = async () => {
      try {
        const res = await ProfileService.getProfile(userId, token);
        if (res && typeof res === 'object') {
          setAvatarPreview(res.profile_picture || '');
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };
    fetchProfile();
  }, [userId, token]);

  // 2) Fetch raw friend requests dan kemudian enrich dengan username
  useEffect(() => {
    if (!token) return;

    const fetchAndEnrichRequests = async () => {
      try {
        // a) Panggil endpoint incoming requests
        const response = await fetch(
          'https://bifriendsbe.bifriends.my.id/profile/friend-requests/incoming',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        let data = await response.json();

        // b) Jika backend mengembalikan string, parse ulang:
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
          } catch {
            data = { requests: [] };
          }
        }

        // c) Ambil array raw requests
        const rawRequests: FriendRequestRaw[] = Array.isArray(data.requests)
          ? data.requests
          : [];

        // d) Jika tidak ada request, langsung set ke state kosong
        if (rawRequests.length === 0) {
          setFriendRequests([]);
          return;
        }

        // e) Untuk setiap rawRequest, panggil endpoint profil sender_id untuk dapatkan username
        //    → kembalikan array Promise<FriendRequestEnriched>
        const enrichedList: Promise<FriendRequestEnriched>[] = rawRequests.map(
          async (req: FriendRequestRaw) => {
            try {
              // Contoh endpoint: /profile/profile-page/{sender_id}
              const profileRes = await fetch(
                `https://bifriendsbe.bifriends.my.id/profile/profile-page/${req.sender_id}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              let profileData = await profileRes.json();

              // Jika masih stringified JSON, parse ulang
              if (typeof profileData === 'string') {
                try {
                  profileData = JSON.parse(profileData);
                } catch {
                  profileData = { data: { username: 'Unknown' } };
                }
              }

              // username di dalam profileData.data.username
              const name =
                profileData &&
                profileData.data &&
                typeof profileData.data.username === 'string'
                  ? profileData.data.username
                  : 'Unknown';

              return {
                request_id: req.request_id,
                sender_id: req.sender_id,
                sender_name: name,
                status: req.status,
                request_date: req.request_date,
              };
            } catch (err) {
              console.error(
                `Gagal fetch profile sender_id=${req.sender_id}:`,
                err
              );
              // Jika error, tetap kembalikan entry dengan 'Unknown'
              return {
                request_id: req.request_id,
                sender_id: req.sender_id,
                sender_name: 'Unknown',
                status: req.status,
                request_date: req.request_date,
              };
            }
          }
        );

        // f) Tunggu semua Promise selesai, lalu set state
        const finalList: FriendRequestEnriched[] = await Promise.all(enrichedList);
        setFriendRequests(finalList);
      } catch (err) {
        console.error('Gagal ambil atau enrich friend request:', err);
        setFriendRequests([]);
      }
    };

    fetchAndEnrichRequests();
  }, [token]);

  // 3) Click-away listener: jika klik di luar notif-wrapper, tutup dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  // 4) Handler “Accept”: panggil endpoint accept, lalu remove dari state
  const handleAccept = async (requestId: number) => {
    try {
      await fetch(
        `https://bifriendsbe.bifriends.my.id/profile/accept-friend-request/${requestId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Setelah sukses, hapus request tersebut dari state
      setFriendRequests(prev =>
        prev.filter(req => req.request_id !== requestId)
      );
    } catch (err) {
      console.error('Gagal menerima permintaan:', err);
    }
  };

  return (
    <div className="navigation-bar">
      <div className="nav-left">
        <Link to="/HomePage">
          <img src={beeLogo} alt="Bi-Friends Logo" className="nav-logo" />
        </Link>
      </div>

      <div className="nav-right">
        <Link to="/ChatPage">
          <img
            src={chatLogo}
            alt="Messages"
            className="nav-icon"
            id="chat-logo"
          />
        </Link>

        <Link to="/CalenderPage">
          <img
            src={calenderLogo}
            alt="Calender"
            className="nav-icon"
            id="calender-logo"
          />
        </Link>

        {/* Icon notifikasi friend request */}
        <div className="notif-wrapper" ref={notifRef}>
          <img
            src={notificationLogo}
            alt="Notifications"
            className="nav-icon notif-icon"
            id="notification-logo"
            onClick={() => setShowDropdown(prev => !prev)}
          />

          {/* Jika ada request, tampilkan dot merah */}
          {friendRequests.length > 0 && <span className="notif-dot" />}

          {showDropdown && (
            <div className="notif-dropdown">
              {friendRequests.length === 0 ? (
                <p className="notif-empty">Tidak ada permintaan</p>
              ) : (
                friendRequests.map(req => (
                  <div key={req.request_id} className="notif-item">
                    <span className="notif-item-text">
                      {/* Tampilkan username, bukan ID */}
                      {req.sender_name} has sent a friend req
                    </span>
                    <div className="notif-item-actions">
                      <button
                        className="notif-action-btn accept-btn"
                        onClick={() => handleAccept(req.request_id)}
                      >
                        ✅ Accept
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <Link to="/ProfilePage">
          <img
            src={avatarPreview || profileLogo}
            alt="Profile"
            className="nav-avatar"
          />
        </Link>
      </div>
    </div>
  );
};

export default NavigationBar;
