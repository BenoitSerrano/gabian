import {
    answerResultType,
    badgesType,
    dailySessionType,
    directionType,
    languageType,
    markWordAsKnownResultType,
    tagSummaryType,
    userType,
} from '../../types';
import { performApiCall } from './utils';

const api = {
    createUser,
    login,
    getMe,
    getTags,
    getDailySession,
    submitAnswer,
    markWordAsKnown,
    getBadges,
};

async function createUser(params: {
    email: string;
    password: string;
    username: string;
    language: languageType;
}) {
    return performApiCall<{ token: string }>('users', 'POST', params);
}

async function login(params: { email: string; password: string }) {
    return performApiCall<{ token: string }>('login', 'POST', params);
}

async function getMe() {
    return performApiCall<userType>('me', 'GET');
}

async function getTags() {
    return performApiCall<tagSummaryType[]>('tags', 'GET');
}

/** Session du jour, sur tout le vocabulaire ou sur un tag. */
async function getDailySession(tagId?: string) {
    const query = tagId ? `?tagId=${encodeURIComponent(tagId)}` : '';
    return performApiCall<dailySessionType>(`session${query}`, 'GET');
}

async function submitAnswer(params: {
    wordId: string;
    direction: directionType;
    answer: string;
    tagId?: string;
}) {
    return performApiCall<answerResultType>('answers', 'POST', params);
}

async function markWordAsKnown(params: { wordId: string; tagId?: string }) {
    return performApiCall<markWordAsKnownResultType>(
        `words/${encodeURIComponent(params.wordId)}/known`,
        'POST',
        params.tagId ? { tagId: params.tagId } : {},
    );
}

/** Badges de l'utilisateur : obtenus et à obtenir, avec la progression. */
async function getBadges() {
    return performApiCall<badgesType>('badges', 'GET');
}

export { api };
