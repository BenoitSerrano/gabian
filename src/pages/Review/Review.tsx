import { CircularProgress, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '../../components/Layout';
import { api } from '../../lib/api';
import { QUERY_KEYS } from '../../lib/queryKeys';
import { ReviewSession } from './ReviewSession';

function Review() {
    const sessionQuery = useQuery({
        queryKey: QUERY_KEYS.dailySession,
        queryFn: api.getDailySession,
        // Toujours repartir de l'état serveur en entrant dans une révision.
        refetchOnMount: 'always',
    });

    return (
        <Layout>
            {!sessionQuery.isFetchedAfterMount ? (
                <Stack alignItems="center">
                    <CircularProgress />
                </Stack>
            ) : sessionQuery.isError || !sessionQuery.data ? (
                <Typography color="error">Impossible de charger la session du jour.</Typography>
            ) : (
                <ReviewSession session={sessionQuery.data} />
            )}
        </Layout>
    );
}

export { Review };
