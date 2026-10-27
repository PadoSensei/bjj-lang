import { BeltType } from '../theme/tokens';
import { CourseDirection } from '../components/ui/CourseDirectionSelector';

export interface LessonSummary {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  conceptCount: number;
  completed?: boolean;
}

export interface UnitSummary {
  id: string;
  title: string;
  subtitle: string;
  belt: BeltType;
  description: string;
  lessons: LessonSummary[];
  progress: number; // 0 to 1
}

export interface CourseData {
  direction: CourseDirection;
  title: string;
  subtitle: string;
  targetLanguage: string;
  nativeLanguage: string;
  units: UnitSummary[];
}

export const MOCK_COURSES: Record<CourseDirection, CourseData> = {
  'pt-BR->en': {
    direction: 'pt-BR->en',
    title: 'Aprenda Inglês para Jiu-Jitsu',
    subtitle: 'Comunique-se em academias internacionais e seminários',
    targetLanguage: 'Inglês',
    nativeLanguage: 'Português',
    units: [
      {
        id: 'unit-1-en',
        title: 'Unidade 1: Primeiros Passos no Tatame',
        subtitle: 'Cumprimentos, números e comandos básicos',
        belt: 'white',
        description: 'Vocabulário essencial de saudação e comandos de treino em inglês.',
        progress: 0.5,
        lessons: [
          {
            id: 'lesson-1-1',
            title: 'Saudações e Regras do Tatame',
            description: 'Aprenda como cumprimentar parceiros e o professor (OSS, Shake hands, Bow).',
            estimatedMinutes: 5,
            conceptCount: 6,
            completed: true,
          },
          {
            id: 'lesson-1-2',
            title: 'Comandos de Treino',
            description: 'Compreenda ordens como "Line up", "Time", "Break", e "Tap out".',
            estimatedMinutes: 7,
            conceptCount: 8,
            completed: false,
          },
        ],
      },
      {
        id: 'unit-2-en',
        title: 'Unidade 2: Posições e Defesa',
        subtitle: 'Guardas, passagens e controle',
        belt: 'blue',
        description: 'Nomes de posições fundamentais e saídas de sufoco em inglês.',
        progress: 0,
        lessons: [
          {
            id: 'lesson-2-1',
            title: 'Guardas e Passagens',
            description: 'Closed guard, open guard, guard pass e side control.',
            estimatedMinutes: 10,
            conceptCount: 10,
            completed: false,
          },
        ],
      },
      {
        id: 'unit-3-en',
        title: 'Unidade 3: Finalizações e Transições',
        subtitle: 'Submissões e raspagens',
        belt: 'purple',
        description: 'Aprenda termos como Armbar, Triangle choke e Sweep.',
        progress: 0,
        lessons: [
          {
            id: 'lesson-3-1',
            title: 'Ataques Básicos da Guarda',
            description: 'Como explicar raspagens e ataques na guarda fechada.',
            estimatedMinutes: 12,
            conceptCount: 12,
            completed: false,
          },
        ],
      },
    ],
  },
  'en->pt-BR': {
    direction: 'en->pt-BR',
    title: 'Learn Brazilian Portuguese for BJJ',
    subtitle: 'Understand academy commands, mat culture, and technique terms',
    targetLanguage: 'Portuguese',
    nativeLanguage: 'English',
    units: [
      {
        id: 'unit-1-pt',
        title: 'Unit 1: Fundamentals & Mat Culture',
        subtitle: 'Greetings, numbers, and core commands',
        belt: 'white',
        description: 'Essential academy Portuguese greetings, counting, and instructor calls.',
        progress: 0.33,
        lessons: [
          {
            id: 'lesson-1-1-pt',
            title: 'Mat Greetings & Etiquette',
            description: 'Learn terms like "Bom dia", "Com licença", and "Por favor".',
            estimatedMinutes: 5,
            conceptCount: 6,
            completed: true,
          },
          {
            id: 'lesson-1-2-pt',
            title: 'Coaching Commands',
            description: 'Understand calls like "Parou!", "Troca!", and "Mais um!".',
            estimatedMinutes: 8,
            conceptCount: 8,
            completed: false,
          },
        ],
      },
      {
        id: 'unit-2-pt',
        title: 'Unit 2: BJJ Positions & Actions',
        subtitle: 'Guards, passes, and controls',
        belt: 'blue',
        description: 'Portuguese terms for Guarda Fechada, Montada, Costas, and Raspagem.',
        progress: 0,
        lessons: [
          {
            id: 'lesson-2-1-pt',
            title: 'Core Position Names',
            description: 'Guarda, Passagem, Meia-guarda, and Controle Lateral.',
            estimatedMinutes: 10,
            conceptCount: 10,
            completed: false,
          },
        ],
      },
      {
        id: 'unit-3-pt',
        title: 'Unit 3: Submissions & Sparring',
        subtitle: 'Submissions and rolling dialogue',
        belt: 'purple',
        description: 'Armlock, Estrangulamento, Pegada, and post-roll conversations.',
        progress: 0,
        lessons: [
          {
            id: 'lesson-3-1-pt',
            title: 'Submissions & Defense',
            description: 'Key submission names and defensive communication.',
            estimatedMinutes: 12,
            conceptCount: 12,
            completed: false,
          },
        ],
      },
    ],
  },
};
