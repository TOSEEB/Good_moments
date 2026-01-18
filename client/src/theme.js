import { createMuiTheme } from '@material-ui/core/styles';

// Modern, unique color palette - teal/coral gradient theme
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#00D4AA', // Modern teal green
      light: '#33DDB8',
      dark: '#00A888',
      contrastText: '#fff',
    },
    secondary: {
      main: '#FF6B6B', // Warm coral red
      light: '#FF8E8E',
      dark: '#E55555',
      contrastText: '#fff',
    },
    background: {
      default: '#F5F7FA', // Soft gray background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2D3748', // Dark gray
      secondary: '#718096', // Medium gray
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 12, // Modern, less rounded than typical tutorial (15)
  },
  shadows: [
    'none',
    '0 2px 8px rgba(0, 0, 0, 0.08)',
    '0 4px 16px rgba(0, 0, 0, 0.1)',
    '0 8px 24px rgba(0, 0, 0, 0.12)',
    '0 12px 32px rgba(0, 0, 0, 0.14)',
    '0 16px 48px rgba(0, 0, 0, 0.16)',
    '0 20px 64px rgba(0, 0, 0, 0.18)',
    '0 24px 80px rgba(0, 0, 0, 0.2)',
    '0 28px 96px rgba(0, 0, 0, 0.22)',
    '0 32px 112px rgba(0, 0, 0, 0.24)',
    '0 36px 128px rgba(0, 0, 0, 0.26)',
    '0 40px 144px rgba(0, 0, 0, 0.28)',
    '0 44px 160px rgba(0, 0, 0, 0.3)',
    '0 48px 176px rgba(0, 0, 0, 0.32)',
    '0 52px 192px rgba(0, 0, 0, 0.34)',
    '0 56px 208px rgba(0, 0, 0, 0.36)',
    '0 60px 224px rgba(0, 0, 0, 0.38)',
    '0 64px 240px rgba(0, 0, 0, 0.4)',
    '0 68px 256px rgba(0, 0, 0, 0.42)',
    '0 72px 272px rgba(0, 0, 0, 0.44)',
    '0 76px 288px rgba(0, 0, 0, 0.46)',
    '0 80px 304px rgba(0, 0, 0, 0.48)',
    '0 84px 320px rgba(0, 0, 0, 0.5)',
    '0 88px 336px rgba(0, 0, 0, 0.52)',
    '0 92px 352px rgba(0, 0, 0, 0.54)',
  ],
  overrides: {
    MuiButton: {
      root: {
        borderRadius: 10,
        padding: '10px 24px',
        fontSize: '0.95rem',
      },
      contained: {
        boxShadow: '0 4px 14px 0 rgba(0, 212, 170, 0.3)',
        '&:hover': {
          boxShadow: '0 6px 20px 0 rgba(0, 212, 170, 0.4)',
        },
      },
    },
    MuiCard: {
      root: {
        borderRadius: 16,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiPaper: {
      root: {
        borderRadius: 16,
      },
      elevation1: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      },
      elevation2: {
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
      },
    },
  },
});

export default theme;


