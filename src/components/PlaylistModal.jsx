import React, { useState } from "react";
import { useSpotify } from "../context/SpotifyContext.jsx";
import { createPlaylistWithTracks  } from "../utils/spotifyApi.js";



function timeLabel(timeRange) {
    if (timeRange === "short_term") return "Last 4 Weeks";
    if (timeRange === "medium_term") return "Last 6 Months";
    if (timeRange === "long_term") return "All Time";
    return "";
}

export default function PlaylistModal({ onClose, onSessionExpired }) {
    const { 
        items,
        limit,
        timeRange
    } = useSpotify();

    const [loading, setLoading] = useState(false);
    const [playlistUrl, setPlaylistUrl] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [playlistName, setPlaylistName] = useState(`See My Top ${limit} Tracks — ${timeLabel(timeRange)}`);

    async function handlePlaylistCreation() {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const trackUris = items.map(item => item.uri);
            const description = `My top ${limit} tracks from ${timeLabel(timeRange)} created with See My Sound.`;

            const playlist = await createPlaylistWithTracks(
                playlistName,
                description,
                trackUris
            )

            setSuccess(true);
            setPlaylistUrl(playlist.external_urls.spotify);
        } catch (error) {
            console.error("Error creating playlist", error);

            if (error.message === "ACCESS_FORBIDDEN") {
                setError(
                    "Access denied. This app is in development mode. Please email your Spotify account email to neil.ricci9@gmail.com to be added to the allowlist."
                );
            } else if (
                error.message === "SESSION_EXPIRED"
                || error.message === "TOKEN_EXPIRED"
            ) {
                setError("Your session has expired. Logging you out...");
                setTimeout(() => {
                    onSessionExpired()
                }, 2000)
            } else if (error.message.startsWith("RATE_LIMITED:")) {
                const seconds = error.message.split(":")[1]
                setError(`Too many requests. Please wait ${seconds} seconds.`)
            } else {
                setError(error.message || "Failed to create playlist. Please try again.")
            }

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
                    type="text" 
                    value={playlistName} 
                    onChange={(e) => setPlaylistName(e.target.value)} 
                    disabled={loading || success}
                />

                {success && playlistUrl && (
                    <div className="playlist-status-success">
                        <p>
                            ✓ Playlist created!{' '}
                            <a 
                                href={playlistUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                Open in Spotify
                            </a>
                        </p>
                    </div>
                )}

                {error && (
                    <div className="playlist-status-error">
                        <p>{error}</p>
                    </div>
                )}



                <div className="modal-actions" >
                    <button
                        className="btn-primary" 
                        onClick={handlePlaylistCreation}
                        disabled={loading || success}
                    >
                        {loading ? "Creating..." : "Create on Spotify"}
                    </button>
                    <button 
                        className="btn-outline" 
                        onClick={onClose}
                        disabled={loading}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}