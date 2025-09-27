console.log("api.js loaded")

import { refreshAccessToken } from "./auth.js"

const fetchSpotifyApi = async (endpoint, method = 'GET', body = null) => {
    let accessToken = localStorage.getItem("access_token")
    if (!accessToken) {
        console.error("No access token found")
        return null
    }

    let response = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        method: method,
        body: body ? JSON.stringify(body) : null
    })

    if (response.status === 401) {
        console.error("Access token expired or invalid")
        accessToken = await refreshAccessToken()
        if (!accessToken) {
            console.error("Failed to refresh access token")
            return null
        }
        response = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

    }
    return await response.json()
}



export { fetchSpotifyApi }