console.log("api.js loaded")

import { refreshAccessToken } from "./auth.js"

const spotifyFetch = async (url, accessToken) => {
    let response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })

    if (response.status === 401) {
        console.log("Access token expired, refreshing...")
        const newAccessToken = await refreshAccessToken()

        if (newAccessToken) {
            console.log("Retrying original request with new access token")
            response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${newAccessToken}`
                }
            })
        } else {
            console.error("Failed to refresh access token")
            return null
        }   
    }

    if (!response.ok) {
        console.error("API request failed", await response.text())
        return null
    }
    return await response.json()
}

export { spotifyFetch }