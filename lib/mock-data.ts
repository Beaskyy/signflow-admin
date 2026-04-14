import type {
  DashboardStats,
  DashboardCharts,
  AdminUser,
  AdminConversation,
  AdminMessage,
  UsageAnalytics,
  PerformanceAnalytics,
  RetentionAnalytics,
  ModerationItem,
  SystemSettings,
  AuditLogEntry,
  ActivityItem,
} from "@/types/admin";

// ============================================================
// Dashboard Mock Data
// ============================================================
export const mockDashboardStats: DashboardStats = {
  total_users: 12847,
  active_users: 3421,
  total_conversations: 48293,
  total_translations: 156720,
  success_rate: 97.3,
  avg_response_time: 1.2,
};

function generateLast30Days() {
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split("T")[0],
      count: Math.floor(Math.random() * 800) + 200,
    });
  }
  return data;
}

export const mockDashboardCharts: DashboardCharts = {
  translations_per_day: generateLast30Days(),
  signups_per_day: generateLast30Days().map((d) => ({
    ...d,
    count: Math.floor(d.count / 10),
  })),
  language_distribution: {
    ASL: 62,
    BSL: 24,
    NSL: 14,
  },
};

// ============================================================
// Users Mock Data
// ============================================================
const firstNames = ["James", "Sarah", "Michael", "Emily", "David", "Jessica", "Daniel", "Ashley", "Chris", "Sophia", "Oluwaseun", "Chidinma", "Emeka", "Ngozi", "Tunde"];
const lastNames = ["Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Martinez", "Anderson", "Wilson", "Okafor", "Adeyemi", "Nwosu", "Ibrahim", "Ogunleye"];

