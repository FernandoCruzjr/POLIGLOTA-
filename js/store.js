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
    activity: [],
    pending: { profile: false, lessons: [], activity: [] },
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

export function recordLesson({ lessonId, title, xp, seconds, score }) {
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

  const previous = state.lessons[lessonId];
  const now = new Date().toISOString();
  state.lessons[lessonId] = {
    completedAt: previous ? previous.completedAt : now,
    lastAt: now,
    score,
    times: (previous ? previous.times : 0) + 1,
  };

  const activity = { id: crypto.randomUUID(), type: 'lesson', ref: lessonId, title, xp, at: now };
  state.activity = [activity, ...state.activity].slice(0, MAX_ACTIVITY);

  state.pending.profile = true;
  if (!state.pending.lessons.includes(lessonId)) state.pending.lessons.push(lessonId);
  state.pending.activity.push(activity);

  commit();
  sync();
  return { firstTime: !previous };
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
  if (!pending.profile && !pending.lessons.length && !pending.activity.length) return;
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

window.addEventListener('online', () => sync());
