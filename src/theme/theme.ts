import { createTheme } from '@mui/material';

const theme = createTheme({
    palette: {
        primary: { main: '#1f4e5f' },
        secondary: { main: '#f6c453' },
        success: { main: '#2e7d4f' },
        error: { main: '#c0392b' },
        background: { default: '#f7f4ec', paper: '#ffffff' },
        text: { primary: '#1b1b18' },
    },
    shape: { borderRadius: 12 },
    spacing: (value: number) => value * 4,
    typography: {
        fontFamily: ['Trebuchet MS', 'sans-serif'].join(','),
        button: { textTransform: 'none', fontSize: '1rem' },
        h1: { fontSize: '1.6rem', fontWeight: 'bold' },
        h2: { fontSize: '1.3rem', fontWeight: 'bold' },
        h3: { fontSize: '1.1rem', fontWeight: 'bold' },
    },
});

export { theme };
