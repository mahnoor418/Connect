import React, { useState, useEffect } from 'react';
import api from '../services/api';
import axios from 'axios';

const PostCard = ({ post, onPostUpdated, userhe }) => {
    const [commentText, setCommentText] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedDescription, setUpdatedDescription] = useState(post.description);

    console.log('PostCard post:', post);
    console.log('PostCard userhe:', userhe);


    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user ? user.id : null;

    let isOwner = false;
    if (post.user?._id === undefined) {
        if (post.user === userId) {
            isOwner = true;
        }
    }

    const [comments, setComments] = useState([]);

    useEffect(() => {
        setComments(post.comments || []);
    }, [post.comments]);

    useEffect(() => {
        if (Array.isArray(post.likes) && userId) {
            const hasLiked = post.likes.some((likerId) => likerId?.toString() === userId);
            setIsLiked(hasLiked);
        }
    }, [post.likes, userId]);

    const handleLike = async () => {
        try {
            const endpoint = isLiked
                ? `http://127.0.0.1:5000/api/users/${userId}/posts/${post._id}/unlike`
                : `http://127.0.0.1:5000/api/users/${userId}/posts/${post._id}/like`;

            await axios.post(endpoint);
            setIsLiked(!isLiked);
            onPostUpdated();
        } catch (err) {
            console.error('Failed to like/unlike post:', err);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        try {
            const response = await axios.post(
                `http://127.0.0.1:5000/api/users/${userId}/posts/${post._id}/comment`,
                { text: commentText, username: user.username },
                { headers: { 'Content-Type': 'application/json' } }   // explicit!
            );


            const newComment = response.data.comment || {
                text: commentText,
                username: user.username,
                _id: new Date().toISOString(),
            };

            setComments((prev) => [...prev, newComment]);
            setCommentText('');
            onPostUpdated();
        } catch (err) {
            console.error('Failed to comment:', err);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;

        try {
            await axios.delete(`http://127.0.0.1:5000/api/users/${userId}/posts/${post._id}/delete`);
            onPostUpdated();
        } catch (err) {
            console.error('Failed to delete post:', err);
        }
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`http://127.0.0.1:5000/api/users/${userId}/posts/${post._id}/update`, {
                description: updatedDescription,
            });
            setIsEditing(false);
            onPostUpdated();
        } catch (err) {
            console.error('Failed to update post:', err);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg transition-all hover:shadow-2xl hover:scale-105 transform duration-300 p-6 mb-6 max-w-2xl mx-auto">
            <div className="flex items-center space-x-4 mb-4">
                <img
                    src={
                        post.user?.profilePicture
                            ? `http://127.0.0.1:5000/uploads/${post.user.profilePicture}`
                            : `http://127.0.0.1:5000/uploads/${userhe?.profilePicture}`
                    }
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                    <p className="font-semibold text-lg">{post.user?.username || user?.username}</p>
                </div>
            </div>

            {post.media && (
                <img
                    src={`http://127.0.0.1:5000/uploads/${post.media}`}
                    alt={post.title || 'Post Image'}
                    className="w-full h-80 object-cover rounded-xl mb-4"
                />
            )}

            {isEditing ? (
                <div className="mb-4">
                    <textarea
                        className="w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                        value={updatedDescription}
                        onChange={(e) => setUpdatedDescription(e.target.value)}
                    />
                    <button
                        onClick={handleUpdate}
                        className="mt-2 px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition duration-300"
                    >
                        Save Changes
                    </button>
                </div>
            ) : (
                <p className="text-gray-800 text-lg mb-4">{post.description}</p>
            )}

            {isOwner && (
                <div className="flex gap-6 mb-4">
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-blue-500 hover:text-blue-600 font-medium transition duration-200"
                    >
                        ✏️ Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        className="text-red-500 hover:text-red-600 font-medium transition duration-200"
                    >
                        🗑 Delete
                    </button>
                </div>
            )}

            <div className="flex items-center gap-6 mb-6">
                <button
                    onClick={handleLike}
                    className={`px-4 py-2 rounded-full font-medium transition duration-300 ${isLiked
                        ? 'bg-red-100 text-red-600 hover:bg-red-200'
                        : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                        }`}
                >
                    {isLiked ? '❤️ Unlike' : '👍 Like'} ({post.likes.length})
                </button>
            </div>

            <form onSubmit={handleComment} className="flex gap-4 mb-4">
                <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                />
                <button
                    type="submit"
                    className="px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition duration-300"
                >
                    Comment
                </button>
            </form>

            <div className="space-y-4">
                {comments.length > 0 ? (
                    comments.map((comment, index) => (
                        <div key={comment._id || index} className="flex items-center gap-2 bg-gray-100 p-4 rounded-lg">
                            <p className="font-semibold text-sm">{comment.username || user.username}:</p>
                            <p className="text-sm text-gray-600">{comment.text}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-400">No comments yet...</p>
                )}
            </div>
        </div>
    );
};

export default PostCard;
