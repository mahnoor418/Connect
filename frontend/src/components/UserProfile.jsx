import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import axios from "axios";

const API = "http://127.0.0.1:5000/api";

export default function UserProfile() {
  const { id: profileId } = useParams();

  // ───────────────────────────────────────── state
  const [viewerId, setViewerId] = useState(null);   // logged-in user
  const [userData, setUserData] = useState(null);   // profile owner
  const [userPosts, setUserPosts] = useState([]);     // owner’s posts
  const [isFollowing, setIsFollowing] = useState(false);

  // ───────────────────────────────────────── grab viewerId from JWT once
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setViewerId(decoded.id);          // ← your JWT payload must contain { id }
    } catch (_) {
      console.warn("Bad token");
    }
  }, []);

  // ───────────────────────────────────────── pull profile + posts
  const fetchUser = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API}/users/${profileId}`);

      // 1️⃣ save the whole document
      setUserData(data);

      // 2️⃣ postsData → state for the grid
      setUserPosts(data.postsData ?? []);

      // 3️⃣ follower test (followers comes back as an array of strings)
      setIsFollowing(data.followers.includes(viewerId));
    } catch (err) {
      console.error(err);
      alert(
        err.response?.status === 404 ? "User not found" : "Something went wrong."
      );
    }
  }, [profileId, viewerId]);

  // run whenever the viewer OR profile changes
  useEffect(() => {
    if (profileId && viewerId) fetchUser();
  }, [fetchUser]);

  // ───────────────────────────────────────── follow / unfollow
  const toggleFollow = async () => {
    // follow → send follow_id,     path = /<viewerId>/follow
    // unfollow → send unfollow_id, path = /<viewerId>/unfollow
    const route = isFollowing ? "unfollow" : "follow";
    const bodyKey = isFollowing ? "unfollow_id" : "follow_id";

    try {
      await axios.put(
        `${API}/users/${viewerId}/${route}`,
        { [bodyKey]: profileId },                       // 👈 match Flask
        { headers: { "Content-Type": "application/json" } }
      );
      fetchUser();                                     // refresh UI
    } catch (err) {
      console.error(err);
    }
  };


  // ───────────────────────────────────────── render
  if (!userData) return <div>Loading…</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* profile header */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={
                userData.profilePicture
                  ? `http://127.0.0.1:5000/uploads/${userData.profilePicture}`
                  : "https://via.placeholder.com/100"
              }
              alt={userData.username}
              className="w-20 h-20 rounded-full mr-4 object-cover"
            />

            <div>
              <h2 className="text-2xl font-bold">{userData.username}</h2>
              <p className="text-gray-700">{userData.email}</p>
              <p className="text-gray-700">
                {userData.bio || "No bio provided."}
              </p>
            </div>
          </div>

          {viewerId && viewerId !== userData._id && (
            <button
              onClick={toggleFollow}
              className={`bg-${isFollowing ? "red" : "blue"}-500 hover:bg-${isFollowing ? "red" : "blue"
                }-700 text-white font-bold py-2 px-4 rounded`}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>

        {/* posts grid */}
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-2">Posts</h3>

          {userPosts.length === 0 ? (
            <p className="text-gray-500">No posts yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {userPosts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  viewerId={viewerId}
                  owner={userData}
                  userhe={userData}
                  onPostUpdated={fetchUser}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
