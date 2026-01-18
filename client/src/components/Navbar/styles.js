import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  appBar: {
    borderRadius: 20,
    margin: '24px 0',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 40px',
    position: 'relative',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      padding: '16px 24px',
      margin: '16px 0',
      gap: '16px',
    },
  },
  heading: {
    background: 'linear-gradient(135deg, #00D4AA 0%, #00A888 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textDecoration: 'none',
    fontSize: '1.75rem',
    fontWeight: 700,
    letterSpacing: '-0.02em',
  },
  image: {
    marginLeft: '12px',
    marginTop: '2px',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: 'auto',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      justifyContent: 'center',
    },
  },
  profile: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '16px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
  },
  logout: {
    marginLeft: 0,
    background: 'linear-gradient(135deg, #FF6B6B 0%, #E55555 100%)',
    color: '#fff',
    fontWeight: 600,
    boxShadow: '0 4px 14px 0 rgba(255, 107, 107, 0.3)',
    '&:hover': {
      background: 'linear-gradient(135deg, #FF8E8E 0%, #FF6B6B 100%)',
      boxShadow: '0 6px 20px 0 rgba(255, 107, 107, 0.4)',
    },
  },
  userName: {
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    color: theme.palette.text.primary,
    fontWeight: 600,
    fontSize: '1rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.9rem',
    },
  },
  brandContainer: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
  },
  avatar: {
    width: 40,
    height: 40,
    background: 'linear-gradient(135deg, #00D4AA 0%, #FF6B6B 100%)',
    fontWeight: 700,
    fontSize: '1.1rem',
    border: '2px solid rgba(255, 255, 255, 0.8)',
    boxShadow: '0 4px 12px rgba(0, 212, 170, 0.3)',
  },
}));
