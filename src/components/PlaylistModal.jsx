import React, { use, useState } from "react";
import { useSpotify } from "../context/SpotifyContext.jsx";


function timeLabel(timeRange) {
    if (timeRange === "short_term") return "Last 4 Weeks";
    if (timeRange === "medium_term") return "Last 6 Months";
    if (timeRange === "long_term") return "All Time";
    return "";
}

export default function PlaylistModal({ onClose }) {
    const { 
        items,
        accessToken,
        limit,
        timeRange
    } = useSpotify();

    const [loading, setLoading] = useState(false);
    const [playlistStatus, setPlaylistStatus] = useState("");
    const [playlistName, playListName] = useState(`See My Top ${limit} Tracks — ${timeLabel(timeRange)}`);

    const createPlaylist = async () => {
        setLoading(true);
        setPlaylistStatus("");

        try {

            const userRes = await fetch("https://api.spotify.com/v1/me", {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (!userRes.ok) throw new Error("Failed to fetch user profile");
            const userData = await userRes.json();
            const userId = userData.id;

            const createPlaylistRes = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                method: "POST",
                headers: { 
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: playlistName,
                    description: `My top ${limit} tracks from ${timeLabel(timeRange)} created with See My Sound.`,
                    public: true,
                }),
            });
            if (!createPlaylistRes.ok) {
                const text = await createPlaylistRes.text();
                throw new Error(`Failed to create playlist: ${text}`);
            }

            const playlistData = await createPlaylistRes.json();

            const trackUris = items.map(item => item.uri);

            if (trackUris.length > 0) {
                const addTracksRes = await fetch(`https://api.spotify.com/v1/playlists/${playlistData.id}/tracks`, {
                    method: "POST",
                    headers: { 
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        uris: trackUris,
                    }),
                });
                if (!addTracksRes.ok) {
                    const text = await addTracksRes.text();
                    throw new Error(`Failed to add tracks to playlist: ${text}`);
                }

                setPlaylistStatus(`Playlist created successfully! You can view it on Spotify: ${playlistData.external_urls.spotify}`);
            }
        } catch (error) {
            console.error("Error creating playlist:", error);
            setPlaylistStatus("Error creating playlist. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal">

                <h3>Create Playlist</h3>
                <input 
                    className="playlist-name-input" 
                    type="text" value={playlistName} 
                    onChange={(e) => playListName(e.target.value)} 
                />
                                {playlistStatus && <p className="playlist-status">{playlistStatus}</p>}
                <div className="modal-actions" >
                    <button
                        className="btn-primary" 
                        onClick={createPlaylist}
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create on Spotify"}
                    </button>
                    <button className="btn-outline" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    )
}