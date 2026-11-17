import { useEffect, useRef, useState } from 'react';
import { Box, Stack, Typography, styled } from '@mui/material';
import { dailyPointsType } from '../types';

// Couleur de série validée (contraste ≥ 3:1 sur la surface) ; le texte garde les couleurs de texte.
const BAR_COLOR = '#2a78d6';
const PLOT_HEIGHT = 160;
const AXIS_WIDTH = 36;
const X_LABELS_HEIGHT = 24;
const TOP_PADDING = 20;
const MAX_BAR_WIDTH = 24;
const BAR_RADIUS = 4;
// Une étiquette de date tous les 7 jours, en partant d'aujourd'hui.
const X_LABEL_EVERY = 7;

const SHORT_DATE = new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
});
const LONG_DATE = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
});

function formatDay(day: string, format: Intl.DateTimeFormat) {
    return format.format(new Date(`${day}T00:00:00Z`));
}

/** Graphe en barres des points gagnés par jour, avec infobulle et tableau des données. */
function PointsChart(props: { data: dailyPointsType[] }) {
    const { data } = props;
    const containerRef = useRef<HTMLDivElement>(null);
    const width = useWidth(containerRef);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const total = data.reduce((sum, item) => sum + item.points, 0);
    const best = data.reduce((max, item) => (item.points > max.points ? item : max), data[0]);
    const yMax = niceMax(best?.points ?? 0);
    const plotWidth = Math.max(0, width - AXIS_WIDTH);
    const slotWidth = data.length ? plotWidth / data.length : 0;
    const barWidth = Math.min(MAX_BAR_WIDTH, slotWidth * 0.6);
    const baselineY = TOP_PADDING + PLOT_HEIGHT;
    const yOf = (points: number) => baselineY - (PLOT_HEIGHT * points) / yMax;
    const yTicks = [0, yMax / 2, yMax];
    const hovered = hoveredIndex === null ? null : data[hoveredIndex];

    return (
        <Stack spacing={3}>
            <Stack direction="row" spacing={8}>
                <Summary value={total} label="points sur 30 jours" />
                <Summary value={best?.points ?? 0} label="meilleur jour" />
            </Stack>

            {total === 0 ? (
                <Typography color="text.secondary">
                    Pas encore de points sur les 30 derniers jours. Une bonne réponse rapporte 10
                    points par niveau du mot, +5 dans le sens inverse.
                </Typography>
            ) : (
                <Box ref={containerRef} sx={{ position: 'relative' }}>
                    {width > 0 && (
                        <svg
                            width={width}
                            height={baselineY + X_LABELS_HEIGHT}
                            role="img"
                            aria-label={`Points gagnés par jour sur 30 jours : ${total} au total, ${best.points} au meilleur jour`}
                        >
                            {yTicks.map((tick) => (
                                <g key={tick}>
                                    <line
                                        x1={AXIS_WIDTH}
                                        x2={width}
                                        y1={yOf(tick)}
                                        y2={yOf(tick)}
                                        stroke="currentColor"
                                        strokeOpacity={tick === 0 ? 0.35 : 0.1}
                                    />
                                    <AxisText x={AXIS_WIDTH - 6} y={yOf(tick) + 4} textAnchor="end">
                                        {tick}
                                    </AxisText>
                                </g>
                            ))}

                            {data.map((item, index) => {
                                const x = AXIS_WIDTH + index * slotWidth;
                                const barX = x + (slotWidth - barWidth) / 2;
                                const isLast = index === data.length - 1;
                                const isLabelled = (data.length - 1 - index) % X_LABEL_EVERY === 0;
                                return (
                                    <g key={item.day}>
                                        {item.points > 0 && (
                                            <path
                                                d={barPath(
                                                    barX,
                                                    yOf(item.points),
                                                    barWidth,
                                                    baselineY,
                                                )}
                                                fill={BAR_COLOR}
                                                opacity={hoveredIndex === index ? 0.75 : 1}
                                            />
                                        )}
                                        {item === best && (
                                            <ValueText
                                                x={barX + barWidth / 2}
                                                y={yOf(item.points) - 6}
                                            >
                                                {item.points}
                                            </ValueText>
                                        )}
                                        {isLabelled && (
                                            // La dernière date s'aligne à droite pour ne pas sortir du graphe.
                                            <AxisText
                                                x={isLast ? x + slotWidth : x + slotWidth / 2}
                                                y={baselineY + 16}
                                                textAnchor={isLast ? 'end' : 'middle'}
                                            >
                                                {formatDay(item.day, SHORT_DATE)}
                                            </AxisText>
                                        )}
                                        {/* Zone de survol : toute la colonne, plus large que la barre. */}
                                        <rect
                                            x={x}
                                            y={TOP_PADDING}
                                            width={slotWidth}
                                            height={PLOT_HEIGHT}
                                            fill="transparent"
                                            tabIndex={0}
                                            aria-label={`${formatDay(item.day, LONG_DATE)} : ${item.points} points`}
                                            onPointerEnter={() => setHoveredIndex(index)}
                                            onPointerLeave={() => setHoveredIndex(null)}
                                            onFocus={() => setHoveredIndex(index)}
                                            onBlur={() => setHoveredIndex(null)}
                                            style={{ outline: 'none' }}
                                        />
                                    </g>
                                );
                            })}
                        </svg>
                    )}

                    {hovered && hoveredIndex !== null && (
                        <Tooltip
                            style={{
                                left: Math.min(
                                    Math.max(AXIS_WIDTH + (hoveredIndex + 0.5) * slotWidth, 60),
                                    width - 60,
                                ),
                                top: Math.max(yOf(hovered.points) - 8, 0),
                            }}
                        >
                            <Typography variant="body2" fontWeight="bold">
                                {hovered.points} points
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {formatDay(hovered.day, LONG_DATE)}
                            </Typography>
                        </Tooltip>
                    )}
                </Box>
            )}

            <details>
                <summary>
                    <Typography component="span" variant="body2" color="text.secondary">
                        Voir les données
                    </Typography>
                </summary>
                <DataTable>
                    <thead>
                        <tr>
                            <th scope="col">Jour</th>
                            <th scope="col">Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...data].reverse().map((item) => (
                            <tr key={item.day}>
                                <td>{formatDay(item.day, LONG_DATE)}</td>
                                <td>{item.points}</td>
                            </tr>
                        ))}
                    </tbody>
                </DataTable>
            </details>
        </Stack>
    );
}

