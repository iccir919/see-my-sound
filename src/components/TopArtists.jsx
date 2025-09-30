import { useEffect, useState } from 'react'
import { spotifyFetch } from '../utils/api.js'

export default function TopArtists ({ accessToken }) {
    const [topArtists, setTopArtists] = useState([])
    
    useEffect(() => {
        if (!accessToken) return

        spotifyFetch('https://api.spotify.com/v1/me/top/artists?limit=10', accessToken)
            .then(data => {
                if (data && data.items) {
                    setTopArtists(data.items)
                } else {
                    console.error("Failed to fetch top artists")
                }
            })
    }, [])

    return (
        <div id="top-artists">
            <h2>your top artists</h2>
            <ul>
                {topArtists.map(artist => (
                    <li key={artist.id}>
                        {artist.images[0] && 
                            <img 
                                src={artist.images[0].url} 
                                alt={artist.name} 
                                width={64} 
                                height={64} 
                            />
                        }
                        <span>{artist.name}</span>
                    </li>
                ))}
            </ul>
        </div>   
    )
}