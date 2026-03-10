export interface Video {
  id: string;
  title: string;
  video_url: string;
  created_at: string;
}

export interface Player {
  id: string;
  name: string;
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
