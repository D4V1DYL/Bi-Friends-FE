/**
 * Tipe data yang dikembalikan /chat/contacts
 */
export interface Contact {
  user_id: number
  username: string
  profile_picture?: string
}

/**
 * Tipe data chat dari /chat/history/:id
 */
export interface Message {
  chat_id: number
  sender_id: number
  receiver_id: number
  message: string
  attachment?: string
  created_at: string
}

/**
 * Payload untuk dikirim lewat WebSocket
 */
export interface NewMessage {
  receiver_id: number
  message: string
  attachment?: string | null
}


export interface Contact {
  user_id:   number
  username:  string
  profile_picture?: string
  gender?:   string
  // …any other fields…
}
