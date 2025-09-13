import React, { useState, useEffect } from 'react';
import { Container, Grow, Grid, AppBar, TextField, Button, Paper } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import ChipInput from 'material-ui-chip-input';

import { getPostsBySearch } from '../../actions/posts';
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

  const [search, setSearch] = useState(searchQuery || '');
  const [tags, setTags] = useState(tagsQuery ? tagsQuery.split(',').filter(tag => tag.trim() !== '') : []);
  const history = useHistory();

  const searchPost = () => {
    if (search.trim() || tags.length > 0) {
      dispatch(getPostsBySearch({ search, tags: tags.join(',') }));
      history.push(`/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}`);
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

  // Clear search state when navigating to main posts page (no search params)
  useEffect(() => {
    if (!searchQuery && !tagsQuery) {
      setSearch('');
      setTags([]);
    }
  }, [searchQuery, tagsQuery]);

  // Trigger search when component loads with URL parameters
  useEffect(() => {
    if (searchQuery || tagsQuery) {
      dispatch(getPostsBySearch({ search: searchQuery, tags: tagsQuery }));
    }
  }, [dispatch, searchQuery, tagsQuery]);

  // Clear search on page refresh (when component mounts)
  useEffect(() => {
    // Check if we're on a search page and clear it on refresh
    if (searchQuery || tagsQuery) {
      // Use a small delay to ensure the component is fully mounted
      const timer = setTimeout(() => {
        history.replace('/posts');
        setSearch('');
        setTags([]);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [searchQuery, tagsQuery, history]);

  return (
    <Grow in>
      <Container maxWidth="xl">
        <Grid container justify="space-between" alignItems="stretch" spacing={3} className={classes.gridContainer}>
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
