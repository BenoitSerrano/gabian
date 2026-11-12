type userType = { id: string; username: string; email: string };

type reviewWordType = { id: string; german: string };
type newWordType = reviewWordType & { translations: string[] };

type dailySessionType = {
    today: string;
    reviewWords: reviewWordType[];
    newWords: newWordType[];
    stats: { totalWordCount: number; startedWordCount: number };
};

type answerResultType = {
    isCorrect: boolean;
    translations: string[];
    intervalDays: number;
    dueDate: string;
};

type markWordAsKnownResultType = { intervalDays: number; newWords: newWordType[] };

export type {
    userType,
    reviewWordType,
    newWordType,
    dailySessionType,
    answerResultType,
    markWordAsKnownResultType,
};
