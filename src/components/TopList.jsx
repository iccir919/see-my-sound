import React, { useEffect } from "react";
import { useSpotify } from "../context/SpotifyContext.jsx";
import { fetchTopItems } from "../utils/spotifyApi.js";
import CollageModal from "./CollageModal.jsx";
import PlaylistModal from "./PlaylistModal.jsx";


export default function TopList() {
    const {
        accessToken,
        refreshToken,
        setAccessToken,
        type,
        timeRange,
        limit,
        items,
        setItems
    } = useSpotify();

    const [showCollage, setShowCollage] = React.useState(false);
    const [showPlaylist, setShowPlaylist] = React.useState(false);


    useEffect(() => {
        if (!accessToken) return;

        fetchTopItems(type, timeRange, limit, accessToken, refreshToken, setAccessToken)
            .then(items => setItems(items))
            .catch((err) => {
                console.error(err);
                setItems([]);
            });
}, [accessToken, refreshToken, type, timeRange, limit, setAccessToken, setItems]);

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
            {showPlaylist && <PlaylistModal onClose={() => setShowPlaylist(false)} />}
        </section> 
    );
}       