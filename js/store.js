// Estado do aluno: salvo primeiro no aparelho (funciona offline) e
// sincronizado com o Supabase quando há internet. A chave do localStorage
// inclui o ID do usuário para o progresso nunca vazar entre contas
// no mesmo navegador.
import { sb } from './auth.js';

const STORAGE_PREFIX = 'ief_state_';
const MAX_ACTIVITY = 20;

function blankState() {
  return {
    v: 1,
    profile: {
      name: '',
      xp: 0,
      streak: 0,
      lastStudyDate: null,
      dailyGoalMin: 10,
      todayDate: null,
      todaySeconds: 0,
      totalSeconds: 0,
      studyDays: 0,
    },
    lessons: {},
    words: {},
    activity: [],
    pending: { profile: false, lessons: [], words: [], activity: [] },
  };
}

let userId = null;
let state = blankState();
const listeners = new Set();

export function today(d = new Date()) {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

function daysBetween(a, b) {
  const [y1, m1, d1] = a.split('-').map(Number);
  const [y2, m2, d2] = b.split('-').map(Number);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000);
}

function persist() {
  try {
    localStorage.setItem(STORAGE_PREFIX + userId, JSON.stringify(state));
  } catch (e) { /* armazenamento cheio ou bloqueado: segue só em memória */ }
}

function emit() {
  listeners.forEach((fn) => fn(state));
}

function commit() {
  persist();
  emit();
}

export function load(uid, fallbackName) {
  userId = uid;
  const base = blankState();
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(STORAGE_PREFIX + uid) || 'null'); } catch (e) { saved = null; }
  state = saved
    ? {
        ...base,
        ...saved,
        profile: { ...base.profile, ...saved.profile },
        pending: { ...base.pending, ...saved.pending },
      }
    : base;
  if (!state.profile.name && fallbackName) state.profile.name = fallbackName;
  emit();
}

export function unload() {
  userId = null;
  state = blankState();
}

export const get = () => state;

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function currentStreak() {
  const { lastStudyDate, streak } = state.profile;
  if (!lastStudyDate) return 0;
  return daysBetween(lastStudyDate, today()) <= 1 ? streak : 0;
}

export function secondsToday() {
  return state.profile.todayDate === today() ? state.profile.todaySeconds : 0;
}

export function isLessonDone(lessonId) {
  return Boolean(state.lessons[lessonId]);
}

// Parte comum a qualquer estudo: sequência, tempo, XP e histórico.
function registerStudy({ xp, seconds, type, ref, title }) {
  const p = state.profile;
  const t = today();
  if (p.lastStudyDate !== t) {
    const continues = p.lastStudyDate && daysBetween(p.lastStudyDate, t) === 1;
    p.streak = continues ? p.streak + 1 : 1;
    p.lastStudyDate = t;
    p.studyDays += 1;
  }
  if (p.todayDate !== t) {
    p.todayDate = t;
    p.todaySeconds = 0;
  }
  p.todaySeconds += seconds;
  p.totalSeconds += seconds;
  p.xp += xp;

  const activity = { id: crypto.randomUUID(), type, ref, title, xp, at: new Date().toISOString() };
  state.activity = [activity, ...state.activity].slice(0, MAX_ACTIVITY);
  state.pending.profile = true;
  state.pending.activity.push(activity);
}

export function recordLesson({ lessonId, title, xp, seconds, score }) {
  const previous = state.lessons[lessonId];
  const now = new Date().toISOString();
  state.lessons[lessonId] = {
    completedAt: previous ? previous.completedAt : now,
    lastAt: now,
    score,
    times: (previous ? previous.times : 0) + 1,
  };
  if (!state.pending.lessons.includes(lessonId)) state.pending.lessons.push(lessonId);
  registerStudy({ xp, seconds, type: 'lesson', ref: lessonId, title });
  commit();
  sync();
  return { firstTime: !previous };
}

// ---------- Palavras ----------
// Domínio: 0 nova · 1 aprendendo · 2 reconhecida · 3 conhecida · 4 dominada.
// O id da palavra é "categoria.palavra", então a categoria sai do próprio id.

export const MASTERY_LABELS = ['Nova', 'Aprendendo', 'Reconhecida', 'Conhecida', 'Dominada'];

export function wordState(id) {
  return state.words[id] || null;
}

export function masteryOf(id) {
  return state.words[id] ? state.words[id].mastery : 0;
}

export function wordStats(ids) {
  let seen = 0; let mastered = 0; let points = 0;
  ids.forEach((id) => {
    const m = masteryOf(id);
    if (m > 0) seen += 1;
    if (m === 4) mastered += 1;
    points += m;
  });
  return { total: ids.length, seen, mastered, mastery: ids.length ? points / (ids.length * 4) : 0 };
}

export function seenWordsCount() {
  return Object.values(state.words).filter((w) => w.mastery > 0).length;
}

export function dueWordsCount() {
  const now = Date.now();
  return Object.values(state.words).filter((w) => w.nextReview && new Date(w.nextReview).getTime() <= now).length;
}

function markPendingWord(id) {
  if (!state.pending.words.includes(id)) state.pending.words.push(id);
}

// Estudo por cartões: a palavra passa de "nova" para "aprendendo" e entra na fila de revisão de amanhã.
export function recordWordsStudied({ ids, xp, seconds, title, ref }) {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 3600 * 1000).toISOString();
  ids.forEach((id) => {
    const w = state.words[id] || { mastery: 0, reviews: 0, correct: 0, wrong: 0, lastReview: null, nextReview: null };
    w.reviews += 1;
    w.lastReview = now.toISOString();
    if (w.mastery === 0) {
      w.mastery = 1;
      w.nextReview = tomorrow;
    }
    state.words[id] = w;
    markPendingWord(id);
  });
  registerStudy({ xp, seconds, type: 'vocab', ref, title });
  commit();
  sync();
}

