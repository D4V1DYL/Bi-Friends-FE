import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NavigationBar from '../Components/NavigationComponent/NavigationBar';
import { baseURL } from '../../environment';
import './ForumPage.css';

interface ForumReply {
  reply_id: number;
  reply_text: string;
  created_at: string;
  msuser: {
    username: string;
    profile_picture: string;
  };
  children?: ForumReply[];
}

interface ForumDetail {
  post_id: number;
  title: string;
  description: string;
  created_at: string;
  msuser: {
    username: string;
    profile_picture: string;
  };
  mssubject: {
    subject_name: string;
  };
  msevent: {
    event_name: string;
    event_date: string;
    start_date: string;
    end_date: string;
    location: {
      location_name: string;
    };
  };
  msisi_forum?: {
    forum_text: string;
    attachment: string;
  }[];
}

const ForumPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [forum, setForum] = useState<ForumDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [replyText, setReplyText] = useState("");
  const [parentReplyId, setParentReplyId] = useState<number | null>(null);
  const token = localStorage.getItem('token') || sessionStorage.getItem('token') || '';

  useEffect(() => {
    if (!postId) return;

    const fetchForumDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseURL}Forum/forum/${postId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setForum(response.data.data);
        fetchReplies();
      } catch (err) {
        setError('Gagal mengambil detail forum');
      } finally {
        setLoading(false);
      }
    };

    fetchForumDetail();
  }, [postId, token]);

  const fetchReplies = async () => {
    try {
      const res = await axios.get(`${baseURL}Forum/forum_replies/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log("Full reply response:", res.data); // tambahkan ini
  
      const replyData = res.data?.replies;
  
      if (Array.isArray(replyData)) {
        console.log("Reply data fetched:", replyData);
        setReplies(replyData);
      } else {
        console.warn("Reply data is not an array, setting empty replies");
        setReplies([]);
      }
    } catch (err) {
      console.error("Gagal memuat reply", err);
      setReplies([]);
    }
  };

  const submitReply = async () => {
    try {
      await axios.post(`${baseURL}Forum/reply_forum`, {
        post_id: Number(postId),
        reply_text: replyText,
        parent_reply_id: parentReplyId || 0,
        attachment: "",
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setReplyText("");
      setParentReplyId(null);
      fetchReplies(); 
    } catch (err) {
      console.error("Gagal mengirim reply");
    }
  };

  const renderReply = (reply: ForumReply) => (
    <div key={reply.reply_id} className="reply-box">
      <p><strong>{reply.msuser?.username}</strong></p>
      <p>{reply.reply_text}</p>
      <p className="reply-time">{new Date(reply.created_at).toLocaleString()}</p>
      <button onClick={() => setParentReplyId(reply.reply_id)}>Balas</button>

      {reply.children && reply.children.length > 0 && (
        <div className="child-replies">
          {reply.children.map((child: ForumReply) => renderReply(child))}
        </div>
      )}
    </div>
  );

  if (loading) return <p>Loading detail forum...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!forum) return <p>Forum tidak ditemukan</p>;

  return (
    <>
      <NavigationBar />
      <div className="forum-page-spacing">
        <div className="forum-detail-container">
          <div className="forum-header-bar">
            <div className="reply-input-container">
                  {parentReplyId && (
                    <p>Membalas komentar ID: {parentReplyId} <button onClick={() => setParentReplyId(null)}>Batalkan</button></p>
                  )}
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Tulis balasan anda..."
                    rows={4}
                    className="reply-textarea"
                  />
                  <button onClick={submitReply} disabled={!replyText.trim()}>Kirim Balasan</button>
            </div>
          </div>
          <div className="forum-body">
          <div className="forum-sidebar">
              <div className="username">{forum.msuser.username}</div>
              <img src={forum.msuser.profile_picture} alt={forum.msuser.username} className="sidebar-profile-picture" />
            </div>
            <div className="forum-content">
              <div className="forum-timestamp">
                {new Date(forum.created_at).toLocaleString()}
              </div>
    
              <h2 className="forum-title">{forum.title}</h2>
    
              <div className="forum-description">{forum.description}</div>
    
              <div className="forum-event-box">
                <p><strong>Subject:</strong> {forum.mssubject.subject_name}</p>
                <p><strong>Event:</strong> {forum.msevent.event_name}</p>
                <p><strong>Tanggal:</strong> {new Date(forum.msevent.event_date).toLocaleDateString()}</p>
                <p><strong>Lokasi:</strong> {forum.msevent.location.location_name}</p>
                <p><strong>Waktu:</strong> {new Date(forum.msevent.start_date).toLocaleTimeString()} - {new Date(forum.msevent.end_date).toLocaleTimeString()}</p>
              </div>
              <div className="forum-replies-section">
                <h3>Replies</h3>
                {Array.isArray(replies) && replies.length === 0 ? (
                    <p>No replies available.</p>
                  ) : (
                    Array.isArray(replies) &&
                      replies.map((reply: ForumReply) => renderReply(reply))
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForumPage;
