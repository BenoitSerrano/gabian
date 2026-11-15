import { dailySessionType, newWordType, reviewCardType } from '../../types';

type queueItemType =
    | { kind: 'discover'; word: newWordType }
    | { kind: 'quiz'; card: reviewCardType; isNew: boolean };

/**
 * Ordre de la session : on découvre d'abord les nouveaux mots (avec leur traduction),
 * on enchaîne avec les révisions, puis on interroge sur les nouveaux mots :
 * les révisions servent d'intervalle entre la découverte et le premier rappel.
 */
function buildInitialQueue(session: dailySessionType): queueItemType[] {
    return [
        ...session.newWords.map(toDiscoverItem),
        ...session.reviewCards.map((card) => ({ kind: 'quiz' as const, card, isNew: false })),
        ...session.newWords.map(toNewWordQuizItem),
    ];
}

/**
 * Un nouveau mot marqué « déjà connu » sort de la session (découverte et interrogation),
 * et ses remplaçants sont découverts tout de suite puis interrogés en fin de session.
 */
function replaceKnownNewWord(
    queue: queueItemType[],
    knownWordId: string,
    replacementWords: newWordType[],
): queueItemType[] {
    const remaining = queue.filter((item) => getWordId(item) !== knownWordId);
    const [discoverItems, otherItems] = partition(remaining, (item) => item.kind === 'discover');
    return [
        ...discoverItems,
        ...replacementWords.map(toDiscoverItem),
        ...otherItems,
        ...replacementWords.map(toNewWordQuizItem),
    ];
}

function toDiscoverItem(word: newWordType): queueItemType {
    return { kind: 'discover', word };
}

/** Un nouveau mot est d'abord interrogé dans le sens allemand → français. */
function toNewWordQuizItem(word: newWordType): queueItemType {
    return {
        kind: 'quiz',
        card: {
            wordId: word.id,
            direction: 'forward',
            nature: word.nature,
            register: word.register,
            tags: word.tags,
            prompt: word.term,
        },
        isNew: true,
    };
}

function getWordId(item: queueItemType) {
    return item.kind === 'discover' ? item.word.id : item.card.wordId;
}

function partition<T>(items: T[], predicate: (item: T) => boolean): [T[], T[]] {
    return [items.filter(predicate), items.filter((item) => !predicate(item))];
}

export { buildInitialQueue, replaceKnownNewWord };
export type { queueItemType };
