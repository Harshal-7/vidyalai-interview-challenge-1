const express = require('express');
const axios = require('axios');
const { fetchPosts } = require('./posts.service');
const { fetchUserById } = require('../users/users.service');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const posts = await fetchPosts();

    // Used Promise.all to fetch photos for each post
    const postsWithDetails = await Promise.all(
      posts.map(async post => {
        const { data: photos } = await axios.get(
          `https://jsonplaceholder.typicode.com/albums/${post.id}/photos`,
        );

        // To display user's name & email in each post
        const { data: user } = await axios.get(
          `https://jsonplaceholder.typicode.com/users/${post.userId}`,
        );

        return {
          ...post,
          images: photos.map(photo => ({ url: photo.url })),
          user: {
            name: user.name,
            email: user.email,
          },
        };
      }),
    );

    res.json(postsWithDetails);
  } catch (error) {
    console.error('Error fetching posts or photos:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
