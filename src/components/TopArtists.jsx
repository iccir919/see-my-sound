import { useEffect, useState } from 'react'
import { spotifyFetch } from '../utils/api.js'

const TopArtists = () => {

    const [topArtists, setTopArtists] = useState([])
    
    useEffect(() => {
        const accessToken = localStorage.getItem("access_token")
        if (!accessToken) return

        spotifyFetch('https://api.spotify.com/v1/me/top/artists?limit=10', accessToken)
            .then((data) => setTopArtists(data.items))
            .catch(err => {
                console.error("Failed to fetch top artists:", err)
            })
    }, [])

    return (
        <div className="top-artists">
            <h2 className="section-title">your top artists</h2>
            <div className="artist-grid">
                {topArtists.map(artist => (
                    <div key={artist.id} className="artist-card">
                        {artist.images[0] && 
                            <img 
                                src={artist.images?.[0]?.url} 
                                alt={artist.name} 
                                className="artist-image"
                            />
                        }
                        <p className="artist-name">{artist.name}</p>
                    </div>
                ))}
            </div>
        </div>   
    )
}

export default TopArtists