import { Card, CircularProgress, LinearProgress, Stack, Typography, styled } from '@mui/material';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import TranslateIcon from '@mui/icons-material/Translate';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '../../components/Layout';
import { api } from '../../lib/api';
import { QUERY_KEYS } from '../../lib/queryKeys';
import { badgeKindType, badgeType } from '../../types';

const KINDS: Array<{ kind: badgeKindType; title: string; Icon: typeof MenuBookIcon }> = [
    { kind: 'learned_words', title: 'Mots appris', Icon: MenuBookIcon },
    { kind: 'streak_days', title: 'Jours de suite', Icon: LocalFireDepartmentIcon },
    { kind: 'languages', title: 'Langues', Icon: TranslateIcon },
];

const DATE_FORMAT = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeZone: 'UTC' });

function Profile() {
    const meQuery = useQuery({ queryKey: QUERY_KEYS.me, queryFn: api.getMe });
    const badgesQuery = useQuery({ queryKey: QUERY_KEYS.badges, queryFn: api.getBadges });

    return (
        <Layout>
            <Stack spacing={6}>
                <div>
                    <Typography variant="h1">{meQuery.data?.username ?? 'Profil'}</Typography>
                    {meQuery.data && (
                        <Typography color="text.secondary">{meQuery.data.email}</Typography>
                    )}
                </div>

                {badgesQuery.isPending ? (
                    <Stack alignItems="center">
                        <CircularProgress />
                    </Stack>
                ) : badgesQuery.isError ? (
                    <Typography color="error">Impossible de charger les badges.</Typography>
                ) : (
                    <>
                        <Card sx={{ p: 6 }}>
                            <Stack direction="row" spacing={8}>
                                <Stat
                                    value={badgesQuery.data.progress.learnedWords}
                                    label="mots appris"
                                />
                                <Stat
                                    value={badgesQuery.data.progress.streakDays}
                                    label="jours de suite"
                                />
                                <Stat
                                    value={badgesQuery.data.progress.languages}
                                    label="langue(s) à 100 mots"
                                />
                            </Stack>
                        </Card>

                        {KINDS.map(({ kind, title, Icon }) => (
                            <Card key={kind} sx={{ p: 6 }}>
                                <Stack spacing={4}>
                                    <Typography variant="h2">{title}</Typography>
                                    <BadgeGrid>
                                        {badgesQuery.data.badges
                                            .filter((badge) => badge.kind === kind)
                                            .map((badge) => (
                                                <BadgeCard
                                                    key={badge.id}
                                                    badge={badge}
                                                    Icon={Icon}
                                                />
                                            ))}
                                    </BadgeGrid>
                                </Stack>
                            </Card>
                        ))}
                    </>
                )}
            </Stack>
        </Layout>
    );
}

/** Badge obtenu (en couleur, avec sa date) ou à obtenir (grisé, avec la progression). */
function BadgeCard(props: { badge: badgeType; Icon: typeof MenuBookIcon }) {
    const { badge, Icon } = props;
    const isEarned = badge.earnedOn !== null;
    return (
        <Card
            variant="outlined"
            sx={{ p: 3, opacity: isEarned ? 1 : 0.55, height: '100%' }}
            aria-label={`${badge.label} : ${isEarned ? 'obtenu' : 'pas encore obtenu'}`}
        >
            <Stack spacing={1} alignItems="center" textAlign="center">
                <Icon sx={{ fontSize: 40 }} color={isEarned ? 'primary' : 'disabled'} aria-hidden />
                <Typography variant="h3" component="p">
                    {badge.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {badge.description}
                </Typography>
                {isEarned ? (
                    <Typography variant="caption" color="text.secondary">
                        Obtenu le {DATE_FORMAT.format(new Date(`${badge.earnedOn}T00:00:00Z`))}
                    </Typography>
                ) : (
                    <Stack spacing={0.5} sx={{ width: '100%' }}>
                        <LinearProgress
                            variant="determinate"
                            value={(100 * badge.current) / badge.threshold}
                        />
                        <Typography variant="caption" color="text.secondary">
                            {badge.current} / {badge.threshold}
                        </Typography>
                    </Stack>
                )}
            </Stack>
        </Card>
    );
}

function Stat(props: { value: number; label: string }) {
    return (
        <div>
            <Typography variant="h2" component="p" color="primary">
                {props.value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {props.label}
            </Typography>
        </div>
    );
}

/** Trois badges par ligne (un par palier). */
const BadgeGrid = styled('div')(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: theme.spacing(2),
}));

export { Profile };
