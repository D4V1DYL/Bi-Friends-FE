import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavigationBar from "../Components/NavigationComponent/NavigationBar";
import Swal from "sweetalert2";
import profileDefault from "../assets/profileLogo.png"; // import gambar default
import "./OtherPersonPage.css";

interface Profile {
  user_id: number;
  username: string;
  profile_picture: string | null; // bisa null kalau gak ada
  gender: string;
  email: string;
}

const OtherPersonPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = sessionStorage.getItem("token") || localStorage.getItem("token") || "";
        const response = await fetch(`https://bifriendsbe.bifriends.my.id/profile/profile-page/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const responseJson = await response.json();
        const data = responseJson.data;

        setProfile({
          user_id: data.user_id,
          username: data.username,
          profile_picture: data.profile_picture || null, // kalau kosong jadi null
          gender: data.gender,
          email: data.email,
        });
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Gagal mengambil data profile user", "error");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const handleAddFriend = async () => {
    if (!profile) return;

    try {
      const token = sessionStorage.getItem("token") || localStorage.getItem("token") || "";

      const response = await fetch(
        `https://bifriendsbe.bifriends.my.id/profile/add-friend/${profile.user_id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send friend request");
      }

      Swal.fire("Sukses", `Friend request sent to ${profile.username}!`, "success");
    } catch (error: any) {
      console.error(error);
      Swal.fire("Error", error.message || "Gagal mengirim friend request", "error");
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (!profile) {
    return <div>Profile not found.</div>;
  }

  return (
    <div className="other-person-page">
      <NavigationBar />
      <div className="other-person-container">
        <div className="profile-card">
          <div className="profile-header">
            {/* kalau profile_picture ada pakai itu, kalau gak pakai default */}
            <img
              src={profile.profile_picture ? profile.profile_picture : profileDefault}
              alt="Profile"
              className="profile-image"
            />
            <div className="profile-text">
              <h2 className="profile-name">{profile.username}</h2>
              <p className="profile-gender">{profile.gender}</p>
              <p className="profile-description">{profile.email}</p>
            </div>
          </div>
          <button className="add-friend-button" onClick={handleAddFriend}>
            Add Friend
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtherPersonPage;
