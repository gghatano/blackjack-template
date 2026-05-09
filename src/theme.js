import { createTheme } from '@mui/material/styles';

// カジノ・グリーンフェルト × ゴールド を基調にしたテーマ
const palette = {
  felt: {
    900: '#0b3a23',
    800: '#0f4a2c',
    700: '#13593b',
    600: '#1c6e49',
    500: '#2a8459',
  },
  gold: {
    900: '#7a5b10',
    800: '#a3791a',
    700: '#c89a2a',
    600: '#d4af37',
    500: '#e2c25a',
    400: '#eed27a',
    300: '#f4dd9a',
  },
  hot: '#e53935',
  bust: '#c62828',
  ok: '#2e7d32',
  ink: '#0a1f15',
  cream: '#fff8e6',
  paper: '#ffffff',
};

const teamColors = [
  '#e53935', // 赤（ハート）
  '#1e88e5', // 青
  '#fdd835', // 黄
  '#43a047', // 緑
];

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      light: palette.gold[400],
      main: palette.gold[600],
      dark: palette.gold[800],
      contrastText: palette.felt[900],
    },
    secondary: {
      light: palette.felt[500],
      main: palette.felt[700],
      dark: palette.felt[900],
      contrastText: '#fff',
    },
    success: {
      main: palette.ok,
      dark: '#1b5e20',
      light: '#66bb6a',
      contrastText: '#fff',
    },
    warning: {
      main: '#ef6c00',
      dark: '#e65100',
      light: '#ffb74d',
      contrastText: '#fff',
    },
    error: {
      main: palette.bust,
      dark: '#8e0000',
      light: '#ef5350',
      contrastText: '#fff',
    },
    background: {
      default: palette.felt[800],
      paper: palette.cream,
    },
    text: {
      primary: palette.ink,
      secondary: '#3a4a40',
      disabled: '#8a9690',
    },
    divider: 'rgba(212, 175, 55, 0.35)',
    casino: palette,
    teamColors,
  },
  typography: {
    fontFamily: [
      '"Noto Sans JP"',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: { fontWeight: 800, fontSize: '2.75rem', lineHeight: 1.15 },
    h2: { fontWeight: 800, fontSize: '2.25rem', lineHeight: 1.2 },
    h3: { fontWeight: 700, fontSize: '1.875rem', lineHeight: 1.25 },
    h4: { fontWeight: 700, fontSize: '1.5rem', lineHeight: 1.3 },
    h5: { fontWeight: 700, fontSize: '1.25rem', lineHeight: 1.35 },
    h6: { fontWeight: 700, fontSize: '1.05rem', lineHeight: 1.4 },
    button: { textTransform: 'none', fontWeight: 700, letterSpacing: '0.02em' },
    body1: { lineHeight: 1.6 },
    body2: { lineHeight: 1.55 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minHeight: '100vh',
          color: palette.ink,
          backgroundColor: palette.felt[800],
          backgroundImage: [
            'radial-gradient(ellipse at top, rgba(212,175,55,0.10), transparent 60%)',
            'radial-gradient(ellipse at center, rgba(255,255,255,0.05), transparent 70%)',
            `linear-gradient(180deg, ${palette.felt[700]} 0%, ${palette.felt[800]} 60%, ${palette.felt[900]} 100%)`,
          ].join(','),
          backgroundAttachment: 'fixed',
        },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 2 },
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, paddingInline: 16 },
        containedPrimary: {
          color: palette.felt[900],
          background: `linear-gradient(180deg, ${palette.gold[500]} 0%, ${palette.gold[700]} 100%)`,
          border: `1px solid ${palette.gold[800]}`,
          boxShadow: '0 4px 0 rgba(122,91,16,0.6), 0 6px 12px rgba(0,0,0,0.25)',
          '&:hover': {
            background: `linear-gradient(180deg, ${palette.gold[400]} 0%, ${palette.gold[600]} 100%)`,
            boxShadow: '0 5px 0 rgba(122,91,16,0.6), 0 8px 14px rgba(0,0,0,0.3)',
          },
          '&:active': {
            transform: 'translateY(2px)',
            boxShadow: '0 1px 0 rgba(122,91,16,0.6), 0 2px 6px rgba(0,0,0,0.25)',
          },
          '&.Mui-disabled': {
            background: '#cfc8b3',
            color: '#7a7a7a',
            border: '1px solid #b8b29c',
            boxShadow: 'none',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 700, letterSpacing: '0.02em' },
      },
    },
  },
});

export default theme;