export const mockUsers: AdminUser[] = Array.from({ length: 50 }, (_, i) => {
  const firstName = firstNames[i % firstNames.length];
  const lastName = lastNames[i % lastNames.length];
  const daysAgo = Math.floor(Math.random() * 365);
  const lastActiveDays = Math.floor(Math.random() * 30);
  return {
    id: `usr_${String(i + 1).padStart(4, "0")}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
    first_name: firstName,
    last_name: lastName,
    full_name: `${firstName} ${lastName}`,
    avatar_url: null,
    role: i === 0 ? "admin" : i < 3 ? "moderator" : "user",
    status: i === 48 ? "suspended" : i === 49 ? "banned" : "active",
    date_joined: new Date(Date.now() - daysAgo * 86400000).toISOString(),
    last_active: new Date(Date.now() - lastActiveDays * 86400000).toISOString(),
    total_conversations: Math.floor(Math.random() * 100),
  };
});

// ============================================================
// Conversations Mock Data
// ============================================================
const conversationTitles = [
  "Greetings & Introductions",
  "Restaurant Order Practice",
  "Emergency Phrases",
  "Daily Routines",
  "Medical Appointment",
  "Job Interview Prep",
  "Classroom Vocabulary",
  "Weather Descriptions",
  "Family Introductions",
  "Shopping Assistance",
  "Travel Phrases",
  "Sports Discussion",
  "Technology Terms",
  "Music & Art",
  "Cooking Instructions",
];

export const mockConversations: AdminConversation[] = Array.from(
  { length: 30 },
  (_, i) => {
    const user = mockUsers[i % mockUsers.length];
    const daysAgo = Math.floor(Math.random() * 30);
    return {
      id: `conv_${String(i + 1).padStart(4, "0")}`,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        avatar_url: user.avatar_url,
      },
      title: conversationTitles[i % conversationTitles.length],
      message_count: Math.floor(Math.random() * 25) + 1,
      last_message_preview: "Hello, how are you today?",
      status: i % 5 === 0 ? "archived" : "active",
      language: ["ASL", "BSL", "NSL"][i % 3],
      created_at: new Date(Date.now() - daysAgo * 86400000).toISOString(),
      updated_at: new Date(
        Date.now() - (daysAgo - 1) * 86400000
      ).toISOString(),
      duration: `${Math.floor(Math.random() * 60)}m ${Math.floor(Math.random() * 60)}s`,
    };
  }
);

export const mockMessages: AdminMessage[] = Array.from(
  { length: 10 },
  (_, i) => ({
    id: `msg_${String(i + 1).padStart(4, "0")}`,
    conversation_id: "conv_0001",
    message_type: i % 2 === 0 ? "text_to_sign" : "sign_to_text",
    status: i === 9 ? "error" : "completed",
    input_preview: ["Hello, how are you?", "I am fine, thank you", "What is your name?", "My name is SignFlow", "Nice to meet you", "Where are you from?", "I am from Nigeria", "That is wonderful", "Let us practice more", "Goodbye, see you"][i],
    output_preview: "HELLO HOW YOU",
    gloss_description: "Greeting followed by question",
    created_at: new Date(Date.now() - (10 - i) * 60000).toISOString(),
    completed_at: i === 9 ? null : new Date(Date.now() - (10 - i) * 60000 + 2000).toISOString(),
  })
);

// ============================================================
// Analytics Mock Data
// ============================================================
export const mockUsageAnalytics: UsageAnalytics = {
  translations_heatmap: Array.from({ length: 168 }, (_, i) => ({
    hour: i % 24,
    day: Math.floor(i / 24),
    count: Math.floor(Math.random() * 100),
  })),
  peak_hours: Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    avg_count: Math.floor(Math.random() * 500) + (i >= 9 && i <= 17 ? 300 : 50),
  })),
  total_translations_period: 45832,
};

export const mockPerformanceAnalytics: PerformanceAnalytics = {
  api_response_times: generateLast30Days().map((d) => ({
    date: d.date,
    avg_ms: Math.floor(Math.random() * 500) + 800,
    p95_ms: Math.floor(Math.random() * 1000) + 1500,
  })),
  websocket_success_rate: 98.7,
  error_rates: generateLast30Days().map((d) => ({
    date: d.date,
    rate: Math.random() * 5,
  })),
  uptime_percentage: 99.95,
};

export const mockRetentionAnalytics: RetentionAnalytics = {
  cohorts: Array.from({ length: 8 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (i + 1) * 7);
    return {
      cohort_date: date.toISOString().split("T")[0],
      total_users: Math.floor(Math.random() * 200) + 50,
      retention: Array.from({ length: 8 - i }, (_, j) =>
        Math.max(0, 100 - j * (Math.random() * 15 + 5))
      ),
    };
  }),
  dau: 3421,
  wau: 8932,
  mau: 12847,
  dau_mau_ratio: 26.6,
};

// ============================================================
// Moderation Mock Data
// ============================================================
export const mockModerationQueue: ModerationItem[] = [
  {
    id: "mod_001",
    user: { id: "usr_0012", full_name: "Michael Brown", email: "michael.brown12@example.com", avatar_url: null },
    input_text: "This is flagged content example #1",
    flag_reason: "offensive",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: "pending",
    conversation_id: "conv_0003",
    message_id: "msg_0034",
  },
  {
    id: "mod_002",
    user: { id: "usr_0007", full_name: "Ashley Davis", email: "ashley.davis7@example.com", avatar_url: null },
    input_text: "This is flagged content example #2",
    flag_reason: "spam",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    status: "pending",
    conversation_id: "conv_0008",
    message_id: "msg_0056",
  },
  {
    id: "mod_003",
    user: { id: "usr_0020", full_name: "Tunde Ogunleye", email: "tunde.ogunleye20@example.com", avatar_url: null },
    input_text: "Auto-flagged phrase detected in translation",
    flag_reason: "auto_flagged",
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    status: "pending",
    conversation_id: "conv_0012",
    message_id: "msg_0078",
  },
  {
    id: "mod_004",
    user: { id: "usr_0033", full_name: "Ngozi Nwosu", email: "ngozi.nwosu33@example.com", avatar_url: null },
    input_text: "User reported this content as inappropriate",
    flag_reason: "reported",
    timestamp: new Date(Date.now() - 21600000).toISOString(),
    status: "pending",
    conversation_id: "conv_0015",
    message_id: "msg_0091",
  },
];

// ============================================================
// Settings Mock Data
// ============================================================
export const mockSettings: SystemSettings = {
  app_name: "SignFlow",
  maintenance_mode: false,
  default_language: "ASL",
  api_url: "https://api.signflow.app/v1",
  websocket_url: "wss://ws.signflow.app",
  rate_limit_per_user: 100,
  rate_limit_window_minutes: 60,
  blocked_words: ["spam", "offensive_word"],
  email_templates: {
    warning: "Dear {user_name}, your account has received a warning...",
    ban: "Dear {user_name}, your account has been banned...",
    suspension: "Dear {user_name}, your account has been suspended...",
  },
};

// ============================================================
// Audit Log Mock Data
// ============================================================
export const mockAuditLog: AuditLogEntry[] = [
  {
    id: "audit_001",
    admin_user: { id: "usr_0001", full_name: "James Johnson", email: "james.johnson0@example.com" },
    action: "user.suspend",
    target_type: "user",
    target_id: "usr_0048",
    details: "Suspended user for policy violation",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    ip_address: "192.168.1.100",
  },
  {
    id: "audit_002",
    admin_user: { id: "usr_0001", full_name: "James Johnson", email: "james.johnson0@example.com" },
    action: "settings.update",
    target_type: "settings",
    target_id: "rate_limit",
    details: "Updated rate limit from 50 to 100",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    ip_address: "192.168.1.100",
  },
  {
    id: "audit_003",
    admin_user: { id: "usr_0002", full_name: "Sarah Williams", email: "sarah.williams1@example.com" },
    action: "moderation.approve",
    target_type: "moderation",
    target_id: "mod_012",
    details: "Approved flagged content",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    ip_address: "192.168.1.101",
  },
  {
    id: "audit_004",
    admin_user: { id: "usr_0001", full_name: "James Johnson", email: "james.johnson0@example.com" },
    action: "user.delete",
    target_type: "user",
    target_id: "usr_0099",
    details: "Deleted user account upon request",
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    ip_address: "192.168.1.100",
  },
  {
    id: "audit_005",
    admin_user: { id: "usr_0002", full_name: "Sarah Williams", email: "sarah.williams1@example.com" },
    action: "user.role_change",
    target_type: "user",
    target_id: "usr_0005",
    details: "Changed role from user to moderator",
    timestamp: new Date(Date.now() - 28800000).toISOString(),
    ip_address: "192.168.1.101",
  },
];

// ============================================================
// Activity Feed Mock Data
// ============================================================
export const mockActivityFeed: ActivityItem[] = [
  {
    id: "act_001",
    user: { full_name: "Oluwaseun Okafor", avatar_url: null },
    action: "completed translation",
    target: "Emergency Phrases",
    timestamp: new Date(Date.now() - 120000).toISOString(),
  },
  {
    id: "act_002",
    user: { full_name: "Emily Jones", avatar_url: null },
    action: "created conversation",
    target: "Job Interview Prep",
    timestamp: new Date(Date.now() - 300000).toISOString(),
  },
  {
    id: "act_003",
    user: { full_name: "Chidinma Adeyemi", avatar_url: null },
    action: "uploaded video",
    target: "ASL Practice Session",
    timestamp: new Date(Date.now() - 600000).toISOString(),
  },
  {
    id: "act_004",
    user: { full_name: "David Garcia", avatar_url: null },
    action: "registered account",
    target: "",
    timestamp: new Date(Date.now() - 900000).toISOString(),
  },
  {
    id: "act_005",
    user: { full_name: "Sophia Anderson", avatar_url: null },
    action: "completed 10 translations",
    target: "Daily Routines",
    timestamp: new Date(Date.now() - 1200000).toISOString(),
  },
  {
    id: "act_006",
    user: { full_name: "Emeka Nwosu", avatar_url: null },
    action: "switched language to",
    target: "NSL",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
  },
];
