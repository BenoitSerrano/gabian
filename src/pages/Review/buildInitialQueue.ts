import { dailySessionType, newWordType, reviewWordType } from '../../types';

type queueItemType =
    | { kind: 'discover'; word: newWordType }
    | { kind: 'quiz'; word: reviewWordType; isNew: boolean };

/**
 * Ordre de la session : on découvre d'abord les nouveaux mots (avec leur traduction),
 * on enchaîne avec les révisions, puis on interroge sur les nouveaux mots :
 * les révisions servent d'intervalle entre la découverte et le premier rappel.
 */
function buildInitialQueue(session: dailySessionType): queueItemType[] {
    return [
        ...session.newWords.map((word) => ({ kind: 'discover' as const, word })),
        ...session.reviewWords.map((word) => ({ kind: 'quiz' as const, word, isNew: false })),
        ...session.newWords.map((word) => ({ kind: 'quiz' as const, word, isNew: true })),
    ];
}

export { buildInitialQueue };
export type { queueItemType };
