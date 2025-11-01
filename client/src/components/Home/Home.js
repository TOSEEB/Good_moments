import React, { useState, useEffect } from 'react';
import { Container, Grow, Grid, AppBar, TextField, Button, Paper } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation, Redirect } from 'react-router-dom';
import ChipInput from 'material-ui-chip-input';

import { getPosts, getPostsBySearch } from '../../actions/posts';
import Posts from '../Posts/Posts';
import Form from '../Form/Form';
import Pagination from '../Pagination';
import useStyles from './styles';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
const Home = () => {
  const classes = useStyles();
  const query = useQuery();
  const page = query.get('page') || 1;
  const searchQuery = query.get('searchQuery');
  const tagsQuery = query.get('tags');

  const [currentId, setCurrentId] = useState(0);
  const dispatch = useDispatch();
  const history = useHistory();
  
  // Get user from localStorage - use useState with lazy initialization to prevent re-renders
  const [user, setUser] = useState(() => {
    try {
      const profile = localStorage.getItem('profile');
      if (profile) {
        return JSON.parse(profile);
      }
      return null;
    } catch (error) {
      return null;
    }
  });
  
  const [search, setSearch] = useState(searchQuery || '');
  const [tags, setTags] = useState(tagsQuery ? tagsQuery.split(',').filter(tag => tag.trim() !== '') : []);

  // Extract user result to avoid complex expression in dependency arrays
  const userResult = user?.result;

  const searchPost = () => {
    if (search.trim() || tags.length > 0) {
      // Normalize tags: ensure they have # prefix for consistency
      const normalizedTags = tags.map(tag => {
        const trimmed = tag.trim();
        return trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
      });
      
      // Encode tags properly for URL (encode # as %23)
      const encodedTags = normalizedTags.map(tag => encodeURIComponent(tag)).join(',');
      dispatch(getPostsBySearch({ search, tags: normalizedTags.join(',') }));
      history.push(`/posts/search?searchQuery=${search || 'none'}&tags=${encodedTags}`);
    } else {
      history.push('/');
    }
  };

  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      searchPost();
    }
  };

  const handleAddChip = (tag) => setTags([...tags, tag]);

  const handleDeleteChip = (chipToDelete) => setTags(tags.filter((tag) => tag !== chipToDelete));

  const clearSearch = () => {
    setSearch('');
    setTags([]);
    history.push('/');
  };

  // Update user from localStorage when component mounts
  useEffect(() => {
    try {
      const profile = localStorage.getItem('profile');
      if (profile) {
        const parsed = JSON.parse(profile);
        setUser(parsed);
      }
    } catch (error) {
      // Error reading profile
    }
  }, []);

  // Clear search state when navigating to main posts page (no search params)
  useEffect(() => {
    if (userResult && !searchQuery && !tagsQuery) {
      setSearch('');
      setTags([]);
    }
  }, [searchQuery, tagsQuery, userResult]);

  // Trigger search when component loads with URL parameters
  useEffect(() => {
    if (userResult && (searchQuery || tagsQuery)) {
      // Decode tagsQuery if URL encoded
      let decodedTagsQuery = tagsQuery;
      if (tagsQuery) {
        try {
          decodedTagsQuery = decodeURIComponent(tagsQuery);
        } catch (e) {
          decodedTagsQuery = tagsQuery;
        }
      }
      dispatch(getPostsBySearch({ search: searchQuery, tags: decodedTagsQuery }));
    }
  }, [dispatch, searchQuery, tagsQuery, userResult]);

  // Fetch posts when user is logged in and no search query
  useEffect(() => {
    if (userResult && !searchQuery && !tagsQuery) {
      dispatch(getPosts(page));
    }
  }, [dispatch, page, userResult, searchQuery, tagsQuery]);

  // Redirect to auth if not logged in (after all hooks)
  if (!userResult) {
    return <Redirect to="/auth" />;
  }

  return (
    <Grow in>
      <Container maxWidth="xl">
        <Grid container justifyContent="space-between" alignItems="stretch" spacing={3} className={classes.gridContainer}>
          <Grid item xs={12} sm={6} md={9}>
            <Posts setCurrentId={setCurrentId} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppBar className={classes.appBarSearch} position="static" color="inherit">
              <TextField onKeyDown={handleKeyPress} name="search" variant="outlined" label="Search Memories" fullWidth value={search} onChange={(e) => setSearch(e.target.value)} />
              <ChipInput
                style={{ margin: '10px 0' }}
                value={tags}
                onAdd={(chip) => handleAddChip(chip)}
                onDelete={(chip) => handleDeleteChip(chip)}
                label="Search Tags"
                variant="outlined"
              />
              <Button onClick={searchPost} className={classes.searchButton} variant="contained" color="primary">Search</Button>
              {(search.trim() || tags.length > 0) && (
                <Button onClick={clearSearch} className={classes.searchButton} variant="outlined" color="secondary" style={{ marginTop: '10px' }}>Clear Search</Button>
              )}
            </AppBar>
            <Form currentId={currentId} setCurrentId={setCurrentId} />
            {(!searchQuery && !tags.length) && (
              <Paper className={classes.pagination} elevation={6}>
                <Pagination page={page} />
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </Grow>
  );
};

export default Home;
