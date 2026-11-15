type userType = { id: string; username: string; email: string };

/** forward : allemand → français ; reverse : français → allemand. */
type directionType = 'forward' | 'reverse';

/** Une carte à réviser : `prompt` est ce qu'on montre, la réponse est dans l'autre langue. */
type reviewCardType = { wordId: string; direction: directionType; prompt: string };
type newWordType = { id: string; german: string; translations: string[] };

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
    reviewCardType,
    newWordType,
    dailySessionType,
    answerResultType,
    markWordAsKnownResultType,
};
