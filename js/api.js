console.log("api.js loaded")

const fetchSpotifyApi = async (endpoint, method = 'GET', body = null) => {
    const accessToken = localStorage.getItem("access_token")
    if (!accessToken) return null

    let response = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        method: method,
        body: body ? JSON.stringify(body) : null
    })

    if ( !response.ok ) {
        console.error("Spotify API error", response.status, response.statusText)
        return null
    }

    return await response.json()
}

export { fetchSpotifyApi }