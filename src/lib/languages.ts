import { directionType, languageType } from '../types';

const LANGUAGES: Record<languageType, { name: string; inLanguage: string; articles: string }> = {
    fr: { name: 'Français', inLanguage: 'en français', articles: 'le, la, l’' },
    de: { name: 'Allemand', inLanguage: 'en allemand', articles: 'der, die, das' },
};

type sessionLanguagesType = { user: languageType; learned: languageType };

/**
 * Langues d'une carte : forward = on lit la langue apprise et on répond dans sa langue ;
 * reverse = on lit sa langue et on répond dans la langue apprise.
 */
function getCardLanguages(direction: directionType, languages: sessionLanguagesType) {
    return direction === 'forward'
        ? { prompt: languages.learned, answer: languages.user }
        : { prompt: languages.user, answer: languages.learned };
}

function getCardLabels(direction: directionType, languages: sessionLanguagesType) {
    const { prompt, answer } = getCardLanguages(direction, languages);
    return {
        chip: `${LANGUAGES[prompt].name} → ${LANGUAGES[answer].name}`,
        inputLabel: `Traduction ${LANGUAGES[answer].inLanguage}`,
        // Dans sa propre langue l'article est facultatif ; dans la langue apprise, il est obligatoire.
        nounHelperText:
            answer === languages.learned
                ? `C’est un nom : précise l’article (${LANGUAGES[answer].articles})`
                : undefined,
    };
}

export { LANGUAGES, getCardLanguages, getCardLabels };
export type { sessionLanguagesType };
