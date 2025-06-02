import {
  useState,
  useEffect,
  useRef,
  FormEvent,
  ChangeEvent,
} from 'react';
import { IoPersonCircleOutline } from 'react-icons/io5';
import ChatService from '../Shared/Chat/ChatService';
import { Contact, Message as RawMessage, NewMessage } from '../Shared/Chat/ChatTypes';
import chatBg from '../assets/Chat.jpg';
import NavigationBar from '../Components/NavigationComponent/NavigationBar';

const COLOR_ME = '#8DD8FF';
const COLOR_OTHER = '#FADA7A';

interface UIMessage extends RawMessage {
  attachment?: any;
  fromMe: boolean;
  time: string;
}

export default function ChatPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [input, setInput] = useState('');
  const [myProfile, setMyProfile] = useState<Contact | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    ChatService.getContacts()
      .then(friends => {
        setContacts(friends);
        setFilteredContacts(friends);
        if (friends.length) setSelected(friends[0]);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    ChatService.getUserProfile()
      .then(setMyProfile)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selected) return;
    wsRef.current?.close();

    ChatService.getHistory(selected.user_id)
      .then(hist => {
        const me = ChatService.getCurrentUserId();
        const ui = hist.map(m => {
          let ts = m.created_at;
          if (!/[zZ]$/.test(ts)) ts += 'Z';
          const d = new Date(ts);
          const time = isNaN(d.getTime())
            ? m.created_at
            : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          return {
            ...m,
            fromMe: m.sender_id === me,
            time,
          };
        });
        setMessages(ui);
      })
      .catch(console.error);

    const ws = ChatService.connectSocket();
    ws.onopen = () => console.info('📡 WebSocket connected');
    ws.onerror = ev => console.error('⚠️ WebSocket error', ev);
    ws.onclose = () => console.info('WebSocket closed');

    ws.onmessage = ev => {
      const inc = JSON.parse(ev.data) as RawMessage & { own?: boolean };
      if (inc.own) return;
      if (inc.sender_id !== selected!.user_id) return;

      let ts = inc.created_at;
      if (!/[zZ]$/.test(ts)) ts += 'Z';
      const d = new Date(ts);
      const time = isNaN(d.getTime())
        ? inc.created_at
        : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const ui: UIMessage = {
        ...inc,
        attachment: inc.attachment ?? undefined,
        fromMe: false,
        time,
      };

      setMessages(ms => {
        if (ms.some(m => m.chat_id === ui.chat_id)) return ms;
        return [...ms, ui];
      });
    };

    wsRef.current = ws;
    return () => {
      ws.close();
    };
  }, [selected]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.length === 0) {
        setFilteredContacts(contacts);
        return;
      }

      const currentUserId = myProfile?.user_id;
      if (!currentUserId) return;

      fetch(`/chat/search-users?q=${searchQuery}&current_user_id=${currentUserId}`)
        .then(res => res.json())
        .then(data => {
          setFilteredContacts(data.data || []);
        })
        .catch(console.error);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, contacts]);

  const sendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selected || !wsRef.current) return;

    const payload: NewMessage = {
      receiver_id: selected.user_id,
      message: input.trim(),
      attachment: null,
    };

    const tempId = Date.now();
    const now = new Date().toISOString();
    setMessages(ms => [
      ...ms,
      {
        chat_id: tempId,
        sender_id: ChatService.getCurrentUserId(),
        receiver_id: selected.user_id,
        message: input.trim(),
        attachment: null,
        created_at: now,
        fromMe: true,
        time: new Date(now).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    ]);

    wsRef.current.send(JSON.stringify(payload));
    setInput('');
  };

  return (
    <div className="flex flex-col h-screen">
      <NavigationBar />
      <div className="flex flex-col md:flex-row flex-1">
        {/* Sidebar */}
        <aside className="w-full md:w-1/4 bg-[#FFD586] p-4 flex flex-col border-r border-[#FADA7A]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Inbox</h2>
          </div>

          <input
            type="text"
            placeholder="Search…"
            className="mb-4 w-full py-2 px-3 rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <ul className="flex-1 overflow-auto space-y-2">
            {filteredContacts.map((c) => {
              const isActive = selected?.user_id === c.user_id;
              return (
                <li
                  key={c.user_id}
                  onClick={() => setSelected(c)}
                  className={`flex items-center p-2 rounded-lg cursor-pointer transition ${
                    isActive
                      ? 'bg-[#81BFDA] text-white'
                      : 'bg-white hover:bg-[#E5E5E5] text-gray-800'
                  }`}
                  style={{ backgroundColor: isActive ? '#81BFDA' : undefined }}
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex items-center justify-center bg-gray-200">
                    {c.profile_picture ? (
                      <img
                        src={c.profile_picture}
                        alt={c.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <IoPersonCircleOutline className="text-gray-500" size={32} />
                    )}
                  </div>
                  <p className="font-semibold truncate">{c.username}</p>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Chat Window */}
        <section className="flex-1 flex flex-col">
          <header className="flex items-center p-4 border-b bg-white shadow-sm">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-gray-200 flex items-center justify-center">
                {selected?.profile_picture ? (
                  <img
                    src={selected.profile_picture}
                    alt={selected.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <IoPersonCircleOutline className="text-gray-500" size={32} />
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{selected?.username}</p>
                <p className="text-sm text-gray-500"></p>
              </div>
            </div>
          </header>

          <div
            className="flex-1 overflow-auto p-4 space-y-4"
            style={{
              backgroundImage: `url(${chatBg})`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
          >
            {messages.map((m) => (
              <div
                key={m.chat_id}
                className={`flex ${m.fromMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className="max-w-xs">
                  <div className="flex items-end space-x-2">
                    {!m.fromMe && (
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        {selected?.profile_picture ? (
                          <img
                            src={selected.profile_picture}
                            alt={selected.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <IoPersonCircleOutline className="text-gray-500" size={24} />
                        )}
                      </div>
                    )}
                    <div
                      className={`p-3 rounded-lg text-sm break-words shadow-sm ${
                        m.fromMe ? 'text-black' : 'text-gray-900'
                      }`}
                      style={{
                        backgroundColor: m.fromMe ? COLOR_ME : COLOR_OTHER,
                      }}
                    >
                      {m.message}
                      {m.attachment && (
                        <img
                          src={m.attachment}
                          className="mt-2 w-full rounded-lg object-cover"
                          alt="attachment"
                        />
                      )}
                      <div className="text-xs text-gray-700 mt-1 text-right">
                        {m.time}
                      </div>
                    </div>
                    {m.fromMe && (
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        {myProfile?.profile_picture ? (
                          <img
                            src={myProfile.profile_picture}
                            alt={myProfile.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <IoPersonCircleOutline className="text-gray-500" size={32} />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <form onSubmit={sendMessage} className="p-4 border-t border-[#81BFDA]" style={{ backgroundColor: COLOR_ME }}>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Type a message"
                value={input}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setInput(e.target.value)
                }
                className="flex-1 py-2 px-3 rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg font-semibold text-gray-900 hover:opacity-90 transition"
                style={{ backgroundColor: COLOR_ME }}
              >
                Send
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
