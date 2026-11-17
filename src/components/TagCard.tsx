import { Card, CardActionArea, LinearProgress, Stack, Typography, styled } from '@mui/material';
import { ASSETS_BASE_URL } from '../lib/api/utils';
import { tagSummaryType } from '../types';

/** Carte d'un tag : icône, nom de la catégorie et progression (mots appris / total). */
function TagCard(props: { tag: tagSummaryType; onClick: () => void }) {
    const { tag } = props;
    const progress = tag.wordCount ? (100 * tag.learnedWordCount) / tag.wordCount : 0;
    return (
        <Card variant="outlined" sx={{ height: '100%' }}>
            <CardActionArea onClick={props.onClick} sx={{ height: '100%', p: 4 }}>
                <Stack spacing={2} alignItems="center" textAlign="center">
                    {tag.icon ? (
                        <Icon src={`${ASSETS_BASE_URL}/img/tags/${tag.icon}`} alt="" />
                    ) : (
                        <IconPlaceholder />
                    )}
                    <Typography
                        variant="h3"
                        component="p"
                        sx={{ '&::first-letter': { textTransform: 'uppercase' } }}
                    >
                        {tag.label}
                    </Typography>
                    <Stack spacing={1} sx={{ width: '100%' }}>
                        <LinearProgress
                            variant="determinate"
                            value={progress}
                            aria-label={`Progression : ${tag.label}`}
                        />
                        <Typography variant="body2" color="text.secondary">
                            {tag.learnedWordCount} / {tag.wordCount} mots appris
                        </Typography>
                    </Stack>
                </Stack>
            </CardActionArea>
        </Card>
    );
}

const ICON_SIZE = 56;

const Icon = styled('img')({ width: ICON_SIZE, height: ICON_SIZE });

const IconPlaceholder = styled('div')(({ theme }) => ({
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: '50%',
    backgroundColor: theme.palette.action.hover,
}));

/** Grille de cartes, deux par ligne. */
const TagGrid = styled('div')(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: theme.spacing(3),
}));

export { TagCard, TagGrid };
