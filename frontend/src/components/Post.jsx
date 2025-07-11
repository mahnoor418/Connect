import React, { useState, useEffect } from 'react';
import api from '../services/api';
import axios from 'axios';

const Post = ({ post }) => {
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState(post.comments);
  const [commentText, setCommentText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editDescription, setEditDescription] = useState(post.description);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/users/${post.user}/posts/${post._id}`);
        setLikes(response.data.likes);
        setComments(response.data.comments);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPost();
  }, [post._id]);

  const handleLike = async () => {
    try {
      await axios.post(`http://localhost:5001/api/users/${post.user}/posts/${post._id}/like`);
      setLikes([...likes, { user: 'currentUserId' }]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5001/api/users/${post.user}/posts/${post._id}/comment`, { text: commentText });
      setComments([...comments, { user: 'currentUserId', text: commentText }]);
      setCommentText('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5001/api/users/${post.user}/posts/${post._id}/update`, { description: editDescription });
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5001/api/users/${post.user}/posts/${post._id}/delete`);
      // Redirect or update the feed
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <div className="flex items-center">
        <img
          src={post.user.profilePicture}
          alt={post.user.username}
          className="w-10 h-10 rounded-full mr-4"
        />
        <div>
          <h2 className="text-xl font-bold">{post.user.username}</h2>
          <p className="text-gray-700">{post.user.name}</p>
        </div>
      </div>
      <div className="mt-4">
        <img src={post.media} alt={post.description} className="w-full h-60 object-cover rounded-lg" />
        {isEditing ? (
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
          />
        ) : (
          <p className="text-gray-700 mt-2">{post.description}</p>
        )}
      </div>
      <div className="flex items-center mt-4">
        <button
          onClick={handleLike}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Like
        </button>
        <span className="ml-4 text-gray-700">{likes.length} likes</span>
      </div>
      <div className="mt-4">
        <form onSubmit={handleComment}>
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
          >
            Comment
          </button>
        </form>
        <div className="mt-2">
          {comments.map((comment) => (
            <div key={comment._id} className="flex items-center mb-2">
              <img
                src={comment.user.profilePicture}
                alt={comment.user.username}
                className="w-8 h-8 rounded-full mr-2"
              />
              <p className="text-gray-700">{comment.user.username}: {comment.text}</p>
            </div>
          ))}
        </div>
      </div>
      {post.user._id === 'currentUserId' && (
        <div className="mt-4">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Edit
            </button>
          ) : (
            <button
              onClick={handleEdit}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Save
            </button>
          )}
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default Post;