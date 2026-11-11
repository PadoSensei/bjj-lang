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
            conceptCount: 3,
            completed: true,
          },
          {
            id: 'lesson-1-2',
            title: 'Comandos de Treino',
            description: 'Compreenda ordens como "Line up", "Time", "Break", e "Tap out".',
            estimatedMinutes: 7,
            conceptCount: 3,
            completed: false,
          },
          {
            id: 'lesson-1-3',
            title: 'Números e Respostas Básicas',
            description: 'Aprenda a contar repetições de posições e responder ao professor com clareza.',
            estimatedMinutes: 6,
            conceptCount: 9,
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
            conceptCount: 2,
            completed: false,
          },
          {
            id: 'lesson-2-2',
            title: 'Saídas e Posturas Defensivas',
            description: 'Terminologia de escapes como bridge, shrimp, underhook e postura defensiva.',
            estimatedMinutes: 8,
            conceptCount: 9,
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
            title: 'Finalizações da Guarda',
            description: 'Aprenda termos essenciais como armlock, triângulo e ataques da guarda.',
            estimatedMinutes: 10,
            conceptCount: 10,
            completed: false,
          },
          {
            id: 'lesson-3-2',
            title: 'Sparring e Diálogo no Tatame',
            description: 'Comunicação prática durante o rola: pedir treino soltinho, combinar o início, voltar ao centro e usar expressões de etiqueta e segurança no tatame.',
            estimatedMinutes: 10,
            conceptCount: 10,
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
            conceptCount: 3,
            completed: true,
          },
          {
            id: 'lesson-1-2-pt',
            title: 'Coaching Commands',
            description: 'Understand calls like "Parou!", "Troca!", and "Mais um!".',
            estimatedMinutes: 7,
            conceptCount: 3,
            completed: false,
          },
          {
            id: 'lesson-1-3-pt',
            title: 'Numbers & Basic Responses',
            description: 'Learn how to count drill repetitions and acknowledge instructor instructions.',
            estimatedMinutes: 6,
            conceptCount: 9,
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
            conceptCount: 2,
            completed: false,
          },
          {
            id: 'lesson-2-2-pt',
            title: 'Escapes & Defensive Postures',
            description: 'Contextual escape terminology and defensive cues such as ponte, fuga de quadril, and base.',
            estimatedMinutes: 8,
            conceptCount: 9,
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
            title: 'Submissions from Guard',
            description: 'Learn core submission names and attacking cues from guard such as armlock, triangle, and kimura.',
            estimatedMinutes: 10,
            conceptCount: 10,
            completed: false,
          },
          {
            id: 'lesson-3-2-pt',
            title: 'Sparring & Mat Dialogue',
            description: 'Practical rolling dialogue: asking for a light roll, agreeing on how to start, resetting to the center, and using mat etiquette and safety expressions.',
            estimatedMinutes: 10,
            conceptCount: 10,
            completed: false,
          },
        ],
      },
    ],
  },
};
