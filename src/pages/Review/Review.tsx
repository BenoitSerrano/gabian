import { CircularProgress, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { api } from '../../lib/api';
import { QUERY_KEYS } from '../../lib/queryKeys';
import { ReviewSession } from './ReviewSession';

const TAG_SEARCH_PARAM = 'tag';

function Review() {
    const [searchParams] = useSearchParams();
    const tagId = searchParams.get(TAG_SEARCH_PARAM) || undefined;
    const sessionQuery = useQuery({
        queryKey: QUERY_KEYS.dailySessionFor(tagId),
        queryFn: () => api.getDailySession(tagId),
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
                <ReviewSession key={tagId ?? 'all'} session={sessionQuery.data} />
            )}
        </Layout>
    );
}

export { Review, TAG_SEARCH_PARAM };
