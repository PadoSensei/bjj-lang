import { LessonData } from '../types/lesson';

export const MOCK_LESSONS: Record<string, LessonData> = {
  'lesson-1-1': {
    id: 'lesson-1-1',
    unitId: 'unit-1',
    title: {
      pt: 'Saudações e Regras do Tatame',
      en: 'Mat Greetings & Etiquette',
    },
    objective: {
      pt: 'Aprenda cumprimentos essenciais e etiqueta básica do tatame.',
      en: 'Learn essential greetings and basic mat etiquette.',
    },
    vocabulary: [
      {
        id: 'vocab-1-1-1',
        termPt: 'OSS',
        termEn: 'OSS (Respect greeting)',
        context: {
          pt: 'Saudação tradicional do Jiu-Jitsu usada para demonstrar respeito, confirmar entendimento e saudar colegas ou mestres no tatame.',
          en: 'Traditional martial arts greeting used on the mat to show respect, acknowledge instructions, and greet instructors or partners.',
        },
        examplePt: 'Diga OSS ao cumprimentar o professor no início e no final do treino.',
        exampleEn: 'Say OSS when greeting the instructor at the start and end of class.',
      },
      {
        id: 'vocab-1-1-2',
        termPt: 'Cumprimentar',
        termEn: 'Bow / Shake hands',
        context: {
          pt: 'Gesto de respeito mútuo realizado ao entrar no tatame ou antes de iniciar uma sequência de treinos e rolas.',
          en: 'Mutual sign of respect performed when stepping onto the mat or before starting drills and sparring rounds.',
        },
        examplePt: 'Vamos cumprimentar o parceiro com um toque de mãos antes de começar o rola.',
        exampleEn: "Let's slap hands and bump fists with our partner before starting the roll.",
      },
      {
        id: 'vocab-1-1-3',
        termPt: 'Com licença',
        termEn: 'Excuse me',
        context: {
          pt: 'Expressão respeitosa obrigatória para pedir permissão ao professor antes de pisar no tatame ou atravessar a área de treino.',
          en: 'Polite expression required to ask the instructor for permission before stepping onto the mat or walking across the training area.',
        },
        examplePt: 'Com licença, professor, posso entrar no tatame?',
        exampleEn: 'Excuse me, Professor, may I step onto the mat?',
      },
    ],
    exercises: [
      {
        id: 'ex-1-1-mc1',
        type: 'multiple-choice',
        prompt: {
          pt: 'Como você saúda seu parceiro ou professor no tatame demonstrando respeito?',
          en: 'How do you greet your training partner or instructor on the mat to show respect?',
        },
        options: [
          { pt: 'OSS', en: 'OSS' },
          { pt: 'Tchau', en: 'Goodbye' },
          { pt: 'Parou', en: 'Stop' },
          { pt: 'Raspagem', en: 'Sweep' },
        ],
        correctIndex: 0,
        explanation: {
          pt: 'OSS é a saudação tradicional de respeito no Jiu-Jitsu.',
          en: 'OSS is the traditional greeting of respect in BJJ.',
        },
      },
      {
        id: 'ex-1-1-recall1',
        type: 'translation-recall',
        prompt: {
          pt: 'Com licença',
          en: 'Excuse me',
        },
        targetAnswer: {
          pt: 'Com licença',
          en: 'Excuse me',
        },
        explanation: {
          pt: 'Usado para pedir permissão ao entrar no tatame.',
          en: 'Used to ask permission when stepping onto the mat.',
        },
      },
      {
        id: 'ex-1-1-mc2',
        type: 'multiple-choice',
        prompt: {
          pt: 'Qual expressão significa fazer uma reverência ou apertar as mãos antes da luta?',
          en: 'Which term means bowing or shaking hands before a match or spar?',
        },
        options: [
          { pt: 'Bater', en: 'Tap out' },
          { pt: 'Cumprimentar', en: 'Bow / Shake hands' },
          { pt: 'Montada', en: 'Mount' },
          { pt: 'Passar', en: 'Pass' },
        ],
        correctIndex: 1,
        explanation: {
          pt: 'Cumprimentar indica a ação de saudar o parceiro antes do treino.',
          en: 'Cumprimentar / Bowing signals mutual respect before starting.',
        },
      },
    ],
  },
  'lesson-1-2': {
    id: 'lesson-1-2',
    unitId: 'unit-1',
    title: {
      pt: 'Comandos de Treino',
      en: 'Coaching Commands',
    },
    objective: {
      pt: 'Entenda os comandos verbais mais comuns dados pelo professor.',
      en: 'Understand essential verbal calls made by instructors during practice.',
    },
    vocabulary: [
      {
        id: 'vocab-1-2-1',
        termPt: 'Parou!',
        termEn: 'Stop! / Break!',
        context: {
          pt: 'Ordem verbal emitida pelo professor para congelar ou encerrar a movimentação imediatamente por razões técnicas ou de segurança.',
          en: 'Verbal command from the coach to immediately freeze or stop action for technical instruction or safety.',
        },
        examplePt: 'O professor gritou "Parou!" para evitar que as duplas se chocassem na borda.',
        exampleEn: 'The coach shouted "Stop!" to keep the pairs from bumping into each other near the edge.',
      },
      {
        id: 'vocab-1-2-2',
        termPt: 'Troca!',
        termEn: 'Switch! / Change partners!',
        context: {
          pt: 'Comando do instrutor indicando alternância de papéis (ataque e defesa) ou rotação para um novo companheiro de treino.',
          en: 'Instructor command signaling a switch of roles (attacker and defender) or rotation to a new training partner.',
        },
        examplePt: 'Acabou o tempo da posição; ouviu "Troca!", quem estava por baixo agora vai passar.',
        exampleEn: 'Time is up for the drill; when you hear "Switch!", the person on the bottom now passes.',
      },
      {
        id: 'vocab-1-2-3',
        termPt: 'Bater',
        termEn: 'Tap out / Signal submission',
        context: {
          pt: 'Ato de dar tapinhas no adversário ou no tatame (ou falar "pegou") para sinalizar submissão com segurança e evitar lesões.',
          en: 'Act of tapping the partner or mat (or verbally tapping) to yield safely to a submission and prevent injury.',
        },
        examplePt: 'Se a chave de braço estiver encaixada, bata com calma e logo para treinar com segurança.',
        exampleEn: 'If the armbar is locked in, tap early and smoothly so everyone trains safely.',
      },
    ],
    exercises: [
      {
        id: 'ex-1-2-mc1',
        type: 'multiple-choice',
        prompt: {
          pt: 'O que o professor quer dizer quando grita "Parou!"?',
          en: 'What does the instructor mean when shouting "Stop! / Break!"?',
        },
        options: [
          { pt: 'Aumentar a velocidade', en: 'Speed up' },
          { pt: 'Interromper a luta imediatamente', en: 'Pause or stop the roll immediately' },
          { pt: 'Mudar de posição', en: 'Change position' },
          { pt: 'Começar a lutar', en: 'Start rolling' },
        ],
        correctIndex: 1,
        explanation: {
          pt: 'Parou! / Break! significa parar o treino na hora.',
          en: 'Parou! / Break! instructs everyone to halt immediately.',
        },
      },
      {
        id: 'ex-1-2-recall1',
        type: 'translation-recall',
        prompt: {
          pt: 'Troca!',
          en: 'Switch! / Change partners!',
        },
        targetAnswer: {
          pt: 'Troca!',
          en: 'Switch!',
        },
        explanation: {
          pt: 'Usado para rotacionar parceiros de treino.',
          en: 'Used to instruct athletes to switch partners.',
        },
      },
    ],
  },
  'lesson-2-1': {
    id: 'lesson-2-1',
    unitId: 'unit-2',
    title: {
      pt: 'Guardas e Passagens',
      en: 'Guards & Passes',
    },
    objective: {
      pt: 'Domine a nomenclatura de posições fundamentais de guarda.',
      en: 'Master the terminology for fundamental guard positions.',
    },
    vocabulary: [
      {
        id: 'vocab-2-1-1',
        termPt: 'Guarda Fechada',
        termEn: 'Closed Guard',
        context: {
          pt: 'Posição de guarda fundamental em que o atleta por baixo mantém as pernas cruzadas atrás da lombar do adversário para controlar sua postura e abrir ataques.',
          en: 'Fundamental guard position where the bottom practitioner locks ankles around the opponent\'s lower back to break posture and launch attacks.',
        },
        examplePt: 'Quebre a postura do adversário antes de tentar abrir ataques da guarda fechada.',
        exampleEn: 'Break your opponent\'s posture before launching attacks from closed guard.',
      },
      {
        id: 'vocab-2-1-2',
        termPt: 'Passagem de Guarda',
        termEn: 'Guard Pass',
        context: {
          pt: 'Manobra ofensiva do atleta por cima para transpor as pernas do guardeiro e estabelecer uma posição dominante de controle (como o cem quilos ou a montada).',
          en: 'Offensive maneuver executed by the top player to clear the bottom player\'s legs and consolidate a dominant control position (such as side control or mount).',
        },
        examplePt: 'Ele conquistou três pontos ao concluir a passagem de guarda e estabilizar o cem quilos.',
        exampleEn: 'He scored three points after finishing the guard pass and stabilizing side control.',
      },
    ],
    exercises: [
      {
        id: 'ex-2-1-mc1',
        type: 'multiple-choice',
        prompt: {
          pt: 'Qual é a tradução de "Closed Guard"?',
          en: 'What is the translation of "Guarda Fechada"?',
        },
        options: [
          { pt: 'Guarda Fechada', en: 'Closed Guard' },
          { pt: 'Montada', en: 'Mount' },
          { pt: 'Controle Lateral', en: 'Side Control' },
          { pt: 'Raspagem', en: 'Sweep' },
        ],
        correctIndex: 0,
        explanation: {
          pt: 'Guarda Fechada equivale a Closed Guard.',
          en: 'Guarda Fechada is Closed Guard in English.',
        },
      },
    ],
  },
};

// Also alias lesson-1-1-pt, lesson-1-2-pt, etc. to ensure unit-1-pt from mock course works seamlessly
MOCK_LESSONS['lesson-1-1-pt'] = MOCK_LESSONS['lesson-1-1'];
MOCK_LESSONS['lesson-1-2-pt'] = MOCK_LESSONS['lesson-1-2'];
MOCK_LESSONS['lesson-2-1-pt'] = MOCK_LESSONS['lesson-2-1'];
