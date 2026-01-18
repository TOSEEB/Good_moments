import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  appBarSearch: {
    borderRadius: 20,
    marginBottom: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    gap: '16px',
  },
  pagination: {
    borderRadius: 20,
    marginTop: '1.5rem',
    padding: '20px',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
  },
  gridContainer: {
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column-reverse',
    },
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing(4),
    right: theme.spacing(4),
    zIndex: 1000,
    background: 'linear-gradient(135deg, #00D4AA 0%, #00A888 100%)',
    color: '#fff',
    boxShadow: '0 8px 24px rgba(0, 212, 170, 0.4)',
    '&:hover': {
      background: 'linear-gradient(135deg, #00A888 0%, #00D4AA 100%)',
      boxShadow: '0 12px 32px rgba(0, 212, 170, 0.5)',
      transform: 'scale(1.1)',
    },
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    [theme.breakpoints.up('md')]: {
      display: 'none', // Hide on desktop (form is always visible)
    },
  },
  searchButton: {
    background: 'linear-gradient(135deg, #00D4AA 0%, #00A888 100%)',
    color: '#fff',
    fontWeight: 600,
    borderRadius: 12,
    padding: '12px 24px',
    boxShadow: '0 4px 14px 0 rgba(0, 212, 170, 0.3)',
    '&:hover': {
      background: 'linear-gradient(135deg, #00A888 0%, #00D4AA 100%)',
      boxShadow: '0 6px 20px 0 rgba(0, 212, 170, 0.4)',
    },
  },
}));
