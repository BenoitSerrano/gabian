import { answerResultType, dailySessionType, userType } from '../../types';
import { performApiCall } from './utils';

const api = { createUser, login, getMe, getDailySession, submitAnswer };

async function createUser(params: { email: string; password: string; username: string }) {
    return performApiCall<{ token: string }>('users', 'POST', params);
}

async function login(params: { email: string; password: string }) {
    return performApiCall<{ token: string }>('login', 'POST', params);
}

async function getMe() {
    return performApiCall<userType>('me', 'GET');
}

async function getDailySession() {
    return performApiCall<dailySessionType>('session', 'GET');
}

async function submitAnswer(params: { wordId: string; answer: string }) {
    return performApiCall<answerResultType>('answers', 'POST', params);
}

export { api };
