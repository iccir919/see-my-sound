console.log("api.js loaded")

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


const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refresh_token")
    if (!refreshToken) {
        console.error("No refresh token found")
        return null
    }

    const body = new URLSearchParams({
        client_id: clientId,
        grant_type: "refresh_token",
        refresh_token: refreshToken
    })

    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: body
    })

    const data = await response.json()
    if (data.access_token) {
        localStorage.setItem("access_token", data.access_token)
        if (data.refresh_token) {
            localStorage.setItem("refresh_token", data.refresh_token)
        }
        return data.access_token
    } else {
        console.error("Failed to refresh access token", data)
        return null
    }
}


export { fetchSpotifyApi }