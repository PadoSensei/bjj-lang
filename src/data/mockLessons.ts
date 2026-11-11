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
  'lesson-1-3': {
    id: 'lesson-1-3',
    unitId: 'unit-1',
    title: {
      pt: 'Números e Respostas Básicas',
      en: 'Numbers & Basic Responses',
    },
    objective: {
      pt: 'Aprenda a contar repetições no treino e responder prontamente aos comandos do professor.',
      en: 'Learn to count repetitions during drills and respond promptly to instructor calls.',
    },
    vocabulary: [
      {
        id: 'vocab-1-3-1',
        termPt: 'Um',
        termEn: 'One',
        context: {
          pt: 'Primeiro número utilizado para iniciar a contagem de repetições em exercícios específicos ou aquecimento.',
          en: 'First number used to count repetitions during technical drills or warm-ups.',
        },
        examplePt: 'Vamos fazer cinco repetições de raspagem: um, dois, três, quatro, cinco.',
        exampleEn: "Let's do five sweep repetitions: one, two, three, four, five.",
      },
      {
        id: 'vocab-1-3-2',
        termPt: 'Dois',
        termEn: 'Two',
        context: {
          pt: 'Segundo número da contagem rítmica de posições no tatame.',
          en: 'Second number in the rhythmic cadence of mat drills.',
        },
        examplePt: 'Faça duas entradas de queda antes de mudar o lado.',
        exampleEn: 'Do two takedown entries before changing sides.',
      },
      {
        id: 'vocab-1-3-3',
        termPt: 'Três',
        termEn: 'Three',
        context: {
          pt: 'Número frequentemente usado em séries de três repetições ou na contagem regressiva para iniciar o rola.',
          en: 'Number commonly used for sets of three repetitions or countdowns to start rolling.',
        },
        examplePt: 'O professor contou até três e todos bateram palmas juntos.',
        exampleEn: 'The instructor counted to three and everyone clapped together.',
      },
      {
        id: 'vocab-1-3-4',
        termPt: 'Quatro',
        termEn: 'Four',
        context: {
          pt: 'Número que também corresponde aos quatro pontos concedidos por montada ou pegada de costas no Jiu-Jitsu.',
          en: 'Number that also corresponds to the four points awarded for mount or back control in BJJ.',
        },
        examplePt: 'Estabilize a posição por três segundos para confirmar quatro pontos.',
        exampleEn: 'Stabilize the position for three seconds to secure four points.',
      },
      {
        id: 'vocab-1-3-5',
        termPt: 'Cinco',
        termEn: 'Five',
        context: {
          pt: 'Duração padrão comum para rounds de rola na academia (cinco minutos).',
          en: 'Common standard round length for sparring at the academy (five minutes).',
        },
        examplePt: 'Faltam cinco minutos para terminar o treino livre.',
        exampleEn: 'There are five minutes remaining in open sparring.',
      },
      {
        id: 'vocab-1-3-6',
        termPt: 'Sim',
        termEn: 'Yes',
        context: {
          pt: 'Resposta afirmativa direta dada ao parceiro ou ao professor para confirmar instruções ou bem-estar.',
          en: 'Direct affirmative answer given to training partners or coach to confirm instructions or well-being.',
        },
        examplePt: 'O professor perguntou se todos entenderam a posição e a turma respondeu: "Sim!".',
        exampleEn: 'The professor asked if everyone understood the technique and the class answered: "Yes!".',
      },
      {
        id: 'vocab-1-3-7',
        termPt: 'Não',
        termEn: 'No',
        context: {
          pt: 'Resposta negativa importante para comunicação de segurança e ajuste de limites durante os treinos.',
          en: 'Crucial negative response for safety communication and setting boundaries during practice.',
        },
        examplePt: 'Não force a cervical se o colega não puder girar.',
        exampleEn: "Don't force the neck if your partner cannot roll through.",
      },
      {
        id: 'vocab-1-3-8',
        termPt: 'Pronto',
        termEn: 'Ready',
        context: {
          pt: 'Confirmação verbal indicando que o praticante já amarrou a faixa, ajustou o kimono ou está preparado para iniciar o rola.',
          en: 'Verbal confirmation signaling the athlete has tied their belt, adjusted the gi, or is fully prepared to roll.',
        },
        examplePt: 'Amarrei a faixa e já estou pronto para o próximo rola.',
        exampleEn: 'I tied my belt and I am ready for the next round.',
      },
      {
        id: 'vocab-1-3-9',
        termPt: 'Entendi',
        termEn: 'I understand / Got it',
        context: {
          pt: 'Confirmação clara de que a instrução técnica ou detalhe demonstrado pelo mestre foi compreendido perfeitamente.',
          en: 'Clear acknowledgement that the technique detail or coaching guidance was understood.',
        },
        examplePt: 'Entendi o detalhe da pegada na gola, vou praticar agora.',
        exampleEn: 'I understand the collar grip detail, I will practice it now.',
      },
    ],
    exercises: [
      {
        id: 'ex-1-3-mc1',
        type: 'multiple-choice',
        prompt: {
          pt: 'Qual resposta confirma que você compreendeu a instrução técnica do professor?',
          en: 'Which response confirms that you understood the technical instruction from the coach?',
        },
        options: [
          { pt: 'Não', en: 'No' },
          { pt: 'Entendi', en: 'I understand / Got it' },
          { pt: 'Quatro', en: 'Four' },
          { pt: 'Bater', en: 'Tap out' },
        ],
        correctIndex: 1,
        explanation: {
          pt: 'Entendi expressa que a instrução técnica foi compreendida.',
          en: 'Entendi signals that you understand or got the coach\'s explanation.',
        },
      },
      {
        id: 'ex-1-3-recall1',
        type: 'translation-recall',
        prompt: {
          pt: 'Três',
          en: 'Three',
        },
        targetAnswer: {
          pt: 'Três',
          en: 'Three',
        },
        explanation: {
          pt: 'Três é o terceiro número da contagem de repetições.',
          en: 'Three is the third number when counting drill repetitions.',
        },
      },
      {
        id: 'ex-1-3-mc2',
        type: 'multiple-choice',
        prompt: {
          pt: 'O que você diz para avisar ao parceiro que você está preparado para começar o rola?',
          en: 'What do you say to let your partner know you are prepared to start rolling?',
        },
        options: [
          { pt: 'Pronto', en: 'Ready' },
          { pt: 'Parou!', en: 'Stop!' },
          { pt: 'Um', en: 'One' },
          { pt: 'Troca!', en: 'Switch!' },
        ],
        correctIndex: 0,
        explanation: {
          pt: 'Pronto significa que você está preparado para lutar.',
          en: 'Pronto means ready to begin training or sparring.',
        },
      },
      {
        id: 'ex-1-3-recall2',
        type: 'translation-recall',
        prompt: {
          pt: 'Pronto',
          en: 'Ready',
        },
        targetAnswer: {
          pt: 'Pronto',
          en: 'Ready',
        },
        explanation: {
          pt: 'Usado para confirmar prontidão antes do início da luta.',
          en: 'Used to confirm readiness before sparring starts.',
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
  'lesson-2-2': {
    id: 'lesson-2-2',
    unitId: 'unit-2',
    title: {
      pt: 'Saídas e Posturas Defensivas',
      en: 'Escapes & Defensive Postures',
    },
    objective: {
      pt: 'Reconheça e comunique termos fundamentais de saídas de posições de sufoco e posturas defensivas no tatame.',
      en: 'Recognize and communicate fundamental terms for escaping tough positions and maintaining defensive postures on the mats.',
    },
    vocabulary: [
      {
        id: 'vocab-2-2-1',
        termPt: 'Ponte / Upa',
        termEn: 'Bridge / Upa',
        context: {
          pt: 'Movimento explosivo de elevar o quadril empurrando o chão com os pés para desequilibrar o oponente montado ou criar espaço.',
          en: 'Explosive hip extension pushing off the mat with the feet to off-balance a mounted opponent or generate space.',
        },
        examplePt: 'Faça uma ponte forte para desequilibrar o adversário antes de sair da montada.',
        exampleEn: 'Execute a strong bridge to off-balance your opponent before escaping mount.',
      },
      {
        id: 'vocab-2-2-2',
        termPt: 'Fuga de Quadril / Shrimp',
        termEn: 'Shrimp / Hip Escape',
        context: {
          pt: 'Movimento fundamental de quadril em direção contrária ao oponente para criar espaço e repor a guarda.',
          en: 'Core movement sliding hips away from the opponent to generate space and recover guard.',
        },
        examplePt: 'Depois da ponte, faça a fuga de quadril imediatamente para colocar o joelho para dentro.',
        exampleEn: 'Right after the bridge, shrimp immediately to slide your knee back inside.',
      },
      {
        id: 'vocab-2-2-3',
        termPt: 'Frame / Estrutura de Braços',
        termEn: 'Frame / Framing',
        context: {
          pt: 'Uso dos antebraços e braços como estrutura ou barreira óssea para impedir a aproximação e pressão do adversário.',
          en: 'Using forearms and arms as a structural bone wedge to prevent the opponent from flattening you with heavy pressure.',
        },
        examplePt: 'Mantenha os frames no pescoço e no quadril dele para aliviar o peso no cem quilos.',
        exampleEn: 'Maintain frames against their neck and hip to relieve the pressure in side control.',
      },
      {
        id: 'vocab-2-2-4',
        termPt: 'Gancho por Baixo / Underhook',
        termEn: 'Underhook',
        context: {
          pt: 'Controle em que você passa seu braço por baixo da axila do oponente para controlar a distância, subir ou contra-atacar.',
          en: 'Pummeling control where you pass your arm underneath the opponent\'s armpit to control distance, sit up, or turn the corner.',
        },
        examplePt: 'Conquiste o underhook na meia-guarda para evitar ser amassado e poder subir.',
        exampleEn: 'Secure the underhook from half guard to keep from getting flattened and begin sitting up.',
      },
      {
        id: 'vocab-2-2-5',
        termPt: 'Saída de Cotovelo',
        termEn: 'Elbow Escape / Knee-Elbow Escape',
        context: {
          pt: 'Método defensivo tradicional de conectar o cotovelo ao joelho por baixo da montada ou controle lateral para recompor a guarda.',
          en: 'Traditional defense connecting elbow to knee underneath mount or side control to slide a leg in and recover guard.',
        },
        examplePt: 'Conecte o cotovelo ao joelho e trabalhe a saída de cotovelo com calma.',
        exampleEn: 'Connect your elbow to your knee and work the elbow escape patiently.',
      },
      {
        id: 'vocab-2-2-6',
        termPt: 'Posição de Tartaruga / Quatro Apoios',
        termEn: 'Turtle Position',
        context: {
          pt: 'Postura defensiva de quatro apoios no solo com cotovelos e joelhos recolhidos para evitar a passagem de guarda e pontos.',
          en: 'Defensive ground posture curled on knees and elbows to prevent guard pass points and protect against submissions.',
        },
        examplePt: 'Se a guarda for passada, feche os cotovelos e proteja o pescoço na posição de tartaruga.',
        exampleEn: 'If your guard is passed, tuck your elbows and protect your neck in turtle position.',
      },
      {
        id: 'vocab-2-2-7',
        termPt: 'Postura',
        termEn: 'Posture',
        context: {
          pt: 'Alinhamento ereto da coluna e cabeça que impede que o oponente por baixo quebre seu equilíbrio e feche estrangulamentos.',
          en: 'Upright alignment of spine and head preventing the bottom guard player from breaking your balance and locking submissions.',
        },
        examplePt: 'Mantenha a postura na guarda fechada com o olhar para frente e a coluna ereta.',
        exampleEn: 'Keep your posture inside closed guard with your eyes forward and spine straight.',
      },
      {
        id: 'vocab-2-2-8',
        termPt: 'Base',
        termEn: 'Base',
        context: {
          pt: 'Estabilidade corporal e distribuição equilibrada de peso sobre os apoios para evitar raspagens e desequilíbrios.',
          en: 'Physical stability and balanced weight distribution over contact points to prevent sweeps and balance disruption.',
        },
        examplePt: 'Abra os joelhos e abaixe o centro de gravidade para não perder a base.',
        exampleEn: 'Widen your knees and lower your center of gravity so you do not lose your base.',
      },
      {
        id: 'vocab-2-2-9',
        termPt: 'Postura Defensiva',
        termEn: 'Defensive Posture',
        context: {
          pt: 'Posicionamento compacto com braços colados ao tronco e queixo protegido para neutralizar tentativas de finalização.',
          en: 'Compact body positioning with arms tight to ribs and chin tucked to neutralize submission threats.',
        },
        examplePt: 'Quando estiver sob pressão, adote uma postura defensiva antes de tentar qualquer saída.',
        exampleEn: 'When under heavy pressure, assume a defensive posture before attempting any escape.',
      },
    ],
    exercises: [
      {
        id: 'ex-2-2-mc1',
        type: 'multiple-choice',
        prompt: {
          pt: 'Qual termo em inglês descreve a elevação explosiva do quadril para sair da montada?',
          en: 'Which English term describes an explosive hip lift used to escape from mount?',
        },
        options: [
          { pt: 'Bridge / Upa', en: 'Bridge / Upa' },
          { pt: 'Turtle Position', en: 'Turtle Position' },
          { pt: 'Underhook', en: 'Underhook' },
          { pt: 'Elbow Escape', en: 'Elbow Escape' },
        ],
        correctIndex: 0,
        explanation: {
          pt: '"Bridge / Upa" é o movimento de ponte que projeta o quadril para cima desequilibrando o oponente.',
          en: '"Bridge / Upa" refers to the bridging hip thrust used to off-balance the opponent.',
        },
      },
      {
        id: 'ex-2-2-mc2',
        type: 'multiple-choice',
        prompt: {
          pt: 'Se o professor grita "Make frames!", o que ele quer que você faça no tatame?',
          en: 'If your coach calls out "Faça frames!", what are they instructing you to do on the mats?',
        },
        options: [
          {
            pt: 'Bater imediatamente para desistir da luta',
            en: 'Tap out immediately to concede the sparring round',
          },
          {
            pt: 'Usar os antebraços e braços como estrutura para criar espaço e aliviar a pressão',
            en: 'Use your forearms and arms as structural barriers to create space and relieve pressure',
          },
          {
            pt: 'Ficar de pé e se afastar completamente do tatame',
            en: 'Stand up and walk completely off the mat area',
          },
          {
            pt: 'Atacar uma chave de braço ou triângulo por baixo',
            en: 'Attack an armbar or triangle choke from the bottom',
          },
        ],
        correctIndex: 1,
        explanation: {
          pt: 'Fazer "frames" significa criar estruturas rígidas com braços e antebraços para bloquear a pressão e ganhar espaço.',
          en: 'Making "frames" means establishing rigid forearm or arm barriers to block pressure and manage space.',
        },
      },
      {
        id: 'ex-2-2-recall1',
        type: 'translation-recall',
        prompt: {
          pt: 'Como você traduz o comando de saída "Ponte e fuga de quadril" para o inglês?',
          en: 'How do you say the escape instruction "Bridge and shrimp" in Portuguese?',
        },
        targetAnswer: {
          pt: 'Ponte e fuga de quadril',
          en: 'Bridge and shrimp',
        },
        hint: {
          pt: 'Upa e movimento de quadril.',
          en: 'Hip extension followed by hip escape.',
        },
        explanation: {
          pt: '"Bridge and shrimp" combina a ponte explosiva com o deslocamento do quadril para recompor a guarda.',
          en: '"Ponte e fuga de quadril" pairs the explosive bridge with a hip escape to recover guard.',
        },
      },
      {
        id: 'ex-2-2-recall2',
        type: 'translation-recall',
        prompt: {
          pt: 'Como você diz a instrução "Mantenha a postura" em inglês?',
          en: 'How do you say the coaching call "Keep your posture" in Portuguese?',
        },
        targetAnswer: {
          pt: 'Mantenha a postura',
          en: 'Keep your posture',
        },
        hint: {
          pt: 'Coluna ereta e cabeça erguida.',
          en: 'Straight spine and upright head.',
        },
        explanation: {
          pt: '"Keep your posture" é o comando para evitar que a cabeça e a coluna sejam puxadas para baixo.',
          en: '"Mantenha a postura" is the instruction to keep your spine upright and prevent being broken down.',
        },
      },
    ],
  },
  'lesson-3-1': {
    id: 'lesson-3-1',
    unitId: 'unit-3',
    title: {
      pt: 'Finalizações da Guarda',
      en: 'Submissions from Guard',
    },
    objective: {
      pt: 'Aprenda os nomes das finalizações clássicas aplicadas a partir da guarda e a linguagem de ataque e controle no tatame.',
      en: 'Learn the names of classic submissions applied from guard and key attacking cues and controls on the mats.',
    },
    vocabulary: [
      {
        id: 'vocab-3-1-1',
        termPt: 'Chave de braço',
        termEn: 'Armbar',
        phonetic: 'SHAH-vee jee BRAH-soo',
        context: {
          pt: 'Finalização que aplica uma alavanca articular estendendo a articulação do cotovelo do adversário contra o quadril.',
          en: 'Joint lock submission that isolates and hyperextends the opponent\'s elbow joint using the hips as a fulcrum.',
        },
        examplePt: 'Ele laçou o braço do adversário da guarda fechada e encaixou a chave de braço com firmeza.',
        exampleEn: 'He trapped the opponent\'s arm from closed guard and locked in a tight armbar.',
      },
      {
        id: 'vocab-3-1-2',
        termPt: 'Triângulo',
        termEn: 'Triangle',
        phonetic: 'tree-AHN-goo-loo',
        context: {
          pt: 'Estrangulamento com as pernas em formato triangular que comprime as artérias carótidas com a própria coxa e o ombro do adversário.',
          en: 'Strangulation using the legs locked in a figure-four triangle around the neck and one arm, compressing the carotid arteries.',
        },
        examplePt: 'Quando o oponente colocou um braço para dentro e outro para fora, ele fechou o triângulo.',
        exampleEn: 'When the opponent left one arm in and one arm out, he snapped the triangle closed.',
      },
      {
        id: 'vocab-3-1-3',
        termPt: 'Kimura',
        termEn: 'Kimura',
        phonetic: 'kee-MOO-rah',
        context: {
          pt: 'Alavanca articular de ombro com pegada em quatro (dupla no punho) que gira o braço do oponente para trás de suas costas.',
          en: 'Shoulder lock utilizing a figure-four double-wrist grip to rotate the opponent\'s humerus and shoulder behind their back.',
        },
        examplePt: 'Ele quebrou a postura, segurou o punho e atacou uma kimura rápida da guarda fechada.',
        exampleEn: 'He broke the posture, isolated the wrist, and attacked a quick kimura from closed guard.',
      },
      {
        id: 'vocab-3-1-4',
        termPt: 'Omoplata',
        termEn: 'Omoplata',
        phonetic: 'oh-moh-PLAH-tah',
        context: {
          pt: 'Chave de ombro executada com o uso das pernas, isolando o braço do adversário e forçando a rotação ao sentar paralelamente.',
          en: 'Shoulder lock executed using the legs to entangle the opponent\'s arm and apply rotation as the guard player sits up alongside.',
        },
        examplePt: 'O adversário escondeu o braço para defender o triângulo e acabou caindo na omoplata.',
        exampleEn: 'The opponent hid their arm to defend the triangle and transitioned right into an omoplata.',
      },
      {
        id: 'vocab-3-1-5',
        termPt: 'Guilhotina',
        termEn: 'Guillotine',
        phonetic: 'gee-lyoh-CHEE-nah',
        context: {
          pt: 'Estrangulamento frontal que envolve o pescoço do adversário por baixo do braço do atacante quando a cabeça é abaixada.',
          en: 'Front headlock choke wrapping an arm around the opponent\'s trachea or carotid arteries when their head is low.',
        },
        examplePt: 'Ele aproveitou que o adversário mergulhou no quadril sem postura e puxou para a guilhotina.',
        exampleEn: 'He capitalized on the opponent shooting in with broken posture and snapped on a guillotine.',
      },
      {
        id: 'vocab-3-1-6',
        termPt: 'Estrangulamento cruzado',
        termEn: 'Cross-collar choke',
        phonetic: 'es-trang-goo-lah-MEN-too kroo-ZAH-doo',
        context: {
          pt: 'Estrangulamento tradicional de kimono com as mãos cruzadas nas golas profundas do adversário a partir da guarda.',
          en: 'Traditional gi collar choke executed with four fingers deep in opposite collars from inside closed guard.',
        },
        examplePt: 'Com duas pegadas fundas na gola cruzada, ele puxou o oponente com as pernas para finalizar.',
        exampleEn: 'With two deep cross-collar grips, he pulled with his legs to finish the choke.',
      },
      {
        id: 'vocab-3-1-7',
        termPt: 'Quebrar a postura',
        termEn: 'Break posture',
        phonetic: 'kay-BRAHR ah pohs-TOO-rah',
        context: {
          pt: 'Ação técnica essencial da guarda de puxar o oponente para frente com braços e pernas, impedindo que mantenha a coluna ereta.',
          en: 'Essential guard action of pulling the opponent forward with arms and legs, destroying their upright spinal alignment.',
        },
        examplePt: 'Antes de atacar qualquer finalização da guarda fechada, você deve quebrar a postura do adversário.',
        exampleEn: 'Before attacking any submission from closed guard, you must break the opponent\'s posture.',
      },
      {
        id: 'vocab-3-1-8',
        termPt: 'Pegada na gola',
        termEn: 'Collar grip',
        phonetic: 'peh-GAH-dah nah GOH-lah',
        context: {
          pt: 'Controle firme de mão segurando a lapela ou gola do kimono para guiar a cabeça do adversário e controlar a distância.',
          en: 'Firm hand grip securing the gi collar or lapel to manage head distance, control balance, and establish chokes.',
        },
        examplePt: 'Faça uma pegada forte na gola alta para manter o oponente colado e controlar a distância.',
        exampleEn: 'Secure a high collar grip to keep the opponent pulled tight and manage the distance.',
      },
      {
        id: 'vocab-3-1-9',
        termPt: 'Ajustar o ângulo',
        termEn: 'Adjust the angle',
        phonetic: 'ah-zhoos-TAHR oo AHN-goo-loo',
        context: {
          pt: 'Movimentação de quadril para sair do alinhamento frontal com o adversário, criando um ângulo favorável para encaixar ataques.',
          en: 'Hip shift to move perpendicular or offset from the opponent\'s centerline, creating an optimal angle to lock attacks.',
        },
        examplePt: 'Saia o quadril de lado para ajustar o ângulo e fechar o triângulo sem esforço.',
        exampleEn: 'Shift your hips sideways to adjust the angle and lock the triangle choke effortlessly.',
      },
      {
        id: 'vocab-3-1-10',
        termPt: 'Finalização',
        termEn: 'Submission',
        phonetic: 'fee-nah-lee-zah-SOW',
        context: {
          pt: 'Desfecho de um golpe articular ou estrangulamento que força o adversário a sinalizar desistência (bater).',
          en: 'The successful completion of a choke or joint lock that obligates the opponent to concede the match by tapping.',
        },
        examplePt: 'Ele manteve a posição justa com paciência até conseguir a finalização.',
        exampleEn: 'He held the tight position patiently until he secured the submission.',
      },
    ],
    exercises: [
      {
        id: 'ex-3-1-mc1',
        type: 'multiple-choice',
        prompt: {
          pt: 'Qual finalização da guarda isola o braço do oponente e estende a articulação do cotovelo?',
          en: 'Which guard submission isolates the opponent\'s arm and hyperextends the elbow joint?',
        },
        options: [
          { pt: 'Chave de braço', en: 'Armbar' },
          { pt: 'Guilhotina', en: 'Guillotine' },
          { pt: 'Quebrar a postura', en: 'Break posture' },
          { pt: 'Pegada na gola', en: 'Collar grip' },
        ],
        correctIndex: 0,
        explanation: {
          pt: 'A chave de braço (armbar) é a finalização que hiperextende o cotovelo usando o quadril como alavanca.',
          en: 'The armbar (chave de braço) is the joint lock that hyperextends the elbow using the hips as a fulcrum.',
        },
      },
      {
        id: 'ex-3-1-mc2',
        type: 'multiple-choice',
        prompt: {
          pt: 'Por que é fundamental "quebrar a postura" do adversário antes de atacar da guarda?',
          en: 'Why is it crucial to "break posture" before attacking submissions from the guard?',
        },
        options: [
          {
            pt: 'Para permitir que ele passe a sua guarda mais facilmente',
            en: 'To allow them to pass your guard more easily',
          },
          {
            pt: 'Para tirar o equilíbrio e a distância do oponente, abrindo espaço para ataques',
            en: 'To take away the opponent\'s balance and distance, opening up attacks',
          },
          {
            pt: 'Para descansar enquanto o adversário fica de pé',
            en: 'To rest while the opponent stands up',
          },
          {
            pt: 'Para avisar ao juiz que a luta acabou',
            en: 'To signal the referee that the round is finished',
          },
        ],
        correctIndex: 1,
        explanation: {
          pt: 'Quebrar a postura do oponente anula a base dele e aproxima a cabeça e os braços para as finalizações.',
          en: 'Breaking posture breaks the opponent\'s structural base and brings their head and arms within submission range.',
        },
      },
      {
        id: 'ex-3-1-recall1',
        type: 'translation-recall',
        prompt: {
          pt: 'Como você traduz o comando de ataque "Ajustar o ângulo para o triângulo" em inglês?',
          en: 'How do you say "Adjust the angle for the triangle" in Portuguese?',
        },
        targetAnswer: {
          pt: 'Ajustar o ângulo para o triângulo',
          en: 'Adjust the angle for the triangle',
        },
        hint: {
          pt: 'Mudar a posição do quadril para fechar o estrangulamento.',
          en: 'Shifting the hips to lock the choke.',
        },
        explanation: {
          pt: '"Adjust the angle" significa sair do alinhamento reto para travar as pernas no triângulo.',
          en: '"Ajustar o ângulo" describes shifting off the centerline to lock the legs around the neck and shoulder.',
        },
      },
      {
        id: 'ex-3-1-recall2',
        type: 'translation-recall',
        prompt: {
          pt: 'Como você traduz a instrução essencial "Quebrar a postura com a pegada na gola" em inglês?',
          en: 'How do you say "Break posture with the collar grip" in Portuguese?',
        },
        targetAnswer: {
          pt: 'Quebrar a postura com a pegada na gola',
          en: 'Break posture with the collar grip',
        },
        hint: {
          pt: 'Puxar o oponente para baixo usando o kimono.',
          en: 'Pulling the opponent forward and down using the gi.',
        },
        explanation: {
          pt: '"Break posture with the collar grip" orienta o uso da gola para desestabilizar o adversário na guarda.',
          en: '"Quebrar a postura com a pegada na gola" instructs using the collar to disrupt the opponent\'s spine and balance from guard.',
        },
      },
    ],
  },
  'lesson-3-2': {
    id: 'lesson-3-2',
    unitId: 'unit-3',
    title: {
      pt: 'Sparring e Diálogo no Tatame',
      en: 'Sparring & Mat Dialogue',
    },
    objective: {
      pt: 'Aprenda expressões essenciais de comunicação, ritmo e etiqueta durante o rola e treinos no tatame.',
      en: 'Learn essential phrases for communication, pace, and etiquette during rolling and sparring on the mats.',
    },
    vocabulary: [
      {
        id: 'vocab-3-2-1',
        termPt: 'Rola / Rolar',
        termEn: 'Roll / Rolling (Sparring)',
        phonetic: 'HOH-lah / hoh-LAHR',
        context: {
          pt: 'Termo central do Jiu-Jitsu que designa o combate livre e a prática de sparring entre parceiros na academia.',
          en: 'Core BJJ term referring to free sparring practice and live rounds between partners at the academy.',
        },
        examplePt: 'Depois da parte técnica, teremos trinta minutos de rola livre.',
        exampleEn: 'After the technique portion, we will have thirty minutes of live rolling.',
      },
      {
        id: 'vocab-3-2-2',
        termPt: 'Quer rolar? / Vamos rolar?',
        termEn: 'Want to roll? / Would you like to roll?',
        phonetic: 'KEHR hoh-LAHR / VAH-mohs hoh-LAHR',
        context: {
          pt: 'Convite cortês e tradicional feito a um companheiro de treino para iniciar um round de sparring.',
          en: 'Polite and customary invitation extended to a training partner to begin a sparring round together.',
        },
        examplePt: 'Ele cumprimentou o colega de treino e perguntou: "Quer rolar este round?".',
        exampleEn: 'He greeted his training partner and asked: "Want to roll this round?".',
      },
      {
        id: 'vocab-3-2-3',
        termPt: 'Soltinho / Treino leve',
        termEn: 'Flow roll / Light roll',
        phonetic: 'sohl-CHEEN-yoo / TRAY-noo LEH-vee',
        context: {
          pt: 'Expressão informal de academia usada para combinar um rola soltinho focado em transições fluidas e técnica, com pouca força e ritmo controlado.',
          en: 'Informal academy expression used to agree on a light flow roll focused on fluid transitions and technique, with low strength and controlled pacing.',
        },
        examplePt: 'Estou voltando de lesão no joelho, vamos fazer só um soltinho hoje?',
        exampleEn: 'I am coming back from a knee injury, can we just do a light flow roll today?',
      },
      {
        id: 'vocab-3-2-4',
        termPt: 'Pegou!',
        termEn: 'Got me! / It caught!',
        phonetic: 'peh-GOH',
        context: {
          pt: 'Reconhecimento verbal usado no rola para sinalizar que a finalização foi encaixada com firmeza, funcionando como aviso de segurança e reset do round quando não é possível bater com as mãos.',
          en: 'Verbal acknowledgement used during rolling to signal that a submission is cleanly locked in, serving as a safety reset when hands are trapped.',
        },
        examplePt: 'Quando a guilhotina ajustou no pescoço e os braços estavam presos, ele avisou claramente: "Pegou!".',
        exampleEn: 'When the guillotine tightened and his arms were trapped, he called out clearly: "Got me!".',
      },
      {
        id: 'vocab-3-2-5',
        termPt: 'Mais um?',
        termEn: 'One more round?',
        phonetic: 'MY-eez OOM',
        context: {
          pt: 'Pergunta natural ao fim de um round para convidar o mesmo parceiro a continuar treinando no round seguinte.',
          en: 'Natural question at the end of a round asking your partner if they want to keep training for another round.',
        },
        examplePt: 'O cronômetro apitou, os dois beberam água e ele perguntou: "Aguenta mais um?".',
        exampleEn: 'The timer went off, both had a sip of water, and he asked: "Up for one more round?".',
      },
      {
        id: 'vocab-3-2-6',
        termPt: 'Volta no meio',
        termEn: 'Reset to the center / Back to center',
        phonetic: 'VOHL-tah noo MAY-oo',
        context: {
          pt: 'Pedido feito ao parceiro para interromper a luta e retornar ao centro da área de treino por segurança quando chegam perto da parede ou de outras duplas.',
          en: 'Call made to your partner to halt action and return to the center of the mat area for safety when drifting close to walls or other pairs.',
        },
        examplePt: 'Estamos encostando na parede do tatame, vamos parar e voltar no meio.',
        exampleEn: 'We are getting too close to the mat wall, let us pause and reset to the center.',
      },
      {
        id: 'vocab-3-2-7',
        termPt: 'Começa de pé ou de baixo?',
        termEn: 'Start standing or on the knees/ground?',
        phonetic: 'koh-MEH-sah jee PEH oh jee BY-shoo',
        context: {
          pt: 'Diálogo prévio ao rola para combinar se a disputa iniciará em pé (com quedas) ou se um dos dois puxará para a guarda por segurança e espaço.',
          en: 'Pre-roll conversation to agree whether to begin standing (with takedowns) or starting from the knees/guard for safety and mat space.',
        },
        examplePt: 'O tatame está cheio hoje, então perguntou: "Começa de pé ou de baixo?".',
        exampleEn: 'The mat is crowded today, so he asked: "Start standing or on the ground?".',
      },
      {
        id: 'vocab-3-2-8',
        termPt: 'Posso passar ou você puxa?',
        termEn: 'Can I pass or are you pulling?',
        phonetic: 'POH-soo pah-SAHR oh voh-SEH POO-shah',
        context: {
          pt: 'Frase conversacional comum no início do treino para definir amigavelmente quem começará jogando por cima passando e quem fará guarda.',
          en: 'Common conversational phrase at the start of a roll to casually establish who plays top passing and who pulls guard.',
        },
        examplePt: 'Ao cumprimentar de joelhos, ele combinou com o parceiro: "Posso passar ou você puxa?".',
        exampleEn: 'Slapping hands from the knees, he asked his partner: "Can I pass or are you pulling guard?".',
      },
      {
        id: 'vocab-3-2-9',
        termPt: 'Devagar / Com calma',
        termEn: 'Slow down / Take it easy',
        phonetic: 'deh-vah-GAHR / kohm KAHL-mah',
        context: {
          pt: 'Comunicação direta para pedir ao parceiro que diminua a velocidade ou a intensidade excessiva, priorizando o controle técnico.',
          en: 'Direct communication asking a partner to lower excessive intensity or speed, prioritizing technical control.',
        },
        examplePt: 'Se o parceiro estiver afobado e usando muita força, respire e fale: "Com calma, devagar".',
        exampleEn: 'If your partner is rushing and using too much force, breathe and say: "Take it easy, slow down".',
      },
      {
        id: 'vocab-3-2-10',
        termPt: 'Obrigado pelo treino',
        termEn: 'Thank you for the roll / training',
        phonetic: 'oh-bree-GAH-doo PEH-loo TRAY-noo',
        context: {
          pt: 'Agradecimento cordial indispensável e sinal de respeito mútuo ao encerrar o rola com um colega de tatame.',
          en: 'Essential polite acknowledgement and sign of mutual respect when concluding a roll with a training partner.',
        },
        examplePt: 'Ao término do round de cinco minutos, aperte a mão do colega e diga: "Obrigado pelo treino".',
        exampleEn: 'At the end of the five-minute round, shake your partner\'s hand and say: "Thank you for the roll".',
      },
    ],
    exercises: [
      {
        id: 'ex-3-2-mc1',
        type: 'multiple-choice',
        prompt: {
          pt: 'Quando seu colega de tatame pergunta: "Vamos fazer um soltinho?", o que ele está propondo para o rola?',
          en: 'When your training partner asks "Vamos fazer um soltinho?", what kind of roll are they proposing?',
        },
        options: [
          {
            pt: 'Um treino em ritmo de final de campeonato, com força máxima e disputa de pontos',
            en: 'A tournament-finals pace with maximum force and intense score battle',
          },
          {
            pt: 'Um treino leve e fluido, com ritmo controlado e foco em movimentação técnica',
            en: 'A light, relaxed flow roll with controlled pace and focus on technical movement',
          },
          {
            pt: 'Uma sessão apenas de flexões e abdominais fora do tatame',
            en: 'A conditioning workout of push-ups and sit-ups off the mat',
          },
          {
            pt: 'Encerrar a aula e não lutar mais naquele dia',
            en: 'End class and stop training for the day',
          },
        ],
        correctIndex: 1,
        explanation: {
          pt: '"Soltinho" é uma expressão comum no Jiu-Jitsu que indica um rola mais leve e técnico, sem disputa de força excessiva.',
          en: '"Soltinho" is a colloquial BJJ term indicating a lighter, technical flow roll rather than a high-intensity battle.',
        },
      },
      {
        id: 'ex-3-2-mc2',
        type: 'multiple-choice',
        prompt: {
          pt: 'Por que durante o rola um dos parceiros diz "Volta no meio"?',
          en: 'Why would a partner say "Volta no meio" during a roll?',
        },
        options: [
          {
            pt: 'Para indicar que desistiu do treino e quer ir embora',
            en: 'To signal they are quitting the roll and going home',
          },
          {
            pt: 'Para pedir que reiniciem a movimentação no centro do tatame por segurança, evitando paredes ou colisões',
            en: 'To request resetting in the center of the mat for safety, avoiding walls or collisions',
          },
          {
            pt: 'Para solicitar que o parceiro aumente a velocidade dos ataques',
            en: 'To request that the partner speed up their submission attacks',
          },
          {
            pt: 'Para pedir que o professor cronometre o tempo do round',
            en: 'To ask the coach to start timing the round',
          },
        ],
        correctIndex: 1,
        explanation: {
          pt: '"Volta no meio" é o aviso de segurança para reposicionar a luta no centro da área de combate e evitar acidentes.',
          en: '"Volta no meio" is the safety call to reset the sparring round toward the mat center away from hazards.',
        },
      },
      {
        id: 'ex-3-2-recall1',
        type: 'translation-recall',
        prompt: {
          pt: 'Como você agradece cordialmente ao parceiro ao término de um rola em inglês?',
          en: 'How do you politely thank your partner at the end of a roll in Portuguese?',
        },
        targetAnswer: {
          pt: 'Obrigado pelo treino',
          en: 'Thank you for the roll',
        },
        hint: {
          pt: 'Gratidão respeitosa após a luta.',
          en: 'Respectful appreciation after rolling.',
        },
        explanation: {
          pt: '"Obrigado pelo treino" / "Thank you for the roll" expressa gratidão e respeito mútuo ao fim do combate.',
          en: '"Obrigado pelo treino" / "Thank you for the roll" expresses gratitude and sportsmanship after training together.',
        },
      },
      {
        id: 'ex-3-2-recall2',
        type: 'translation-recall',
        prompt: {
          pt: 'Quando você é pego em uma finalização justa e suas mãos estão presas, que palavra você fala para reconhecer o golpe com segurança?',
          en: 'When caught in a tight submission with hands trapped, what Portuguese call acknowledges that the hold is secured?',
        },
        targetAnswer: {
          pt: 'Pegou!',
          en: 'Got me!',
        },
        hint: {
          pt: 'Aviso verbal de submissão e segurança no tatame.',
          en: 'Verbal reset cue signaling the hold is locked in.',
        },
        explanation: {
          pt: '"Pegou!" é o aviso verbal imediato indicando que o golpe encaixou, protegendo a integridade física dos parceiros.',
          en: '"Pegou!" ("Got me!") is the immediate verbal cue signaling the submission is secured and the round resets safely.',
        },
      },
    ],
  },
};

// Also alias lesson-1-1-pt, lesson-1-2-pt, etc. to ensure unit-1-pt from mock course works seamlessly
MOCK_LESSONS['lesson-1-1-pt'] = MOCK_LESSONS['lesson-1-1'];
MOCK_LESSONS['lesson-1-2-pt'] = MOCK_LESSONS['lesson-1-2'];
MOCK_LESSONS['lesson-1-3-pt'] = MOCK_LESSONS['lesson-1-3'];
MOCK_LESSONS['lesson-2-1-pt'] = MOCK_LESSONS['lesson-2-1'];
MOCK_LESSONS['lesson-2-2-pt'] = MOCK_LESSONS['lesson-2-2'];
MOCK_LESSONS['lesson-3-1-pt'] = MOCK_LESSONS['lesson-3-1'];
MOCK_LESSONS['lesson-3-2-pt'] = MOCK_LESSONS['lesson-3-2'];
