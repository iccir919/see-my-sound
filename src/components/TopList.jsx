import React, { useState, useEffect } from "react";
import { useSpotify } from "../context/SpotifyContext.jsx";
import { fetchTopItems } from "../utils/spotifyApi.js";
import CollageModal from "./CollageModal.jsx";
import PlaylistModal from "./PlaylistModal.jsx";


export default function TopList({ onSessionExpired }) {
    const {
        type,
        timeRange,
        limit,
        items,
        setItems
    } = useSpotify();

    const [showCollage, setShowCollage] = React.useState(false);
    const [showPlaylist, setShowPlaylist] = React.useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadTopItems() {
            setLoading(true);
            setError(null);

            try {
                const data = await fetchTopItems(type, timeRange, limit);
                setItems(data);
            } catch (error) {
                console.error("Error loading top items:", error);

                if (error.message === "ACCESS_FORBIDDEN") {
                    setError(
                        "Access denied. This app is in development mode. Please email your Spotify account email to neil.ricci9@gmail.com to be added to the allowlist."
                    );
                } else if (
                    error.message === "SESSION_EXPIRED" 
                    || error.message === "TOKEN_EXPIRED"
                ) {
                    setError("Your session has expired. Please log in again.");
                    setTimeout(() => {
                        onSessionExpired()
                    }, 2000)
                } else if (error.message.startsWith("RATE_LIMITED:")) {
                    const seconds = error.message.split(":")[1];
                    setError(`Too many requests. Please wait ${seconds} seconds.`)
                } else {
                    setError(error.message || "Failed to load your top items")
                }

                setItems([]);
            } finally {
                setLoading(false);
            }
        }
        loadTopItems()
    }, [type, timeRange, limit]);


    if (error) {
        return (
            <section className="top-list">
                <div className="top-list-error">
                    <p>{error}</p>
                    {!error.includes("session has expired") && (
                        <button
                            className="btn-primary"
                            onClick={() => window.location.reload()}
                        >
                            Try Again
                        </button>
                    )}
                </div>
            </section>
        );
    }

    if (loading) {
        return (
            <div className="top-list-empty">
                <p>Loading...</p>
            </div>
        )
    }

    if (items.length === 0) {
        return (
            <section className="top-list-empty">
                <p>No {type} found for this time period.</p>
            </section>
        );
    }
    
    return (
        <section className="top-list">

            <div className="top-list-actions">
                {type === "artists" ? (
                    <button className="btn-primary" onClick={() => setShowCollage(true)}>Make Collage</button>
                ) : (
                    <button className="btn-primary" onClick={() => setShowPlaylist(true)}>Make Playlist</button>
                )}
            </div>

            <div className="grid">
                {items.map((item, index) => {
                    const imgUrl = item.images?.[0]?.url || item.album?.images?.[0]?.url || "";
                    return (
                        <div key={item.id || index} className="item">
                            <img src={imgUrl} alt={item.name} className="item-img" />
                            <div className="item-body">
                                <div className="item-title">{index + 1}. {item.name}</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {showCollage && <CollageModal onClose={() => setShowCollage(false)} />}
            {showPlaylist && 
                <PlaylistModal 
                    onClose={() => setShowPlaylist(false)} 
                    onSessionExpired={onSessionExpired}
                />
            }
        </section> 
    );
}       