/** Barre arrondie en haut (4 px), carrée sur la ligne de base. */
function barPath(x: number, top: number, width: number, baseline: number) {
    const radius = Math.min(BAR_RADIUS, width / 2, baseline - top);
    return [
        `M ${x} ${baseline}`,
        `V ${top + radius}`,
        `Q ${x} ${top} ${x + radius} ${top}`,
        `H ${x + width - radius}`,
        `Q ${x + width} ${top} ${x + width} ${top + radius}`,
        `V ${baseline}`,
        'Z',
    ].join(' ');
}

/** Maximum de l'axe arrondi à une valeur ronde proche (10, 15, 20, 25, 30, 40, 50…). */
function niceMax(value: number) {
    if (value <= 10) {
        return 10;
    }
    const magnitude = 10 ** Math.floor(Math.log10(value));
    const step =
        [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].find((factor) => factor * magnitude >= value) ?? 10;
    return step * magnitude;
}

function useWidth(ref: React.RefObject<HTMLElement>) {
    const [width, setWidth] = useState(0);
    useEffect(() => {
        const element = ref.current;
        if (!element) {
            return;
        }
        const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
        observer.observe(element);
        return () => observer.disconnect();
    });
    return width;
}

function Summary(props: { value: number; label: string }) {
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

const AxisText = styled('text')(({ theme }) => ({
    fontSize: 11,
    fill: theme.palette.text.secondary,
}));

const ValueText = styled('text')(({ theme }) => ({
    fontSize: 12,
    fontWeight: 'bold',
    textAnchor: 'middle',
    fill: theme.palette.text.primary,
}));

const Tooltip = styled('div')(({ theme }) => ({
    position: 'absolute',
    transform: 'translate(-50%, -100%)',
    pointerEvents: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    padding: theme.spacing(1, 2),
    borderRadius: Number(theme.shape.borderRadius) / 2,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
}));

const DataTable = styled('table')(({ theme }) => ({
    width: '100%',
    marginTop: theme.spacing(2),
    borderCollapse: 'collapse',
    ...theme.typography.body2,
    '& th, & td': {
        textAlign: 'left',
        padding: theme.spacing(1, 0),
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    '& th:last-child, & td:last-child': { textAlign: 'right' },
}));

export { PointsChart };
