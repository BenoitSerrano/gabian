import { Button, Card, CircularProgress, LinearProgress, Stack, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { api } from '../../lib/api';
import { QUERY_KEYS } from '../../lib/queryKeys';
import { ROUTE_PATHS } from '../../routes/routePaths';

function Home() {
    const navigate = useNavigate();
    const meQuery = useQuery({ queryKey: QUERY_KEYS.me, queryFn: api.getMe });
    const sessionQuery = useQuery({
        queryKey: QUERY_KEYS.dailySession,
        queryFn: api.getDailySession,
    });

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
                    <Stack spacing={2}>
                        <Typography variant="h3">Progression</Typography>
                        <LinearProgress variant="determinate" value={progress} />
                        <Typography variant="body2" color="text.secondary">
                            {stats.startedWordCount} / {stats.totalWordCount} mots allemands
                            découverts
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

export { Home };
