console.log("api.js loaded")

import { refreshAccessToken } from "./auth.js"

const fetchSpotifyData = async (endpoint, method = 'GET', body = null) => {
    let accessToken = localStorage.getItem("access_token")
    if (!accessToken) {
        console.error("No access token found")
        return null
    }
    console.log("Using access token:", accessToken)

    let response = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })

    if (response.status === 401) {
        console.warn("Access token expired or invalid")
        accessToken = await refreshAccessToken()
        console.log("Refreshed token:", accessToken)
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

export { fetchSpotifyData }