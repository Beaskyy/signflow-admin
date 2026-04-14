// ============================================================
// Dashboard
// ============================================================
export interface DashboardStats {
  total_users: number;
  active_users: number;
  total_conversations: number;
  total_translations: number;
  success_rate: number;
  avg_response_time: number;
}

export interface DashboardCharts {
  translations_per_day: { date: string; count: number }[];
  signups_per_day: { date: string; count: number }[];
  language_distribution: Record<string, number>;
}

// ============================================================
// Users
// ============================================================
export type UserRole = "user" | "admin" | "moderator";
export type UserStatus = "active" | "suspended" | "banned";

export interface AdminUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  avatar_url: string | null;
  role: UserRole;
  status: UserStatus;
  date_joined: string;
  last_active: string;
  total_conversations: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface UserFilters {
  search?: string;
  role?: UserRole;
  status?: UserStatus;
  sort?: string;
  page?: number;
  page_size?: number;
}

// ============================================================
// Conversations
// ============================================================
export type ConversationStatus = "active" | "archived";
export type MessageStatus = "pending" | "processing" | "completed" | "error";

export interface AdminConversation {
  id: string;
  user: {
    id: string;
    full_name: string;
    email: string;
    avatar_url: string | null;
  };
  title: string;
  message_count: number;
  last_message_preview: string;
  status: ConversationStatus;
  language: string;
  created_at: string;
  updated_at: string;
  duration: string;
}

export interface AdminMessage {
  id: string;
  conversation_id: string;
  message_type: "text_to_sign" | "sign_to_text";
  status: MessageStatus;
  input_preview: string;
  output_preview: string;
  gloss_description: string;
  created_at: string;
  completed_at: string | null;
}

export interface ConversationFilters {
  search?: string;
  user_id?: string;
  status?: ConversationStatus;
  language?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  page_size?: number;
}

// ============================================================
// Analytics
// ============================================================
export interface UsageAnalytics {
  translations_heatmap: { hour: number; day: number; count: number }[];
  peak_hours: { hour: number; avg_count: number }[];
  total_translations_period: number;
}

export interface PerformanceAnalytics {
  api_response_times: { date: string; avg_ms: number; p95_ms: number }[];
  websocket_success_rate: number;
  error_rates: { date: string; rate: number }[];
  uptime_percentage: number;
}

export interface RetentionAnalytics {
  cohorts: {
    cohort_date: string;
    total_users: number;
    retention: number[];
  }[];
  dau: number;
  wau: number;
  mau: number;
  dau_mau_ratio: number;
}

// ============================================================
// Moderation
// ============================================================
export type FlagReason =
  | "offensive"
  | "spam"
  | "inappropriate"
  | "reported"
  | "auto_flagged";
export type ModerationAction = "approve" | "remove" | "warn" | "ban";

export interface ModerationItem {
  id: string;
  user: {
    id: string;
    full_name: string;
    email: string;
    avatar_url: string | null;
  };
  input_text: string;
  flag_reason: FlagReason;
  timestamp: string;
  status: "pending" | "reviewed";
  conversation_id: string;
  message_id: string;
}

// ============================================================
// Settings
// ============================================================
export interface SystemSettings {
  app_name: string;
  maintenance_mode: boolean;
  default_language: string;
  api_url: string;
  websocket_url: string;
  rate_limit_per_user: number;
  rate_limit_window_minutes: number;
  blocked_words: string[];
  email_templates: {
    warning: string;
    ban: string;
    suspension: string;
  };
}

// ============================================================
// Audit Log
// ============================================================
export interface AuditLogEntry {
  id: string;
  admin_user: {
    id: string;
    full_name: string;
    email: string;
  };
  action: string;
  target_type: string;
  target_id: string;
  details: string;
  timestamp: string;
  ip_address: string;
}

// ============================================================
// Activity Feed
// ============================================================
export interface ActivityItem {
  id: string;
  user: {
    full_name: string;
    avatar_url: string | null;
  };
  action: string;
  target: string;
  timestamp: string;
}

// ============================================================
// Video Library
// ============================================================
export interface LibraryVideo {
  id: string;
  gloss: string;
  region: string;
  video_url: string;
  is_processed: boolean;
  added_by_email: string;
  created_at: string;
}

export interface LibraryVideoDetail extends LibraryVideo {
  file_size: number;
  pose_keypoints: string | null;
  extracted_at: string | null;
  updated_at: string;
}

export interface LibraryVideoFilters {
  page?: number;
  page_size?: number;
  search?: string;
  is_processed?: boolean;
  region?: string;
}

export interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
