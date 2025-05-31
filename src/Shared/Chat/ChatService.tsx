import axios from 'axios'
import { baseURL } from '../../../environment'
import { Contact, Message, NewMessage } from './ChatTypes'

const ChatService = {

   /**
   * Ambil token dari sessionStorage
   */
  getToken(): string {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token') || '';
    return token;
  },

    getCurrentUserId(): number {
    const token = this.getToken()
    if (!token) throw new Error('Not authenticated')
    // basic JWT decode (no signature check) to pull out user_id
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.user_id
    },


  getUserProfile: async (): Promise<Contact> => {
    const token = ChatService.getToken()
    if (!token) throw new Error('User is not authenticated')

    const userId= ChatService.getCurrentUserId();
    const resp = await axios.get<{ data: Contact }>(
      `${baseURL}profile/profile-page/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    return resp.data.data
  },


  /**
   * Ambil daftar kontak / friends
   */
  getContacts: async (): Promise<Contact[]> => {
    const token = ChatService.getToken()
    if (!token) throw new Error('User is not authenticated')
    const resp = await axios.get<{ friends: Contact[] }>(
      `${baseURL}profile/friends`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    return resp.data.friends
  },

  /**
   * Ambil riwayat chat dengan satu user
   */
  getHistory: async (
    contactId: number,
  ): Promise<Message[]> => {
    const token = ChatService.getToken()
    if (!token) throw new Error('User is not authenticated')
    const resp = await axios.get<{ history: Message[] }>(
      `${baseURL}chat/history/${contactId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    return resp.data.history
  },

  /**
   * Buka koneksi WebSocket untuk real-time chat
   */
    connectSocket(): WebSocket {
        const token = this.getToken()!
        const { user_id: userId } = JSON.parse(
        atob(token.split('.')[1])
        )

        const url = new URL(baseURL)
        const proto = url.protocol === 'https:' ? 'wss:' : 'ws:'
        // include the '/chat' prefix here:
        const wsUrl = `${proto}//${url.host}/chat/ws/chat/${userId}?token=${token}`

        console.debug('Opening WebSocket at', wsUrl)
        return new WebSocket(wsUrl)
    },

  /**
   * Kirim pesan lewat WebSocket
   */
  sendMessage: (ws: WebSocket, data: NewMessage): void => {
    ws.send(JSON.stringify(data))
  },

  /**
   * Tutup koneksi WebSocket
   */
  closeSocket: (ws: WebSocket): void => {
    ws.close()
  },
}

export default ChatService
