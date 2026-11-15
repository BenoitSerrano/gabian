type userType = { id: string; username: string; email: string };

/** forward : allemand → français ; reverse : français → allemand. */
type directionType = 'forward' | 'reverse';

type natureType = 'noun' | 'verb' | 'adjective' | 'adverb';
type registerType = 'familiar' | 'standard' | 'formal';

/** Informations communes aux cartes et aux nouveaux mots. */
type wordInfoType = { nature: natureType; register: registerType; tags: string[] };

/**
 * Une carte à réviser : `prompt` est ce qu'on montre, la réponse est dans l'autre langue.
 * Pour un nom (`nature === 'noun'`), la réponse doit contenir l'article.
 */
type reviewCardType = wordInfoType & {
    wordId: string;
    direction: directionType;
    prompt: string;
};

/** Termes déjà formatés par l'API, avec leur article pour les noms ("der Hund", "le chien"). */
type newWordType = wordInfoType & { id: string; term: string; translations: string[] };

type dailySessionType = {
    today: string;
    reviewCards: reviewCardType[];
    newWords: newWordType[];
    stats: { totalWordCount: number; startedWordCount: number };
};

type answerResultType = {
    isCorrect: boolean;
    expectedAnswers: string[];
    intervalDays: number;
    dueDate: string;
};

type markWordAsKnownResultType = { intervalDays: number; newWords: newWordType[] };

export type {
    userType,
    directionType,
    natureType,
    registerType,
    reviewCardType,
    newWordType,
    dailySessionType,
    answerResultType,
    markWordAsKnownResultType,
};
