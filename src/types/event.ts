export type EventFormat = 'online' | 'offline' | 'hybrid';
export type EventType = 'lecture' | 'webinar' | 'meeting' | 'excursion' | 'masterclass';
export type EventStatus = 'scheduled' | 'ongoing' | 'completed' | 'cancelled';

export interface Speaker {
  id: string;
  name: string;
  position?: string;
  company?: string;
  bio?: string;
  avatar_url?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  speaker_id?: string;
  speaker_name?: string;
  speaker_position?: string;
  speaker_company?: string;
  format: EventFormat;
  platform?: string;
  meeting_url?: string;
  recording_url?: string;
  event_type: EventType;
  target_audience: string[];
  max_participants: number;
  current_participants: number;
  start_time: string;
  end_time: string;
  registration_deadline?: string;
  status: EventStatus;
  cover_image_url?: string;
  materials_url?: string[];
  tags?: string[];
  created_at: string;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  registration_time: string;
  attended: boolean;
  feedback?: string;
  rating?: number;
}