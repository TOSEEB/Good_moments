import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  media: {
    borderRadius: 24,
    objectFit: 'cover',
    width: '100%',
    maxHeight: '600px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
  },
  card: {
    display: 'flex',
    width: '100%',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
    backdropFilter: 'blur(10px)',
    borderRadius: 24,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: {
      flexWrap: 'wrap',
      flexDirection: 'column',
    },
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
    },
  },
  section: {
    borderRadius: 24,
    margin: '16px',
    flex: 1,
    order: 1,
    padding: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      margin: '12px',
      order: 2,
      padding: theme.spacing(2),
    },
  },
  imageSection: {
    marginLeft: '20px',
    order: 2, // On desktop, image comes second (right side)
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
      order: 1, // On mobile, image comes first
      marginBottom: '20px',
    },
  },
  recommendedPosts: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  recommendedPost: {
    margin: '16px',
    cursor: 'pointer',
    padding: '20px',
    borderRadius: 20,
    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    width: '250px',
    height: '280px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      maxWidth: '300px',
      margin: '12px auto',
    },
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
    },
  },
  recommendedImage: {
    width: '200px',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginTop: '10px',
    alignSelf: 'center',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      maxWidth: '200px',
    },
  },
  recommendedTitle: {
    fontWeight: 'bold',
    fontSize: '16px',
    lineHeight: '1.2',
    marginBottom: '8px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  recommendedAuthor: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  recommendedMessage: {
    fontSize: '13px',
    color: '#888',
    marginBottom: '8px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    lineHeight: '1.3',
    maxHeight: '34px',
  },
  recommendedLikes: {
    fontSize: '12px',
    color: '#999',
    marginBottom: '10px',
  },
  loadingPaper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
    borderRadius: 24,
    height: '39vh',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  },
  commentsOuterContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  commentsInnerContainer: {
    height: '200px',
    overflowY: 'auto',
    marginRight: '30px',
    [theme.breakpoints.down('sm')]: {
      marginRight: 0,
      marginBottom: '20px',
      width: '100%',
      order: 1,
    },
  },
  commentInputContainer: {
    width: '70%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      order: 2,
    },
  },
}));
