export interface Video {
  id: string;
  title: string;
  video_url: string;
  created_at: string;
}

export interface Player {
  id: string;
  name: string;
  avatar_url: string | null;
  position: string | null;
  created_at: string;
}

export interface Event {
  id: string;
  video_id: string;
  player_id: string;
  event_type: string;
  timestamp: number;
  created_at: string;
  player?: Player;
}

export interface Summary {
  id: string;
  video_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}
