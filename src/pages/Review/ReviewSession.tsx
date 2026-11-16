import { FormEvent, useState } from 'react';
import {
    Alert,
    Button,
    Card,
    Chip,
    LinearProgress,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api, useApiCall } from '../../lib/api';
import { formatNextReview } from '../../lib/formatNextReview';
import { QUERY_KEYS } from '../../lib/queryKeys';
import { ROUTE_PATHS } from '../../routes/routePaths';
import { useAlert } from '../../lib/alert';
import {
    answerResultType,
    dailySessionType,
    directionType,
    markWordAsKnownResultType,
    levelType,
} from '../../types';
import { getCardLabels, getCardLanguages } from '../../lib/languages';
import { buildInitialQueue, queueItemType, replaceKnownNewWord } from './buildInitialQueue';

function ReviewSession(props: { session: dailySessionType }) {
    const [queue, setQueue] = useState<queueItemType[]>(() => buildInitialQueue(props.session));
    const [initialLength] = useState(queue.length);
    const [doneCount, setDoneCount] = useState(0);
    const [answer, setAnswer] = useState('');
    const [result, setResult] = useState<answerResultType | undefined>();
    // Nouveaux mots déjà intégrés à la session, pour n'ajouter que les vrais remplaçants.
    const [sessionNewWordIds, setSessionNewWordIds] = useState(
        () => new Set(props.session.newWords.map((word) => word.id)),
    );
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { displayAlert } = useAlert();

    const markWordAsKnownApiCall = useApiCall({
        apiCall: api.markWordAsKnown,
        onSuccess: (data, params) => handleWordMarkedAsKnown(params.wordId, data),
    });

    const submitAnswerApiCall = useApiCall({
        apiCall: api.submitAnswer,
        onSuccess: (data) => setResult(data),
    });

    const current = queue[0];

    if (!current) {
        return (
            <Card sx={{ p: 8, textAlign: 'center' }}>
                <Stack spacing={4} alignItems="center">
                    <Typography variant="h1">Fertig ! 🎉</Typography>
                    <Typography>
                        {props.session.tag
                            ? `C’est terminé pour « ${props.session.tag.label} » aujourd’hui !`
                            : 'C’est terminé pour aujourd’hui, à demain !'}
                    </Typography>
                    <Button variant="contained" onClick={() => navigate(ROUTE_PATHS.HOME)}>
                        Retour à l’accueil
                    </Button>
                </Stack>
            </Card>
        );
    }

    // La file peut s'allonger (mots ratés) : la progression se base sur les éléments terminés.
    const progress = (100 * doneCount) / Math.max(initialLength, doneCount + queue.length);

    return (
        <Stack spacing={4}>
            {props.session.tag && (
                <Typography variant="h2" sx={{ '&::first-letter': { textTransform: 'uppercase' } }}>
                    {props.session.tag.label}
                </Typography>
            )}
            <LinearProgress variant="determinate" value={progress} />
            <Typography variant="body2" color="text.secondary" align="right">
                {queue.length} restant{queue.length > 1 ? 's' : ''}
            </Typography>

            <Card sx={{ p: 8 }}>
                {current.kind === 'discover' ? (
                    <Stack spacing={6} alignItems="center" textAlign="center">
                        <Stack direction="row" spacing={2}>
                            <Chip label="Nouveau mot" color="secondary" />
                            <LevelChip level={current.word.level} />
                        </Stack>
                        <Typography
                            variant="h1"
                            component="p"
                            lang={props.session.languages.learned}
                        >
                            {current.word.term}
                        </Typography>
                        <Typography variant="h2" component="p" color="text.secondary">
                            {current.word.translations.join(' · ')}
                        </Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} width="100%">
                            <Button
                                fullWidth
                                variant="outlined"
                                size="large"
                                loading={markWordAsKnownApiCall.isLoading}
                                onClick={() =>
                                    markWordAsKnownApiCall.perform({
                                        wordId: current.word.id,
                                        tagId: props.session.tag?.id,
                                    })
                                }
                            >
                                Je connais déjà ce mot
                            </Button>
                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                autoFocus
                                disabled={markWordAsKnownApiCall.isLoading}
                                onClick={goToNext}
                            >
                                C’est noté
                            </Button>
                        </Stack>
                    </Stack>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={6} alignItems="center" textAlign="center">
                            <Stack direction="row" spacing={2}>
                                {current.isNew && <Chip label="Nouveau mot" color="secondary" />}
                                <Chip
                                    variant="outlined"
                                    label={
                                        getCardLabels(
                                            current.card.direction,
                                            props.session.languages,
                                        ).chip
                                    }
                                />
                                <LevelChip level={current.card.level} />
                            </Stack>
                            <Typography
                                variant="h1"
                                component="p"
                                lang={
                                    getCardLanguages(
                                        current.card.direction,
                                        props.session.languages,
                                    ).prompt
                                }
                            >
                                {current.card.prompt}
                            </Typography>
                            <TextField
                                key={`${current.card.wordId}-${current.card.direction}-${doneCount}`}
                                fullWidth
                                autoFocus
                                autoComplete="off"
                                label={
                                    getCardLabels(current.card.direction, props.session.languages)
                                        .inputLabel
                                }
                                helperText={
                                    current.card.nature === 'noun'
                                        ? getCardLabels(
                                              current.card.direction,
                                              props.session.languages,
                                          ).nounHelperText
                                        : undefined
                                }
                                value={answer}
                                disabled={!!result}
                                onChange={(e) => setAnswer(e.target.value)}
                                slotProps={{
                                    htmlInput: { autoCapitalize: 'none', spellCheck: false },
                                }}
                            />
                            {result ? (
                                <>
                                    <AnswerFeedback
                                        result={result}
                                        direction={current.card.direction}
                                    />
                                    <Button
                                        variant="contained"
                                        size="large"
                                        autoFocus
                                        onClick={goToNext}
                                    >
                                        Continuer
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    loading={submitAnswerApiCall.isLoading}
                                    disabled={!answer.trim()}
                                >
                                    Valider
                                </Button>
                            )}
                        </Stack>
                    </form>
                )}
            </Card>
        </Stack>
    );

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (current?.kind !== 'quiz' || result || !answer.trim()) {
            return;
        }
        submitAnswerApiCall.perform({
            wordId: current.card.wordId,
            direction: current.card.direction,
            answer,
            tagId: props.session.tag?.id,
        });
    }

    function handleWordMarkedAsKnown(wordId: string, data: markWordAsKnownResultType) {
        const replacementWords = data.newWords.filter((word) => !sessionNewWordIds.has(word.id));
        const nextQueue = replaceKnownNewWord(queue, wordId, replacementWords);
        setSessionNewWordIds(
            (ids) => new Set([...ids, ...replacementWords.map((word) => word.id)]),
        );
        // Un mot déjà connu n'est pas un mot travaillé : la progression ne bouge pas.
        setQueue(nextQueue);
        displayAlert({
            variant: 'success',
            text: `Mot mis de côté, prochaine révision dans ${data.intervalDays} jours`,
        });
        if (nextQueue.length === 0) {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dailySession });
        }
    }

    function goToNext() {
        const [head, ...rest] = queue;
        // Mauvaise réponse : le mot revient en fin de session.
        const shouldRetry = head.kind === 'quiz' && result && !result.isCorrect;
        const nextQueue = shouldRetry ? [...rest, head] : rest;
        setQueue(nextQueue);
        if (!shouldRetry) {
            setDoneCount((count) => count + 1);
        }
        setAnswer('');
        setResult(undefined);
        if (nextQueue.length === 0) {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dailySession });
        }
    }
}

const LEVEL_LABELS: Record<levelType, string> = { 1: 'Débutant', 2: 'Intermédiaire', 3: 'Avancé' };

function LevelChip(props: { level: levelType }) {
    return <Chip variant="outlined" size="small" label={LEVEL_LABELS[props.level]} />;
}

function AnswerFeedback(props: { result: answerResultType; direction: directionType }) {
    const { result } = props;
    const expectedAnswers = <strong>{result.expectedAnswers.join(' · ')}</strong>;
    if (result.isCorrect) {
        return (
            <Alert icon={<CheckCircleIcon />} severity="success" sx={{ width: '100%' }}>
                {/* En allemand, on rappelle la forme complète (avec l'article). */}
                Richtig !{props.direction === 'reverse' && <> {expectedAnswers}.</>}{' '}
                {formatNextReview(result.intervalDays)}.
            </Alert>
        );
    }
    return (
        <Alert icon={<CancelIcon />} severity="error" sx={{ width: '100%', textAlign: 'left' }}>
            La bonne réponse était : {expectedAnswers}. Ce mot reviendra plus tard dans la session.
        </Alert>
    );
}

export { ReviewSession };
