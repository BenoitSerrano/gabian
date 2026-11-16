type userType = { id: string; username: string; email: string; language: languageType };

/** Langues de l'application (ISO 639-1). */
type languageType = 'fr' | 'de';

/** forward : langue apprise → langue de l'utilisateur ; reverse : l'inverse. */
type directionType = 'forward' | 'reverse';

type natureType = 'noun' | 'verb' | 'adjective' | 'adverb' | 'expression';
/** Niveau de difficulté : 1 (débutant) à 3 (avancé). */
type levelType = 1 | 2 | 3;

/** Informations communes aux cartes et aux nouveaux mots. */
type wordInfoType = { nature: natureType; level: levelType; tags: string[] };

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

/** Tag (catégorie de vocabulaire) avec son nombre total de mots. */
type tagSummaryType = { id: string; label: string; wordCount: number };

type dailySessionType = {
    today: string;
    /** Tag de la session, ou null pour une session sur tout le vocabulaire. */
    tag: { id: string; label: string } | null;
    /** Langue de l'utilisateur (celle des traductions) et langue qu'il apprend. */
    languages: { user: languageType; learned: languageType };
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
    tagSummaryType,
    natureType,
    levelType,
    languageType,
    reviewCardType,
    newWordType,
    dailySessionType,
    answerResultType,
    markWordAsKnownResultType,
};
