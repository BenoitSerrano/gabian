const QUERY_KEYS = {
    me: ['me'],
    tags: ['tags'],
    badges: ['badges'],
    dailyPoints: ['dailyPoints'],
    // Préfixe commun : l'invalider rafraîchit les sessions de tous les tags.
    dailySession: ['dailySession'],
    dailySessionFor: (tagId?: string) => ['dailySession', tagId ?? 'all'],
} as const;

export { QUERY_KEYS };
