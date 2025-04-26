import { createTheme } from '@mui/material/styles';

// カスタムカラーテーマ
const theme = createTheme({
  palette: {
    primary: {
      light: '#4dabf5',
      main: '#2196f3',
      dark: '#1769aa',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff94c2',
      main: '#f50057',
      dark: '#bb002f',
      contrastText: '#fff',
    },
    success: {
      main: '#4caf50',
      dark: '#388e3c',
      light: '#81c784',
    },
    warning: {
      main: '#ff9800',
      dark: '#f57c00',
      light: '#ffb74d',
    },
    info: {
      main: '#03a9f4',
      dark: '#0288d1',
      light: '#4fc3f7',
    },
    error: {
      main: '#f44336',
      dark: '#d32f2f',
      light: '#e57373',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
      highlight: '#e3f2fd',
      lightPurple: '#f3e5f5',
      lightGreen: '#e8f5e9',
      lightOrange: '#fff3e0',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
      disabled: '#9e9e9e',
    },
    divider: '#e0e0e0',
    // カスタムカラー
    teamColors: [
      '#2196f3', // 青
      '#f50057', // ピンク
      '#4caf50', // 緑
      '#ff9800'  // オレンジ
    ],
    gameElements: {
      wordItem: '#e3f2fd',
      wordItemHover: '#bbdefb',
      targetScore: '#e8f5e9',
      gameHistory: '#f3e5f5',
    }
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;