import { useEffect, useState } from "react"
import { spotifyFetch } from "../utils/api.js"

const TopTracks = () => {

    const [topTracks, setTopTracks] = useState([])

    useEffect(() => {
        const accessToken = localStorage.getItem("access_token")
        if (!accessToken) return

        spotifyFetch("https://api.spotify.com/v1/me/top/tracks?limit=10", accessToken)
            .then(data => {
                if (data && data.items) {
                    console.log(data)
                    setTopTracks(data.items)
                } else {
                    console.error("Failed to fetch top tracks")
                }
            })
    }, [])

    return (
        <div className="top-tracks">
            <h2 className="section-title">your top tracks</h2>
            <div className="track-grid">
                {topTracks.map(track => (
                    <div key={track.id} className="track-card">
                        <img
                            src={track.album.images?.[0]?.url}
                            alt={track.name}
                            className="track-image"
                        />
                        <div className="track-details">
                            <p className="track-name">{track.name}</p>
                            <p className="track-artist">
                                {
                                    track.artists
                                        .map(artist => artist.name)
                                        .join(", ")
                                }
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TopTracks