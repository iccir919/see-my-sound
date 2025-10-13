import { useEffect, useState } from "react"
import { fetchWithAuth } from "../utils/spotify.js"

export default function TopList({ type, timeRange, limit}) {
    const [items, setItems] = useState([])

    useEffect(() => {
        async function fetchData() {
            setItems([])
            const requestUrl = `https://api.spotify.com/v1/me/top/${type}?time_range=${timeRange}&limit=${limit}`
            const response = await fetchWithAuth(requestUrl)
            if (response.ok) {
                const data = await response.json()
                console.log("data", data)
                setItems(data.items || [])
            } else {
                console.error("Failed to fetch top items", response.status)
            }
        }

        fetchData()
    }, [type, timeRange, limit])

    return (
        <div className="top-list">
            {items.map((item, idx) => {
                console.log(item)
                return (
                    <div key={idx} className="top-item">
                        <span className="rank">{idx + 1}</span>
                        <img
                            src={
                                type === "artists" ?
                                item?.images?.[0]?.url :
                                item?.album?.images?.[0]?.url
                            }
                            alt={item.name}
                            className="artwork"
                        />
                        <div className="info">
                            <p className="name">{item.name}</p>
                            {
                                type === "tracks" &&
                                (<p className="artists">
                                    {
                                        item?.artists
                                            ?.map(artist => artist.name)
                                            .join(", ")
                                    }
                                </p>)
                            }
                        </div>
                    </div>
                )
            }
            
            )}
        </div>
    )
}