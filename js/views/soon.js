import { icon } from '../icons.js';

// Telas que ganham conteúdo nas próximas fases. Mantidas na navegação desde
// já para o aluno conhecer o caminho Aprender → Vocabulário → Revisar.
const SCREENS = {
  revisao: {
    title: 'Revisão',
    icon: 'review',
    lead: 'As palavras que você errar voltam com mais frequência; as que você domina aparecem cada vez menos.',
    points: ['Seleção automática do que revisar', 'Níveis de domínio de 0 a 4', 'Exercícios de escolha, completar e escrever'],
  },
};

export function render(root, { screen }) {
  const s = SCREENS[screen];
  root.innerHTML = `
    <header class="page-head"><h1>${s.title}</h1></header>
    <section class="card empty">
      <span class="empty-icon">${icon(s.icon, 34)}</span>
      <h2>Em construção</h2>
      <p>${s.lead}</p>
      <ul class="checklist">${s.points.map((p) => `<li>${icon('check', 18)} ${p}</li>`).join('')}</ul>
      <a class="btn btn-primary" href="#/aprender">Enquanto isso, praticar lições</a>
    </section>
  `;
}
