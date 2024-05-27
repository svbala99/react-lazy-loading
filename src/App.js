import React, { useState, useEffect } from 'react';

const App = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    // Fetch initial data
    fetchPosts(page);

    // Attach scroll event listener
    const handleScrollDebounced = debounce(handleScroll, 3000);
    window.addEventListener('scroll', handleScrollDebounced);
    return () => window.removeEventListener('scroll', handleScrollDebounced);
  }, []);

  useEffect(() => {
    if (page !== 1) {
      fetchPosts(page);
    }
  }, [page]);

  const fetchPosts = async (page) => {
    setLoading(true);
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${pageSize}`);
      const data = await response.json();
      setPosts(prevPosts => [...prevPosts, ...data]);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
    setLoading(false);
  };

  const handleScroll = () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500 && !loading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  // Custom debounce function
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  return (
    <div className="App">
      <h1>Lazy Loaded Posts</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default App;