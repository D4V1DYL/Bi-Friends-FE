import React, { useEffect, useState, useRef, ChangeEvent } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NavigationBar from '../Components/NavigationComponent/NavigationBar';
import { baseURL } from '../../environment';
import './ForumPage.css';
import profile from '../assets/profileLogo.png';
import ProfileService from '../Shared/Profile/ProfileService';
import { Paperclip } from 'lucide-react';

interface ForumReply {
  reply_id: number;
  reply_text: string;
  created_at: string;
  user_id: number;
  attachment: string | null;
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
  mssubject?: {
    subject_name: string;
  };
  msevent?: {
    event_name: string;
    event_date: string;
    start_date: string;
    end_date: string;
    location: {
      location_name: string;
      address: string;
      capacity?: number;
      latitude?: number;
      longitude?: number;
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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [replyText, setReplyText] = useState<string>("");
  const [parentReplyId, setParentReplyId] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const token = localStorage.getItem('token') || sessionStorage.getItem('token') || '';
  const [userProfiles, setUserProfiles] = useState<Record<number, { username: string; profile_picture: string }>>({});
  const [openReplies, setOpenReplies] = useState<Record<number, boolean>>({});
  const [isReplySubmitting, setIsReplySubmitting] = useState(false);

  const toggleChildReplies = (replyId: number) => {
    setOpenReplies((prev) => ({
      ...prev,
      [replyId]: !prev[replyId],
    }));
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const fetchUserProfile = async (uId: number) => {
    if (userProfiles[uId]) return;
    try {
      const profileData = await ProfileService.getProfile(uId, token);
      setUserProfiles((prev) => ({
        ...prev,
        [uId]: {
          username: profileData.username,
          profile_picture: profileData.profile_picture,
        },
      }));
    } catch (err) {
      console.error(`Error fetch profil user ${uId}`, err);
    }
  };

  useEffect(() => {
    if (!postId) return;
    const fetchForum = async () => {
      try {
        setLoading(true);
        const resp = await axios.get(`${baseURL}Forum/forum/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForum(resp.data.data || null);
        fetchReplies();
      } catch (err) {
        setError('Gagal mengambil detail forum');
      } finally {
        setLoading(false);
      }
    };
    fetchForum();
  }, [postId, token]);

  const fetchReplies = async () => {
    try {
      const res = await axios.get(`${baseURL}Forum/forum_replies/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataReplies = res.data.replies;
      if (Array.isArray(dataReplies)) {
        setReplies(dataReplies);
        dataReplies.forEach((r: ForumReply) => fetchUserProfile(r.user_id));
      } else {
        setReplies([]);
      }
    } catch (err) {
      console.error('Error fetch replies', err);
      setReplies([]);
    }
  };

  const submitReply = async () => {
    if (isReplySubmitting) return;  

    if (!replyText.trim()) return;

    setIsReplySubmitting(true);

    const formData = new FormData();
    formData.append('post_id', String(postId));
    formData.append('reply_text', replyText);
    formData.append('parent_reply_id', parentReplyId ? String(parentReplyId) : "0");
    if (selectedFile) {
      formData.append('attachment', selectedFile);
    }

    try {
      await axios.post(
        `${baseURL}Forum/reply_forum`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReplyText("");
      setParentReplyId(null);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      fetchReplies();
    } catch (err) {
      console.error("Gagal mengirim reply", err);
    } finally {
      setIsReplySubmitting(false);
    }
  };

  const renderReply = (reply: ForumReply) => {
    const user = userProfiles[reply.user_id];
    const isExpanded = !!openReplies[reply.reply_id];
    const hasChildren = Array.isArray(reply.children) && reply.children.length > 0;

    const isImage = reply.attachment
      ? /\.(jpg|jpeg|png|gif)$/i.test(reply.attachment)
      : false;

    return (
      <div key={reply.reply_id} className="reply-box">
        <div className="reply-header">
          <img
            src={user?.profile_picture || profile}
            alt={user?.username || 'Anonim'}
            className="reply-avatar"
          />
          <div className="reply-meta">
            <p className="reply-username">{user?.username || 'Anonim'}</p>
            <p className="reply-time">{new Date(reply.created_at).toLocaleString()}</p>
            {reply.attachment && (
              <div className="reply-attachment">
                {isImage ? (
                  <img
                    src={reply.attachment}
                    alt="Reply Attachment"
                    className="reply-attachment-image"
                  />
                ) : (
                  <a
                    href={reply.attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="reply-attachment-link"
                  >
                    {reply.attachment.split('/').pop()}
                  </a>
                )}
              </div>
            )}
            <p className="reply-text">{reply.reply_text}</p>
            <div className="reply-actions">
              <span
                onClick={() => setParentReplyId(reply.reply_id)}
                className="reply-action-btn"
              >
                Reply
              </span>
              {hasChildren && (
                <span
                  onClick={() => toggleChildReplies(reply.reply_id)}
                  className="reply-action-btn"
                >
                  {isExpanded ? 'Hide replies' : `${reply.children!.length} replies`}
                </span>
              )}
            </div>
          </div>
        </div>

        {isExpanded && reply.children && (
          <div className="child-replies">
            {reply.children.map((child) => renderReply(child))}
          </div>
        )}
      </div>
    );
  };

  if (loading) return <p className="loading-text">Loading detail forum…</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!forum) return <p className="error-text">Forum tidak ditemukan</p>;


  return (
    <>
      <NavigationBar />
      <div className="forum-page-spacing">
        <div className="forum-detail-container" style={{ backgroundColor: '#F5F0CD' }}>
          <div className="forum-body">
            <div className="forum-sidebar">
              <div className="username">{forum.msuser.username}</div>
              <img
                src={forum.msuser.profile_picture || profile}
                className="sidebar-profile-picture"
                alt="User"
              />
            </div>
            <div className="forum-content">
              <div className="forum-timestamp">
                {new Date(forum.created_at).toLocaleString()}
              </div>
              <h2 className="forum-title">{forum.title}</h2>
              <div className="forum-description">{forum.description}</div>

              <div className="forum-event-info">
                {forum.mssubject && (
                  <p>
                    <strong>Subject:</strong> {forum.mssubject.subject_name}
                  </p>
                )}
                {forum.msevent && (
                  <>
                    <p>
                      <strong>Event:</strong> {forum.msevent.event_name}
                    </p>
                    <p>
                      <strong>Tanggal:</strong>{' '}
                      {new Date(forum.msevent.event_date).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Lokasi:</strong> {forum.msevent.location.location_name}
                    </p>
                    <p>
                      <strong>Address:</strong> {forum.msevent.location.address}
                    </p>
                    <p>
                      <strong>Capacity:</strong> {forum.msevent.location.capacity ?? '-'}
                    </p>
                    <p>
                      <strong>Longitude:</strong> {forum.msevent.location.longitude ?? '-'}
                    </p>
                    <p>
                      <strong>Latitude:</strong> {forum.msevent.location.latitude ?? '-'}
                    </p>
                    <p>
                      <strong>Waktu:</strong>{' '}
                      {new Date(forum.msevent.start_date).toLocaleTimeString()} –{' '}
                      {new Date(forum.msevent.end_date).toLocaleTimeString()}
                    </p>
                  </>
                )}
              </div>

              <div className="reply-input-container">
                <textarea
                  className="reply-textarea youtube-style"
                  placeholder={parentReplyId ? 'Reply to comment…' : 'Add a comment...'}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onInput={(e) => {
                    e.currentTarget.style.height = 'auto';
                    e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                  }}
                />

                <div className="reply-input-actions">
                  <button
                    className="comment-button"
                    onClick={submitReply}
                    disabled={!replyText.trim()}
                  >
                    Comment
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="attach-btn"
                    title="Attach a file"
                  >
                    <Paperclip size={20} />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileSelect}
                  />

                  {selectedFile && (
                    <span className="selected-filename">{selectedFile.name}</span>
                  )}

                  {parentReplyId && (
                    <button
                      className="cancel-reply-button"
                      onClick={() => {
                        setParentReplyId(null);
                        setSelectedFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              <div className="forum-replies-section">
                {Array.isArray(replies) && replies.length === 0 ? (
                  <p className="no-replies-text">No replies available.</p>
                ) : (
                  replies.map((reply) => renderReply(reply))
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
