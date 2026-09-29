import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

let client = null;

export function sb() {
  if (!client) {
    if (!window.supabase) throw new Error('Biblioteca do Supabase não carregou (verifique a internet).');
    client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return client;
}

const ERRORS = {
  'Invalid login credentials': 'E-mail ou senha incorretos.',
  'User already registered': 'Já existe uma conta com esse e-mail.',
  'Email not confirmed': 'Confirme seu e-mail antes de entrar (veja sua caixa de entrada).',
  'Password should be at least 6 characters': 'A senha precisa ter pelo menos 6 caracteres.',
  'Failed to fetch': 'Sem conexão com a internet.',
};

export function translateError(err) {
  const msg = (err && err.message) || String(err || '');
  return ERRORS[msg] || msg || 'Algo deu errado. Tente de novo.';
}

export async function getSession() {
  const { data } = await sb().auth.getSession();
  return data.session;
}

export function onAuthChange(fn) {
  return sb().auth.onAuthStateChange((event, session) => fn(event, session));
}

export async function signIn(email, password) {
  const { error } = await sb().auth.signInWithPassword({ email, password });
  if (error) throw error;
}

// Devolve true quando o Supabase exige confirmação por e-mail (sem sessão ainda).
export async function signUp(nome, email, password) {
  const { data, error } = await sb().auth.signUp({
    email,
    password,
    options: { data: { nome }, emailRedirectTo: location.origin + location.pathname },
  });
  if (error) throw error;
  return !data.session;
}

export async function sendPasswordReset(email) {
  const { error } = await sb().auth.resetPasswordForEmail(email, {
    redirectTo: location.origin + location.pathname,
  });
  if (error) throw error;
}

export async function updatePassword(password) {
  const { error } = await sb().auth.updateUser({ password });
  if (error) throw error;
}

export async function signOut() {
  await sb().auth.signOut();
}

export function displayNameFrom(user) {
  const nome = user && user.user_metadata && user.user_metadata.nome;
  if (nome) return nome.trim().split(/\s+/)[0];
  return user && user.email ? user.email.split('@')[0] : '';
}
