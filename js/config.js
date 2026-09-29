// Mesmo projeto Supabase do Alfa-Alfa: as contas de login são as mesmas,
// mas o inglês usa tabelas próprias (prefixo en_), veja supabase/schema.sql.
// A chave "publishable" é pública por natureza; a segurança vem do RLS.
export const SUPABASE_URL = 'https://doioejeyihuhfqhzdbbq.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_jERifRcO4VPPITWcT3rHzw_KBrY--dH';

export const APP_NAME = 'Inglês em Família';
export const APP_VERSION = '0.1.0 (Fase 1)';

export const XP_RULES = {
  lessonFirstTime: 20,
  lessonRepeat: 5,
};

export const DAILY_GOAL_OPTIONS = [5, 10, 15, 20, 30];
