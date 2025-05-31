export interface ForumInput {
  title: string;
  description: string;
  event_name: string;
  event_date: string;
  start_date?: string;
  end_date?: string;
  location_name: string;
  location_address?: string;
  location_capacity: number;
  location_latitude: number;
  location_longitude: number;
  forum_text?: string;
  subject_id: number; // ✅ harus ada ini
}