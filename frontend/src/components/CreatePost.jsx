import React, { useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useAuth } from '../Context/AuthContext';

const LocationSelector = ({ setLocation }) => {
  useMapEvents({
    click(e) {
      setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
};

const CreatePost = () => {
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState(null);
  const [mentions, setMentions] = useState('');
  const [location, setLocation] = useState(null);

  const [suggestedCaption, setSuggestedCaption] = useState(null);
  const [captionStatus, setCaptionStatus] = useState('idle'); // idle | loading | done | error

  const { user } = useAuth();

  /* 🔗 REPLACE with the tunnel printed by Colab every time it restarts */
  const CAPTION_API = 'https://7cbb-35-227-97-104.ngrok-free.app/caption/';

  /* ───────────────────────── caption fetch ───────────────────────── */
  const handleMediaChange = async (e) => {
    const file = e.target.files[0];
    setMedia(file);

    // Only caption images
    if (!file?.type.startsWith('image/')) {
      setSuggestedCaption(null);
      return;
    }

    const fd = new FormData();
    fd.append('file', file);

    try {
      setCaptionStatus('loading');
      const { data } = await axios.post(CAPTION_API, fd);
      console.log('Caption API response:', data);
      if (data?.caption) {
        setSuggestedCaption(data.caption);
        setCaptionStatus('done');
      } else {
        setCaptionStatus('error');
      }
    } catch (err) {
      console.error('Caption fetch failed:', err);
      setCaptionStatus('error');
    }
  };

  /* ───────────────────────── post submit ───────────────────────── */
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!user) return alert('User not logged in.');

    const formData = new FormData();
    formData.append('description', description);
    if (media) formData.append('media', media);
    if (location) {
      formData.append('location[lat]', location.lat);
      formData.append('location[lng]', location.lng);
    }
    mentions
      .split(',')
      .map((m) => m.trim())
      .filter(Boolean)
      .forEach((m) => formData.append('mentions[]', m));

    try {
      await axios.post(
        `http://127.0.0.1:5000/api/users/${user.id}/posts`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setDescription('');
      setMedia(null);
      setMentions('');
      setSuggestedCaption(null);
      setCaptionStatus('idle');
      alert('Post created successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to create post.');
    }
  };

  /* ───────────────────────── UI ───────────────────────── */
  return (
    <form
      onSubmit={handleCreatePost}
      className="bg-white shadow-md rounded-lg p-4 mb-4"
    >
      {/* Caption suggestion block */}
      {captionStatus === 'loading' && (
        <p className="text-sm text-gray-500 mb-3">
          🔄 Analyzing image…
        </p>
      )}

      {captionStatus === 'error' && (
        <p className="text-sm text-red-500 mb-3">
          ⚠️ Couldn’t generate a caption. (Check console for details)
        </p>
      )}

      {captionStatus === 'done' && suggestedCaption && (
        <div className="bg-gray-100 p-3 rounded mb-3">
          <p className="text-xs text-gray-600 mb-1">Suggested Caption</p>
          <p className="font-medium mb-2">“{suggestedCaption}”</p>

          <button
            type="button"
            onClick={() => {
              setDescription((prev) =>
                prev ? `${prev} ${suggestedCaption}` : suggestedCaption
              );
              setCaptionStatus('idle'); // hide block after use
            }}
            className="mr-3 text-xs text-blue-600 hover:underline"
          >
            ✓ Use caption
          </button>

          <button
            type="button"
            onClick={() => setCaptionStatus('idle')}
            className="text-xs text-gray-600 hover:underline"
          >
            ✗ Ignore
          </button>
        </div>
      )}

      {/* Post textarea */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
        required
      />

      {/* Media picker */}
      <input
        type="file"
        onChange={handleMediaChange}
        className="mb-4"
        accept="image/*,video/*"
      />

      {/* Mentions */}
      <input
        type="text"
        value={mentions}
        onChange={(e) => setMentions(e.target.value)}
        placeholder="Mention user IDs (comma-separated)"
        className="w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
      />

      {/* Location picker */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Location (optional)
        </label>
        <MapContainer
          center={[33.6844, 73.0479]}
          zoom={13}
          style={{ height: '300px', width: '100%' }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationSelector setLocation={setLocation} />
          {location && <Marker position={[location.lat, location.lng]} />}
        </MapContainer>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Post
      </button>
    </form>
  );
};

export default CreatePost;
