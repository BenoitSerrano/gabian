import { Button, Card, CircularProgress, LinearProgress, Stack, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { TagCard, TagGrid } from '../../components/TagCard';
import { api } from '../../lib/api';
import { QUERY_KEYS } from '../../lib/queryKeys';
import { ROUTE_PATHS } from '../../routes/routePaths';
import { TAG_SEARCH_PARAM } from '../Review';

function Home() {
    const navigate = useNavigate();
    const meQuery = useQuery({ queryKey: QUERY_KEYS.me, queryFn: api.getMe });
    const sessionQuery = useQuery({
        queryKey: QUERY_KEYS.dailySessionFor(),
        queryFn: () => api.getDailySession(),
    });
    const tagsQuery = useQuery({ queryKey: QUERY_KEYS.tags, queryFn: api.getTags });

    if (sessionQuery.isPending) {
        return (
            <Layout>
                <Stack alignItems="center">
                    <CircularProgress />
                </Stack>
            </Layout>
        );
    }
    if (sessionQuery.isError) {
        return (
            <Layout>
                <Typography color="error">Impossible de charger la session du jour.</Typography>
            </Layout>
        );
    }

    const { reviewCards, newWords, stats } = sessionQuery.data;
    const hasWorkToday = reviewCards.length + newWords.length > 0;
    const progress = stats.totalWordCount
        ? (100 * stats.startedWordCount) / stats.totalWordCount
        : 0;

    return (
        <Layout>
            <Stack spacing={6}>
                <Typography variant="h1">
                    {meQuery.data ? `Hallo ${meQuery.data.username} !` : 'Hallo !'}
                </Typography>

                <Card sx={{ p: 6 }}>
                    <Stack spacing={4}>
                        <Typography variant="h2">Aujourd’hui</Typography>
                        <Stack direction="row" spacing={8}>
                            <Counter value={reviewCards.length} label="à réviser" />
                            <Counter value={newWords.length} label="nouveaux mots" />
                        </Stack>
                        <Stack direction="row" spacing={8}>
                            <SmallCounter
                                value={stats.learnedTodayWordCount}
                                label="appris aujourd’hui"
                            />
                            <SmallCounter
                                value={stats.dueTomorrowWordCount}
                                label="à réviser demain"
                            />
                        </Stack>
                        {hasWorkToday ? (
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<PlayArrowIcon />}
                                onClick={() => navigate(ROUTE_PATHS.REVIEW)}
                            >
                                Commencer
                            </Button>
                        ) : (
                            <Typography color="text.secondary">
                                Rien à réviser pour aujourd’hui. Reviens demain !
                            </Typography>
                        )}
                    </Stack>
                </Card>

                <Card sx={{ p: 6 }}>
                    <Stack spacing={4}>
                        <div>
                            <Typography variant="h2">Réviser un thème</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Les nouveaux mots viennent du thème choisi, des plus faciles aux
                                plus difficiles.
                            </Typography>
                        </div>
                        {tagsQuery.isPending ? (
                            <CircularProgress size={24} />
                        ) : tagsQuery.isError ? (
                            <Typography color="error">Impossible de charger les thèmes.</Typography>
                        ) : (
                            <TagGrid>
                                {tagsQuery.data.map((tag) => (
                                    <TagCard
                                        key={tag.id}
                                        tag={tag}
                                        onClick={() =>
                                            navigate(
                                                `${ROUTE_PATHS.REVIEW}?${TAG_SEARCH_PARAM}=${encodeURIComponent(tag.id)}`,
                                            )
                                        }
                                    />
                                ))}
                            </TagGrid>
                        )}
                    </Stack>
                </Card>

                <Card sx={{ p: 6 }}>
                    <Stack spacing={2}>
                        <Typography variant="h3">Progression</Typography>
                        <LinearProgress variant="determinate" value={progress} />
                        <Typography variant="body2" color="text.secondary">
                            {stats.startedWordCount} / {stats.totalWordCount} mots découverts
                        </Typography>
                    </Stack>
                </Card>
            </Stack>
        </Layout>
    );
}

function Counter(props: { value: number; label: string }) {
    return (
        <div>
            <Typography variant="h1" component="p" color="primary">
                {props.value}
            </Typography>
            <Typography color="text.secondary">{props.label}</Typography>
        </div>
    );
}

function SmallCounter(props: { value: number; label: string }) {
    return (
        <div>
            <Typography variant="h3" component="p">
                {props.value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {props.label}
            </Typography>
        </div>
    );
}

export { Home };