export function updateProfile(changes) {
  Object.assign(state.profile, changes);
  state.pending.profile = true;
  commit();
  sync();
}

// ---------- Nuvem (Supabase) ----------

let syncing = false;

export async function sync() {
  if (!userId || syncing || !navigator.onLine) return;
  const pending = state.pending;
  if (!pending.profile && !pending.lessons.length && !pending.words.length && !pending.activity.length) return;
  syncing = true;
  const db = sb();
  try {
    if (pending.profile) {
      const p = state.profile;
      const { error } = await db.from('en_profile').upsert({
        user_id: userId,
        display_name: p.name || null,
        xp: p.xp,
        streak: p.streak,
        last_study_date: p.lastStudyDate,
        daily_goal_min: p.dailyGoalMin,
        today_date: p.todayDate,
        today_seconds: p.todaySeconds,
        total_seconds: p.totalSeconds,
        study_days: p.studyDays,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      pending.profile = false;
    }
    if (pending.lessons.length) {
      const rows = pending.lessons
        .filter((id) => state.lessons[id])
        .map((id) => {
          const l = state.lessons[id];
          return { user_id: userId, lesson_id: id, completed_at: l.completedAt, last_at: l.lastAt, score: l.score, times: l.times };
        });
      const { error } = await db.from('en_lesson_progress').upsert(rows, { onConflict: 'user_id,lesson_id' });
      if (error) throw error;
      pending.lessons = [];
    }
    if (pending.words.length) {
      const rows = pending.words.filter((id) => state.words[id]).map((id) => {
        const w = state.words[id];
        return {
          user_id: userId, word_id: id, mastery: w.mastery, reviews: w.reviews, correct: w.correct,
          wrong: w.wrong, last_review: w.lastReview, next_review: w.nextReview,
        };
      });
      for (let i = 0; i < rows.length; i += 500) {
        const { error } = await db.from('en_word_progress').upsert(rows.slice(i, i + 500), { onConflict: 'user_id,word_id' });
        if (error) throw error;
      }
      pending.words = [];
    }
    if (pending.activity.length) {
      const rows = pending.activity.map((a) => ({
        id: a.id, user_id: userId, type: a.type, ref: a.ref, title: a.title, xp: a.xp, created_at: a.at,
      }));
      const { error } = await db.from('en_activity').upsert(rows, { onConflict: 'id', ignoreDuplicates: true });
      if (error) throw error;
      pending.activity = [];
    }
  } catch (e) {
    console.warn('[sync] adiado, tento de novo depois:', (e && e.message) || e);
  } finally {
    syncing = false;
    persist();
  }
}

// Traz o que está na nuvem (ex.: estudou em outro aparelho) e mescla com o local.
export async function pull() {
  if (!userId || !navigator.onLine) return;
  const db = sb();
  try {
    const [prof, lessons, acts] = await Promise.all([
      db.from('en_profile').select('*').eq('user_id', userId).maybeSingle(),
      db.from('en_lesson_progress').select('*').eq('user_id', userId),
      db.from('en_activity').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(MAX_ACTIVITY),
    ]);
    if (prof.error) throw prof.error;

    const remote = prof.data;
    if (remote && !state.pending.profile) {
      Object.assign(state.profile, {
        name: remote.display_name || state.profile.name,
        xp: remote.xp,
        streak: remote.streak,
        lastStudyDate: remote.last_study_date,
        dailyGoalMin: remote.daily_goal_min,
        todayDate: remote.today_date,
        todaySeconds: remote.today_seconds,
        totalSeconds: remote.total_seconds,
        studyDays: remote.study_days,
      });
    }

    (lessons.data || []).forEach((r) => {
      const local = state.lessons[r.lesson_id];
      if (!local || (r.times || 0) > local.times) {
        state.lessons[r.lesson_id] = { completedAt: r.completed_at, lastAt: r.last_at || r.completed_at, score: r.score, times: r.times || 1 };
      }
    });

    const words = await pullWords(db);
    words.forEach((r) => {
      if (state.pending.words.includes(r.word_id)) return;
      const local = state.words[r.word_id];
      if (!local || (r.reviews || 0) >= local.reviews) {
        state.words[r.word_id] = {
          mastery: r.mastery, reviews: r.reviews, correct: r.correct, wrong: r.wrong,
          lastReview: r.last_review, nextReview: r.next_review,
        };
      }
    });

    const byId = new Map(state.activity.map((a) => [a.id, a]));
    (acts.data || []).forEach((r) => {
      if (!byId.has(r.id)) byId.set(r.id, { id: r.id, type: r.type, ref: r.ref, title: r.title, xp: r.xp, at: r.created_at });
    });
    state.activity = [...byId.values()].sort((a, b) => (a.at < b.at ? 1 : -1)).slice(0, MAX_ACTIVITY);

    commit();
  } catch (e) {
    console.warn('[pull] usando só os dados do aparelho:', (e && e.message) || e);
  }
  sync();
}

// O Supabase devolve no máximo 1.000 linhas por consulta; busca em páginas.
async function pullWords(db) {
  const all = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db.from('en_word_progress').select('*').eq('user_id', userId).range(from, from + 999);
    if (error || !data) break;
    all.push(...data);
    if (data.length < 1000) break;
  }
  return all;
}

window.addEventListener('online', () => sync());
