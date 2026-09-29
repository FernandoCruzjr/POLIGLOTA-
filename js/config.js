// Mesmo projeto Supabase do Alfa-Alfa: as contas de login são as mesmas,
// mas o inglês usa tabelas próprias (prefixo en_), veja supabase/schema.sql.
// A chave "publishable" é pública por natureza; a segurança vem do RLS.
export const SUPABASE_URL = 'https://doioejeyihuhfqhzdbbq.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_jERifRcO4VPPITWcT3rHzw_KBrY--dH';

export const APP_NAME = 'Hi Family';
export const APP_VERSION = '0.5.2';

// Login com Google: só ligue depois de ativar o provedor Google no Supabase
// (Authentication → Sign In / Providers → Google). Veja o README.
export const GOOGLE_LOGIN_ENABLED = false;

export const XP_RULES = {
  lessonFirstTime: 20,
  lessonRepeat: 5,
  quizCorrect: 2,
  quizPerfectBonus: 5,
  roomCorrect: 3,
};

export const DAILY_GOAL_OPTIONS = [5, 10, 15, 20, 30];
