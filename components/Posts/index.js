import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Post from './Post';
import Container from '../common/Container';
import { useWindowWidth } from '../hooks/useWindowWidth';

const PostListContainer = styled.div(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
}));

const LoadMoreButton = styled.button(() => ({
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: 5,
  cursor: 'pointer',
  fontSize: 16,
  marginTop: 20,
  transition: 'background-color 0.3s ease',
  fontWeight: 600,

  '&:hover': {
    backgroundColor: '#0056b3',
  },
  '&:disabled': {
    backgroundColor: '#808080',
    cursor: 'default',
  },
}));

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [hasMore, setHasMore] = useState(true); // Track if there are more posts to load
  const [page, setPage] = useState(0); // Track the current page

  const { isSmallerDevice } = useWindowWidth();
  const limit = isSmallerDevice ? 5 : 10;

  useEffect(() => {
    const fetchPost = async () => {
      const { data: posts } = await axios.get('/api/v1/posts', {
        params: { start: 0, limit },
      });
      setPosts(posts);
      setHasMore(posts.length === limit); // If the fetched posts are less than the limit, there are no more posts
    };

    fetchPost();
  }, [isSmallerDevice, limit]);

  const handleClick = async () => {
    setIsLoading(true);

    const nextPage = page + 1;

    try {
      const { data: newPosts } = await axios.get('/api/v1/posts', {
        params: { start: nextPage * limit, limit },
      });

      setPosts(prevPosts => [...prevPosts, ...newPosts]);
      setPage(nextPage);
      setHasMore(newPosts.length === limit); // If the fetched posts are less than the limit, there are no more posts
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <PostListContainer>
        {posts.map((post, index) => (
          <Post key={index} post={post} />
        ))}
      </PostListContainer>

      {hasMore && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <LoadMoreButton onClick={handleClick} disabled={isLoading}>
            {!isLoading ? 'Load More' : 'Loading...'}
          </LoadMoreButton>
        </div>
      )}
    </Container>
  );
}
