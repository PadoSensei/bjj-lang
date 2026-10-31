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
          pt: 'Usado para saudar, demonstrar respeito e concordância no tatame.',
          en: 'Used to greet, show respect, and express agreement on the mat.',
        },
        examplePt: 'Diga OSS ao cumprimentar o professor no início do treino.',
        exampleEn: 'Say OSS when greeting the instructor at the start of practice.',
      },
      {
        id: 'vocab-1-1-2',
        termPt: 'Cumprimentar',
        termEn: 'Bow / Shake hands',
        context: {
          pt: 'Fazer uma reverência ou apertar as mãos antes de iniciar o treino.',
          en: 'To bow or shake hands before starting practice.',
        },
        examplePt: 'Vamos cumprimentar o parceiro antes de começar o rola.',
        exampleEn: 'Let us bow to our partner before starting the spar.',
      },
      {
        id: 'vocab-1-1-3',
        termPt: 'Com licença',
        termEn: 'Excuse me',
        context: {
          pt: 'Usado ao entrar no tatame ou pedir passagem.',
          en: 'Used when entering the mat or asking to step through.',
        },
        examplePt: 'Com licença, posso entrar no tatame?',
        exampleEn: 'Excuse me, may I step onto the mat?',
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
          pt: 'Comando para interromper imediatamente a luta ou exercício.',
          en: 'Call to immediately pause fighting or drilling.',
        },
        examplePt: 'O professor gritou "Parou!" e todos interromperam a luta.',
        exampleEn: 'The instructor shouted "Stop!" and everyone halted the roll.',
      },
      {
        id: 'vocab-1-2-2',
        termPt: 'Troca!',
        termEn: 'Switch! / Change partners!',
        context: {
          pt: 'Comando para trocar de parceiro ou de posição.',
          en: 'Call to switch training partners or change roles.',
        },
        examplePt: 'Quando ouvir "Troca!", mude de parceiro rapidamente.',
        exampleEn: 'When you hear "Switch!", change partners quickly.',
      },
      {
        id: 'vocab-1-2-3',
        termPt: 'Bater / Tap out',
        termEn: 'Tap out / Signal submission',
        context: {
          pt: 'Sinalizar desistência durante uma finalização.',
          en: 'Signal submission when caught in a hold.',
        },
        examplePt: 'Se o golpe estiver encaixado, não hesite em bater.',
        exampleEn: 'If the submission is locked in, do not hesitate to tap out.',
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
          pt: 'Posição onde o atleta de baixo cruza as pernas atrás das costas do adversário.',
          en: 'Position where bottom athlete locks legs around opponent\'s back.',
        },
        examplePt: 'Mantenha a guarda fechada para controlar a postura do parceiro.',
        exampleEn: 'Keep closed guard to control your partner\'s posture.',
      },
      {
        id: 'vocab-2-1-2',
        termPt: 'Passagem de Guarda',
        termEn: 'Guard Pass',
        context: {
          pt: 'Ação de superar as pernas do adversário e dominar a posição.',
          en: 'Action of getting past opponent\'s legs to establish control.',
        },
        examplePt: 'Ele conseguiu a passagem de guarda com bom controle de quadril.',
        exampleEn: 'He completed the guard pass with solid hip control.',
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
