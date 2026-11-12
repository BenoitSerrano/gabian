function formatNextReview(intervalDays: number) {
    if (intervalDays <= 0) {
        return 'À revoir tout à l’heure';
    }
    if (intervalDays === 1) {
        return 'Prochaine révision demain';
    }
    return `Prochaine révision dans ${intervalDays} jours`;
}

export { formatNextReview };
