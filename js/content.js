// Conteúdo do curso fica em data/*.json, separado da interface.
// Para adicionar lições/unidades/níveis basta editar o JSON.
let course = null;
let flat = [];

export async function loadCourse() {
  if (course) return course;
  const res = await fetch('data/course.json', { cache: 'no-cache' });
  if (!res.ok) throw new Error('Não foi possível carregar o curso.');
  course = await res.json();
  flat = [];
  course.levels.forEach((level) => {
    level.units.forEach((unit, ui) => {
      unit.number = ui + 1;
      unit.lessons.forEach((lesson, li) => {
        lesson.number = li + 1;
        flat.push({ lesson, unit, level });
      });
    });
  });
  return course;
}

export const getCourse = () => course;
export const allLessons = () => flat;

export function findLesson(id) {
  return flat.find((e) => e.lesson.id === id) || null;
}

// Trilha sequencial: uma lição abre quando a anterior foi concluída.
export function isUnlocked(id, isDone) {
  const i = flat.findIndex((e) => e.lesson.id === id);
  if (i <= 0) return i === 0;
  return isDone(id) || isDone(flat[i - 1].lesson.id);
}

export function nextLesson(isDone) {
  return flat.find((e) => !isDone(e.lesson.id)) || null;
}

export function overallProgress(isDone) {
  if (!flat.length) return 0;
  return flat.filter((e) => isDone(e.lesson.id)).length / flat.length;
}

export function unitProgress(unit, isDone) {
  const done = unit.lessons.filter((l) => isDone(l.id)).length;
  return { done, total: unit.lessons.length };
}

// Nível atual = nível da próxima lição (ou o último com conteúdo, se tudo estiver feito).
export function currentLevel(isDone) {
  const next = nextLesson(isDone);
  if (next) return next.level;
  return flat.length ? flat[flat.length - 1].level : course.levels[0];
}
