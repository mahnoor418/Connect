import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaInstagram, FaPlus, FaSearch, FaCog } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profilePic, setProfilePic] = useState('');
  const [userId, setUserId] = useState(null);
  const [query, setQuery] = useState(''); // Search query state
  const [users, setUsers] = useState([]); // Users search results state
  const [isSearchVisible, setIsSearchVisible] = useState(false); // Toggle for showing search bar
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      try {
        const decoded = jwtDecode(token);
        const userId = decoded.id;
        setUserId(userId);

        fetch(`http://127.0.0.1:5000/api/users/${userId}`)
          .then((res) => {
            if (!res.ok) throw new Error('Failed to fetch user data');
            return res.json();
          })
          .then((data) => {
            console.log('User data:', data);
            if (data.profilePicture) {
              setProfilePic(data.profilePicture);
            }
          })
          .catch((err) => {
            console.error('Error fetching user data:', err);
          });
      } catch (err) {
        console.error('Invalid token:', err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  // Fetch users for search
  useEffect(() => {
    const fetchUsers = async () => {
      if (!query.trim()) {
        setUsers([]);
        return;
      }

      try {
        const response = await fetch(`http://127.0.0.1:5000/api/users/search/query?q=${query}`);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Search failed:', error);
        setUsers([]);
      }
    };

    fetchUsers();
  }, [query]);

  return (
    <header className="bg-gradient-to-r from-blue-500 to-purple-600 shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold flex items-center gap-2">
          <FaInstagram className="text-white" /> Connect
        </Link>

        <nav className="flex items-center gap-4">
          {isLoggedIn && (
            <>
              <button
                onClick={() => navigate('/create-post')}
                className="bg-white p-2 rounded-full hover:bg-blue-100 transition"
                title="Create Post"
              >
                <FaPlus className="text-blue-600" size={18} />
              </button>
              <button
                onClick={() => navigate('/edit-profile')}
                className="bg-white p-2 rounded-full hover:bg-green-100 transition"
                title="Edit Profile"
              >
                <FaCog className="text-green-600" size={18} />
              </button>

              {/* Search Button */}
              <button
                onClick={() => setIsSearchVisible(!isSearchVisible)}
                className="bg-white p-2 rounded-full hover:bg-purple-100 transition"
                title="Search Profiles"
              >
                <FaSearch className="text-purple-600" size={18} />
              </button>
            </>
          )}

          {/* Search Bar */}
          {isSearchVisible && (
            <div className="absolute top-14 left-0 right-0 max-w-md mx-auto bg-white p-4 rounded-lg shadow-lg">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search users..."
                className="w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
              />
              <div className="max-h-60 overflow-y-auto">
                {users.length === 0 && query ? (
                  <p className="text-gray-500">No users found.</p>
                ) : (
                  users.map((user) => (
                    <div key={user._id} className="p-4 border-b border-gray-300 hover:bg-gray-100 cursor-pointer">
                      <Link to={`/profile/${user._id}`} className="flex items-center">
                        <img
                          src={`http://127.0.0.1:5000/uploads/${user.profilePicture}`}
                          alt={user.username}
                          className="w-10 h-10 rounded-full mr-4"
                        />
                        <div>
                          <h2 className="text-lg font-semibold">{user.username}</h2>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {isLoggedIn ? (
            <>
              <Link to={`/profile/${userId}`} title="View Profile">
                <img
                  src={profilePic ? `http://127.0.0.1:5000/uploads/${profilePic}` : '/default-profile.png'}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white hover:ring-2 hover:ring-white transition"
                />
              </Link>
              <button
                onClick={handleLogout}
                className="text-white hover:text-red-300 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white hover:underline transition">
                Login
              </Link>
              <Link to="/register" className="text-white hover:underline transition">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
