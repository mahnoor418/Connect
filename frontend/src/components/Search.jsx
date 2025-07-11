import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Search = () => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce the query input
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500); // wait 500ms after user stops typing

    return () => clearTimeout(timeout); // cleanup on each keystroke
  }, [query]);

  // Fetch users whenever debouncedQuery changes
  useEffect(() => {
    const fetchUsers = async () => {
      if (!debouncedQuery.trim()) {
        setUsers([]);
        return;
      }
      try {
        const response = await axios.get(`http://127.0.0.1:5000/api/users/search/query?q=${debouncedQuery}`);
        console.log('Search response:', response.data);
        setUsers(response.data);
      } catch (error) {
        console.error('Search failed:', error);
        setUsers([]);
      }
    };

    fetchUsers();
  }, [debouncedQuery]);

  return (
    <div className="container mx-auto px-4 py-8">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search users..."
        className="w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
      />

      <div>
        {users.length === 0 && query ? (
          <p className="text-gray-500">No users found.</p>
        ) : (
          users.map((user) => (
            <div key={user._id} className="bg-white shadow-md rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <img
                  src={`http://127.0.0.1:5000/uploads/${user.profilePicture}`}
                  alt={user.username}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />

                <div>
                  <h2 className="text-xl font-semibold text-blue-600">{user.username}</h2>
                  <p className="text-gray-700">{user.email}</p>
                  <p className="text-sm text-gray-500">
                    {user.postCount} Posts · {user.followerCount} Followers
                  </p>
                  <Link
                    to={`/profile/${user._id}`}
                    className="text-blue-500 underline text-sm mt-1 inline-block"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Search;
