export interface Olympiad {
  id: number;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  registration_start: string | null;
  registration_end: string | null;
  status: 'draft' | 'published' | 'ongoing' | 'finished';
  first_place_percent?: number;
  second_place_percent?: number;
  third_place_percent?: number;
  diploma_text?: string;
  created_at: string;
  updated_at: string;
}

export interface OlympiadStage {
  id: number;
  olympiad_id: number;
  title: string;
  description: string | null;
  stage_type: 'test' | 'file_upload' | 'offline';
  start_time: string | null;
  end_time: string | null;
  duration_minutes: number | null;
  max_score: number | null;
  order_index: number;
  created_at: string;
}

export interface OlympiadTask {
  id: number;
  stage_id: number;
  task_type: 'test' | 'file' | 'text';
  question: string | null;
  options: string[] | null;
  correct_answer: string | null;
  max_score: number | null;
  order_index: number;
  created_at: string;
}

export interface OlympiadRegistration {
  id: number;
  olympiad_id: number;
  user_id: string;
  registered_at: string;
  status: 'registered' | 'disqualified' | 'completed';
  final_score: number | null;
  place: number | null;
  diploma_url: string | null;
}

export interface OlympiadAttempt {
  id: number;
  registration_id: number;
  stage_id: number;
  started_at: string | null;
  submitted_at: string | null;
  score: number | null;
  data: any;
  file_url: string | null;
  status: 'started' | 'submitted' | 'graded';
  created_at: string;
}
